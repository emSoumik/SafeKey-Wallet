'use client';

import React, { useState } from 'react';

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const getDerivedStateFromError = () => {
    setHasError(true);
  };

  if (hasError) {
    return <div>Something went wrong.</div>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
