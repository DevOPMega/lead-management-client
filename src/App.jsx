import { ErrorBoundary } from "react-error-boundary";
import AppRoutes from "./routes";
import { Toaster } from 'sonner'
import ErrorFallback from "./components/ErrorFallback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    // defaultOptions: {
    //   queries: {
    //     staleTime: 5 * 60 * 1000, // 5 minutes
    //     cacheTime: 10 * 60 * 1000, // 10 minutes
    //     refetchOnWindowFocus: true,
    //     refetchOnReconnect: true,
    //   },
    // },
});

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
    const handleReset = () => {
        window.location.reload();
    };

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
                <Toaster />
                <AppRoutes />
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;
