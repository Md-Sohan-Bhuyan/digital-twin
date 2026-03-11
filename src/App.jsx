import React from 'react';
import { RouterProvider } from "react-router/dom";
import router from './routes/router';
import ErrorBoundary from './Components/ErrorBoundary';
import ToastViewport from './Components/Feedback/ToastViewport';
import ConnectionBanner from './Components/Realtime/ConnectionBanner';

const App = () => {
  return (
    <ErrorBoundary>
      <ToastViewport />
      <ConnectionBanner />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;