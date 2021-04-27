import logger from './util/logger';

import prisma from './prisma';
import startBot from './bot';

startBot()
  .catch((e) => {
    logger.error(`Failed to start | ${e.message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.error(error.message);
});
