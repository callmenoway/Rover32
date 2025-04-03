import React from 'react';
import { trpcClient } from './utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Login';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <div className="app">
          <Login />
        </div>
      </trpc.Provider>
    </QueryClientProvider>
  );
};

export default App;
