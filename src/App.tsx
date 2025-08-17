import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router';
import { QuizProvider } from './hooks/QuizContext';
import { GroupTabProvider } from './hooks/GroupTabContext';
import { SearchKeywordProvider } from './hooks/SearchKeywordContext';
import { CurrentStepProvider } from './hooks/CurrentStepContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SearchKeywordProvider>
          <GroupTabProvider>
            <QuizProvider>
              <CurrentStepProvider>
                <Router />
              </CurrentStepProvider>
            </QuizProvider>
          </GroupTabProvider>
        </SearchKeywordProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
