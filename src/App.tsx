import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router';
import { QuizProvider } from './hooks/QuizContext';
import { GroupTabProvider } from './hooks/GroupTabContext';
import { SearchKeywordProvider } from './hooks/SearchKeywordContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SearchKeywordProvider>
          <QuizProvider>
            <GroupTabProvider>
              <Router />
            </GroupTabProvider>
          </QuizProvider>
        </SearchKeywordProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
