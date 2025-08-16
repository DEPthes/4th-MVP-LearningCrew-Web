import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router';
import { QuizProvider } from './hooks/QuizContext';
import { GroupTabProvider } from './hooks/GroupTabContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <QuizProvider>
          <GroupTabProvider>
            <Router />
          </GroupTabProvider>
        </QuizProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
