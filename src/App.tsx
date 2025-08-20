import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router';
import { QuizProvider } from './hooks/QuizContext';
import { GroupTabProvider } from './hooks/GroupTabContext';
import { SearchKeywordProvider } from './hooks/SearchKeywordContext';
import { CurrentStepProvider } from './hooks/CurrentStepContext';
import { NavbarProvider } from './hooks/NavbarContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SearchKeywordProvider>
          <GroupTabProvider>
            <QuizProvider>
              <CurrentStepProvider>
                <NavbarProvider>
                  <Router />
                </NavbarProvider>
              </CurrentStepProvider>
            </QuizProvider>
          </GroupTabProvider>
        </SearchKeywordProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
