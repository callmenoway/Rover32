import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { ReactNode } from "react";

const clientId = "919763154480-u2q39e7vubr5cl5smth8ciqeodnpq6io.apps.googleusercontent.com"; // Sostituisci con il tuo Client ID

// Il provider di autenticazione Google
export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>; //fornisce il clientId a tutti i componenti figli
}
