import React from 'react';
import { AppProvider } from '@/context/AppContext';
import AuthScreen from './components/AuthScreen';

export default function SignUpLoginPage() {
  return (
    <AppProvider>
      <AuthScreen />
    </AppProvider>
  );
}