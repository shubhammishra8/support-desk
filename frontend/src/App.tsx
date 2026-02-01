import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TicketListPage   from '@/features/tickets/TicketListPage';
import TicketDetailPage from '@/features/tickets/TicketDetailPage';
import CreateTicketPage from '@/features/tickets/CreateTicketPage';
import Layout           from '@/components/Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:     3,
      staleTime: 30_000,
      gcTime:    300_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"                 element={<Navigate to="/tickets" replace />} />
            <Route path="/tickets"          element={<TicketListPage />}   />
            <Route path="/tickets/new"      element={<CreateTicketPage />} />
            <Route path="/tickets/:id"      element={<TicketDetailPage />} />
            <Route path="*"                 element={<Navigate to="/tickets" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
