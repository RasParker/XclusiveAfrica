import { storage } from '../storage';
import { InsertAuditLog } from '@shared/schema';

export class AuditService {
  /**
   * Logs an admin action with automatic capture of request metadata
   */
  async logAdminAction(
    userId: number,
    action: string,
    resourceType: string,
    resourceId: string,
    details: any = {},
    req?: any,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ) {
    try {
      const auditLog: InsertAuditLog = {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        ip_address: req?.ip || req?.connection?.remoteAddress,
        user_agent: req?.get?.('User-Agent'),
        severity,
        status: 'success'
      };

      return await storage.createAuditLog(auditLog);
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Create a system alert for audit logging failure
      await this.createSystemAlert(
        'security',
        'critical',
        'Audit Logging Failure',
        `Failed to log admin action: ${action} for user ${userId}`,
        'audit_service',
        { originalAction: action, error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  /**
   * Logs a system event (no user associated)
   */
  async logSystemEvent(
    action: string,
    resourceType: string,
    resourceId: string,
    details: any = {},
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info',
    status: 'success' | 'failure' | 'pending' = 'success'
  ) {
    try {
      const auditLog: InsertAuditLog = {
        user_id: null,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        severity,
        status
      };

      return await storage.createAuditLog(auditLog);
    } catch (error) {
      console.error('Failed to create system audit log:', error);
    }
  }

  /**
   * Creates a system alert
   */
  async createSystemAlert(
    type: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    title: string,
    message: string,
    source: string,
    metadata: any = {}
  ) {
    try {
      return await storage.createSystemAlert({
        type,
        severity,
        title,
        message,
        source,
        metadata,
        status: 'active'
      });
    } catch (error) {
      console.error('Failed to create system alert:', error);
    }
  }

  /**
   * Gets audit logs with filtering
   */
  async getAuditLogs(filters: {
    limit?: number;
    userId?: number;
    action?: string;
    resourceType?: string;
  } = {}) {
    return await storage.getAuditLogs(
      filters.limit,
      filters.userId,
      filters.action,
      filters.resourceType
    );
  }

  /**
   * Gets system alerts with filtering
   */
  async getSystemAlerts(filters: {
    status?: string;
    severity?: string;
    limit?: number;
  } = {}) {
    return await storage.getSystemAlerts(
      filters.status,
      filters.severity,
      filters.limit
    );
  }
}

export const auditService = new AuditService();