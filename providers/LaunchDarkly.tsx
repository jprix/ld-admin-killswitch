'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LDProvider, useLDClient } from 'launchdarkly-react-client-sdk';

const clientSideID = process.env.NEXT_PUBLIC_LD_CLIENT_ID;

// ---- Fallback Context ----
const fallbackContext = {
  kind: 'user',
  key: 'fallback-guest',
  anonymous: true,
  custom: {
    featureAccess: 'readonly',
  },
};

// ---- Context Bridge ----
type LDContextValue = {
  context: any;
  setContext: (ctx: any) => void;
};

export const LDContextBridge = createContext<LDContextValue | null>(null);

export const useLDContextBridge = (): LDContextValue => {
  const ctx = useContext(LDContextBridge);
  if (!ctx) {
    throw new Error('useLDContextBridge must be used within LaunchDarklyProvider');
  }
  return ctx;
};

// ---- LDContextSync: calls identify() when context changes ----
const LDContextSync = () => {
  const { context } = useLDContextBridge();
  const ldClient = useLDClient();
  const firstRun = useRef(true);

  useEffect(() => {
    if (!ldClient || firstRun.current) {
      firstRun.current = false;
      return;
    }
    ldClient.identify(context);
  }, [context, ldClient]);

  return null;
};

// ---- LaunchDarkly Provider Component ----
export default function LaunchDarklyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [context, setContext] = useState(fallbackContext);

  return (
    <LDProvider clientSideID={clientSideID} context={context}>
      <LDContextBridge.Provider value={{ context, setContext }}>
        <LDContextSync />
        {children}
      </LDContextBridge.Provider>
    </LDProvider>
  );
}
