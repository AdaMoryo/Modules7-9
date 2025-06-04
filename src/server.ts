/* eslint-disable no-console */
import express from 'express';
import apiRoutes from './routes/api.routes';
import { errorHandler } from './middlewares/errorHandler';
import { rateLimiterMiddleware } from './middlewares/rateLimiter/rateLimiter';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(rateLimiterMiddleware);
app.use('/api', apiRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
