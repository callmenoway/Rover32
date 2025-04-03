import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client("919763154480-u2q39e7vubr5cl5smth8ciqeodnpq6io.apps.googleusercontent.com");

export async function verifyGoogleToken(token: string) {
  const ticket = await client.verifyIdToken({ //verifica il token
    idToken: token, //token ricevuto dal client
    audience: "919763154480-u2q39e7vubr5cl5smth8ciqeodnpq6io.apps.googleusercontent.com", //client ID
  });
  const payload = ticket.getPayload(); //ottieni i dati dell'utente
  return payload; //ritorna i dati dell'utente
}
