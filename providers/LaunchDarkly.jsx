import { useEffect, useState } from "react";
import { LDProvider } from "launchdarkly-react-client-sdk";

const clientSideID = process.env.NEXT_PUBLIC_LD_CLIENT_ID;

export default function LaunchDarklyProvider({ children }) {
  const [context, setContext] = useState(null);

  useEffect(() => {
    console.log("Initializing LaunchDarkly...");

    const userContext = {
      kind: "business",
      key: "user-1234", //change to any other value for v1Landing
      email: "admin@example.com",
      role: "admin",
      country: "US", // change to UK for v1Landing
      custom: {
        featureAccess: "admin",
        business_type: "Technology",
      },
    };

    setContext(userContext);
  }, []);

  if (!context) {
    console.log("Waiting for LaunchDarkly context...");
    return null;
  }

  return (
    <LDProvider clientSideID={clientSideID} context={context}>
      {children}
    </LDProvider>
  );
}