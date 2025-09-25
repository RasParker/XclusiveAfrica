import { auditService } from './auditService';

export class MonitoringService {
  private intervalId: NodeJS.Timeout | null = null;
  private lastPerformanceCheck = Date.now();
  private errorCount = 0;
  private readonly maxErrorsPerHour = 50;

  /**
   * Starts the monitoring service
   */
  start() {
    console.log('Starting monitoring service...');
    
    // Run system health checks every 5 minutes
    this.intervalId = setInterval(() => {
      this.runHealthChecks().catch(error => {
        console.error('Health check failed:', error);
        this.recordError('health_check_failed', error);
      });
    }, 5 * 60 * 1000);

    // Initial health check
    this.runHealthChecks().catch(error => {
      console.error('Initial health check failed:', error);
    });
  }

  /**
   * Stops the monitoring service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Monitoring service stopped');
    }
  }

  /**
   * Runs comprehensive health checks
   */
  private async runHealthChecks() {
    try {
      await this.checkDatabaseHealth();
      await this.checkMemoryUsage();
      await this.checkErrorRate();
      await this.checkCriticalAlerts();
    } catch (error) {
      console.error('Health checks failed:', error);
      await this.recordError('health_check_system_failure', error);
    }
  }

  /**
   * Checks database connectivity and performance
   */
  private async checkDatabaseHealth() {
    try {
      const startTime = Date.now();
      
      // Simple database connectivity test
      await import('../storage').then(({ storage }) => 
        storage.getUser(1) // Try to get a user to test DB connection
      );
      
      const responseTime = Date.now() - startTime;
      
      if (responseTime > 5000) { // 5 seconds threshold
        await auditService.createSystemAlert(
          'performance',
          'high',
          'Database Performance Warning',
          `Database query took ${responseTime}ms, which exceeds the 5-second threshold`,
          'monitoring_service',
          { responseTime, query: 'basic_user_query' }
        );
      }
    } catch (error) {
      await auditService.createSystemAlert(
        'error',
        'critical',
        'Database Connection Failure',
        'Failed to connect to database during health check',
        'monitoring_service',
        { error: error instanceof Error ? error.message : 'Unknown database error' }
      );
    }
  }

  /**
   * Checks memory usage
   */
  private async checkMemoryUsage() {
    try {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;

      // Alert if memory usage is above 90% (more reasonable threshold)
      if (heapUsagePercent > 90) {
        await auditService.createSystemAlert(
          'performance',
          heapUsagePercent > 98 ? 'critical' : 'high', // Critical only at 98%+ 
          'High Memory Usage Alert',
          `Memory usage is at ${heapUsagePercent.toFixed(1)}% (${heapUsedMB}MB/${heapTotalMB}MB)`,
          'monitoring_service',
          { memUsage, heapUsagePercent }
        );
      }
    } catch (error) {
      console.error('Memory check failed:', error);
    }
  }

  /**
   * Checks error rate over the last hour
   */
  private async checkErrorRate() {
    try {
      if (this.errorCount > this.maxErrorsPerHour) {
        await auditService.createSystemAlert(
          'error',
          'high',
          'High Error Rate Alert',
          `Error count (${this.errorCount}) exceeded threshold (${this.maxErrorsPerHour}) in the last hour`,
          'monitoring_service',
          { errorCount: this.errorCount, threshold: this.maxErrorsPerHour }
        );
        
        // Reset error count after alerting
        this.errorCount = 0;
      }
    } catch (error) {
      console.error('Error rate check failed:', error);
    }
  }

  /**
   * Checks for critical alerts that need immediate attention
   */
  private async checkCriticalAlerts() {
    try {
      const criticalAlerts = await auditService.getSystemAlerts({
        status: 'active',
        severity: 'critical',
        limit: 10
      });

      if (criticalAlerts.length > 5) {
        console.warn(`Multiple critical alerts detected: ${criticalAlerts.length}`);
        // Could integrate with external alerting service here
      }
    } catch (error) {
      console.error('Critical alerts check failed:', error);
    }
  }

  /**
   * Records an error for monitoring
   */
  async recordError(type: string, error: any, metadata: any = {}) {
    try {
      this.errorCount++;
      
      await auditService.logSystemEvent(
        'error_occurred',
        'system',
        type,
        {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
          ...metadata
        },
        'error',
        'failure'
      );
    } catch (logError) {
      console.error('Failed to record error:', logError);
    }
  }

  /**
   * Records a security event
   */
  async recordSecurityEvent(event: string, details: any = {}, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    try {
      await auditService.createSystemAlert(
        'security',
        severity,
        `Security Event: ${event}`,
        `Security event detected: ${event}`,
        'monitoring_service',
        details
      );

      await auditService.logSystemEvent(
        'security_event',
        'security',
        event,
        details,
        severity === 'critical' || severity === 'high' ? 'critical' : 'warning'
      );
    } catch (error) {
      console.error('Failed to record security event:', error);
    }
  }

  /**
   * Gets system health status
   */
  async getSystemHealth() {
    try {
      const memUsage = process.memoryUsage();
      const uptime = process.uptime();
      const criticalAlerts = await auditService.getSystemAlerts({
        status: 'active',
        severity: 'critical',
        limit: 1
      });

      return {
        status: criticalAlerts.length > 0 ? 'degraded' : 'healthy',
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
        },
        criticalAlerts: criticalAlerts.length,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get system health:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const monitoringService = new MonitoringService();