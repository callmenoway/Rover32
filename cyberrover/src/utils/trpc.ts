import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../trpc/server';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  url: 'http://localhost:4000',
});
