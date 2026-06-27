"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmqp7xrib001v0ckweil8vixa";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google"],
        appearance: {
          theme: "dark",
          accentColor: "#4e48da",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
