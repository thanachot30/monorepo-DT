import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorModalProvider } from './components/ErrorModalProvider';
import { SuccessModalProvider } from './components/SuccessModalProvider';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const queryClient = new QueryClient();

root.render(
  <SuccessModalProvider>
    <ErrorModalProvider>
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>
    </ErrorModalProvider>
  </SuccessModalProvider>

);
