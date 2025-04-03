import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { authRouter } from './routers/auth';

const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(4000, () => {
  console.log('Server tRPC in ascolto su http://localhost:4000');
});
