import express from 'express';

import { APP_NAME } from '@ecom/shared';

// App factory kept separate from `listen()` so tests can mount the app without a port.
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: `${APP_NAME} API` });
  });

  return app;
}
