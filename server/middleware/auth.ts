import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'xclusive-secret-key-2024';

if (!JWT_SECRET) {
  console.error('SESSION_SECRET environment variable is required');
  process.exit(1);
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Try to get token from Authorization header first
  const authHeader = req.headers.authorization;
  let token = authHeader && authHeader.split(' ')[1];

  // If no Authorization header, try to get from cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Try to get token from Authorization header first
  const authHeader = req.headers.authorization;
  let token = authHeader && authHeader.split(' ')[1];

  // If no Authorization header, try to get from cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
    } catch (err) {
      // Token is invalid, but that's okay for optional auth
      console.log('Optional auth: Invalid token');
    }
  }

  next();
};

// Admin authentication middleware - requires user to be authenticated AND have admin role
// SECURITY: Admin routes ONLY accept Authorization header tokens, no cookies (prevents CSRF)
export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Admin routes MUST use Authorization header for security (no CSRF risk)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Admin routes do NOT accept cookie tokens to prevent CSRF attacks

  if (!token) {
    // Log authentication failure
    try {
      const { storage } = await import('../storage');
      await storage.createAuditLog({
        user_id: null,
        action: 'admin_auth_failure',
        resource_type: 'auth',
        resource_id: 'admin_access',
        details: { reason: 'no_token', path: req.path },
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        severity: 'warning',
        status: 'failure'
      });
    } catch (logError) {
      console.error('Failed to log auth failure:', logError);
    }

    return res.status(401).json({ 
      error: 'Authentication required', 
      message: 'Admin access requires authentication'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user still exists and has admin role in database
    const { storage } = await import('../storage');
    const user = await storage.getUser(decoded.id);
    
    if (!user || user.role !== 'admin' || user.status !== 'active') {
      // Log access denial
      await storage.createAuditLog({
        user_id: decoded.id,
        action: 'admin_access_denied',
        resource_type: 'auth',
        resource_id: 'admin_access',
        details: { 
          reason: !user ? 'user_not_found' : user.role !== 'admin' ? 'not_admin' : 'user_inactive',
          path: req.path 
        },
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        severity: 'warning',
        status: 'failure'
      });

      return res.status(403).json({ 
        error: 'Admin access required', 
        message: 'This endpoint requires administrator privileges'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    // Log token verification failure
    try {
      const { storage } = await import('../storage');
      await storage.createAuditLog({
        user_id: null,
        action: 'admin_token_invalid',
        resource_type: 'auth',
        resource_id: 'admin_access',
        details: { error: err instanceof Error ? err.message : 'unknown', path: req.path },
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        severity: 'warning',
        status: 'failure'
      });
    } catch (logError) {
      console.error('Failed to log token failure:', logError);
    }

    return res.status(401).json({ 
      error: 'Invalid or expired token',
      message: 'Please log in again'
    });
  }
};

// Role-based authentication middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(' ')[1];

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Access requires authentication'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;

      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: `Access requires one of the following roles: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        message: 'Please log in again'
      });
    }
  };
};