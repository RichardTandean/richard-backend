import { prisma } from '@/models';

export class CleanupService {
  /**
   * Clean up expired password reset tokens
   * This should be run periodically (e.g., via cron job)
   */
  static async cleanupExpiredResetTokens(): Promise<number> {
    try {
      const result = await prisma.passwordResetToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { usedAt: { not: null } }
          ]
        }
      });

      console.log(`Cleaned up ${result.count} expired reset tokens`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired reset tokens:', error);
      return 0;
    }
  }

  /**
   * Clean up old used reset tokens (older than 24 hours)
   */
  static async cleanupOldUsedTokens(): Promise<number> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const result = await prisma.passwordResetToken.deleteMany({
        where: {
          usedAt: { not: null },
          createdAt: { lt: oneDayAgo }
        }
      });

      console.log(`Cleaned up ${result.count} old used reset tokens`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up old used tokens:', error);
      return 0;
    }
  }

  /**
   * Run all cleanup tasks
   */
  static async runCleanup(): Promise<void> {
    console.log('Starting cleanup tasks...');
    
    const expiredTokens = await this.cleanupExpiredResetTokens();
    const oldUsedTokens = await this.cleanupOldUsedTokens();
    
    console.log(`Cleanup completed: ${expiredTokens + oldUsedTokens} tokens removed`);
  }
}
