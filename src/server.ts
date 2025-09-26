import app from './app';
import { prisma } from '@/models';
import { CleanupService } from '@/utils/cleanup';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
    });

    // Run cleanup every hour
    setInterval(async () => {
      try {
        await CleanupService.runCleanup();
      } catch (error) {
        console.error('Error during scheduled cleanup:', error);
      }
    }, 60 * 60 * 1000); // 1 hour
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
