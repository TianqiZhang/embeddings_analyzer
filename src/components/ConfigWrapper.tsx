import React from 'react';

interface ConfigWrapperProps {
  children: React.ReactNode;
}

export function ConfigWrapper({ children }: ConfigWrapperProps) {
  return (
    <div className="absolute top-0 right-0">
      {children}
    </div>
  );
}