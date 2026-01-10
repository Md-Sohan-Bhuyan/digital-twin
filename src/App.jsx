import React from 'react';
import { RouterProvider } from "react-router/dom";
import router from './routes/router';
import ErrorBoundary from './Components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;