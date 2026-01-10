import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-4">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            <details className="text-left bg-gray-900/50 rounded-lg p-4 mb-4">
              <summary className="text-red-400 cursor-pointer text-sm font-semibold mb-2">
                Error Details
              </summary>
              <pre className="text-xs text-gray-300 overflow-auto max-h-40">
                {error.message}
              </pre>
            </details>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={resetErrorBoundary}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Home size={18} />
              Go Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // In production, send to error tracking service
      }}
      onReset={() => {
        // Reset app state if needed
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
