
import express from 'express';
import { cronService } from '../services/cronService';
import { payoutService } from '../services/payoutService';
import { storage } from '../storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { auditService } from '../services/auditService';
import { monitoringService } from '../services/monitoringService';

const router = express.Router();

// Apply admin authentication to all routes in this router
router.use(requireAdmin);

// Health check endpoint for admin monitoring
router.get('/health', async (req: AuthenticatedRequest, res) => {
  try {
    const healthStatus = await monitoringService.getSystemHealth();
    
    // Log health check access
    await auditService.logAdminAction(
      req.user!.id,
      'health_check',
      'system',
      'health',
      { status: healthStatus.status },
      req
    );

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Manually trigger monthly payouts (for testing/admin use)
router.post('/trigger-monthly-payouts', async (req: AuthenticatedRequest, res) => {
  try {
    // Log admin action using audit service
    await auditService.logAdminAction(
      req.user!.id,
      'trigger_monthly_payouts',
      'system',
      'payouts',
      { trigger_type: 'manual' },
      req,
      'info'
    );

    await cronService.triggerMonthlyPayouts();
    
    res.json({
      success: true,
      message: 'Monthly payouts triggered successfully'
    });
  } catch (error: any) {
    console.error('Error triggering monthly payouts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to trigger monthly payouts'
    });
  }
});

// Get admin payout dashboard data
router.get('/payout-dashboard', async (req, res) => {
  try {
    const stats = await payoutService.getPayoutStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching admin payout dashboard:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payout dashboard data'
    });
  }
});

// Get platform statistics for admin dashboard
router.get('/platform-stats', async (req, res) => {
  try {
    const stats = await storage.getPlatformStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch platform statistics'
    });
  }
});

// Get top performing creators
router.get('/top-creators', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const topCreators = await storage.getTopCreators(limit);
    res.json(topCreators);
  } catch (error: any) {
    console.error('Error fetching top creators:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch top creators'
    });
  }
});

// Get system health metrics
router.get('/system-health', async (req, res) => {
  try {
    const systemHealth = await storage.getSystemHealth();
    res.json(systemHealth);
  } catch (error: any) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch system health'
    });
  }
});

// Get category statistics for admin
router.get('/category-stats', async (req, res) => {
  try {
    const stats = await storage.getCategoryStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch category statistics'
    });
  }
});

// Get all categories for admin management
router.get('/categories', async (req, res) => {
  try {
    const categories = await storage.getAllCategoriesWithCounts();
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching admin categories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories'
    });
  }
});

// Create new category (admin only)
router.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Category name is required'
      });
    }

    const categoryData = {
      name: name.trim(),
      description: description?.trim() || '',
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      icon: 'User',
      color: '#6366f1',
      is_active: true
    };

    const newCategory = await storage.createCategory(categoryData);
    res.json(newCategory);
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({
      error: error.message || 'Failed to create category'
    });
  }
});

// Update category (admin only)
router.put('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Category name is required'
      });
    }

    const categoryData = {
      name: name.trim(),
      description: description?.trim() || '',
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };

    const updatedCategory = await storage.updateCategory(categoryId, categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    res.json(updatedCategory);
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({
      error: error.message || 'Failed to update category'
    });
  }
});

// Delete category (admin only)
router.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const deleted = await storage.deleteCategory(categoryId);
    
    if (!deleted) {
      return res.status(400).json({
        error: 'Cannot delete category - it may be in use by creators'
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      error: error.message || 'Failed to delete category'
    });
  }
});

// Get system alerts with filtering
router.get('/system-alerts', async (req: AuthenticatedRequest, res) => {
  try {
    const status = req.query.status as string | undefined;
    const severity = req.query.severity as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;

    const alerts = await auditService.getSystemAlerts({
      status,
      severity,
      limit
    });

    // Log access to system alerts
    await auditService.logAdminAction(
      req.user!.id,
      'view_system_alerts',
      'system',
      'alerts',
      { filters: { status, severity, limit } },
      req
    );

    res.json(alerts);
  } catch (error: any) {
    console.error('Error fetching system alerts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch system alerts'
    });
  }
});

// Acknowledge a system alert
router.patch('/system-alerts/:id/acknowledge', async (req: AuthenticatedRequest, res) => {
  try {
    const alertId = parseInt(req.params.id);
    const userId = req.user!.id;

    const updatedAlert = await storage.acknowledgeSystemAlert(alertId, userId);

    if (!updatedAlert) {
      return res.status(404).json({
        error: 'Alert not found'
      });
    }

    // Log the action
    await auditService.logAdminAction(
      userId,
      'acknowledge_system_alert',
      'system_alert',
      alertId.toString(),
      { alertId, severity: updatedAlert.severity },
      req
    );

    res.json(updatedAlert);
  } catch (error: any) {
    console.error('Error acknowledging system alert:', error);
    res.status(500).json({
      error: error.message || 'Failed to acknowledge system alert'
    });
  }
});

// Resolve a system alert
router.patch('/system-alerts/:id/resolve', async (req: AuthenticatedRequest, res) => {
  try {
    const alertId = parseInt(req.params.id);
    const userId = req.user!.id;

    const updatedAlert = await storage.resolveSystemAlert(alertId, userId);

    if (!updatedAlert) {
      return res.status(404).json({
        error: 'Alert not found'
      });
    }

    // Log the action
    await auditService.logAdminAction(
      userId,
      'resolve_system_alert',
      'system_alert',
      alertId.toString(),
      { alertId, severity: updatedAlert.severity },
      req
    );

    res.json(updatedAlert);
  } catch (error: any) {
    console.error('Error resolving system alert:', error);
    res.status(500).json({
      error: error.message || 'Failed to resolve system alert'
    });
  }
});

export default router;
