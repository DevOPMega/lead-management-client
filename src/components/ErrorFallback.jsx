import { Button } from "@/components/ui/button";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback" role="alert">
      <h2 className="error-fallback__title">Something went wrong!</h2>
      <div className="error-fallback__details">
        <p className="error-fallback__message">{error.message}</p>
        {/* {process.env.NODE_ENV === 'development' && (
          <pre className="error-fallback__stack">{error.stack}</pre>
        )} */}
      </div>
      <Button
        className="error-fallback__reset-button"
        onClick={resetErrorBoundary}
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorFallback;
