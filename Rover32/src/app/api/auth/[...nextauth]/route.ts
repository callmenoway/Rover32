import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter";

//! Inizializza il client Prisma per interagire con il database
const prisma = new PrismaClient();

//? Recupera la chiave segreta di Turnstile dagli environment variables
const TURNSTILE_SECRET_KEY = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY as string;

//! Funzione per verificare il token CAPTCHA di Cloudflare Turnstile
async function verifyCaptcha(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const data = await response.json();
  return data.success; //? Restituisce true se la verifica ha successo
}

//! Adattatore personalizzato basato su PrismaAdapter per gestire la creazione utente
const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createUser: async (data: any) => {
    //? Rimuove i campi non presenti nello schema
    const { name, ...validData } = data;
    
    //? Genera uno username a partire dal nome o dall'email
    const username = name?.replace(/\s+/g, '_').toLowerCase() || 
                    data.email?.split('@')[0] || 
                    `user_${Math.random().toString(36).substring(2, 10)}`;
    
    //? Crea l'utente con i campi validi e password vuota di default
    const user = await prisma.user.create({
      data: {
        ...validData,
        username,
        password: "", //? Password vuota per utenti OAuth
      },
    });
    return user;
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter, //? Usa l'adattatore personalizzato
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "CAPTCHA Token", type: "text" }
      },
      async authorize(credentials) {
        //? Controlla che tutte le credenziali siano presenti
        if (!credentials?.email || !credentials?.password || !credentials?.captchaToken) {
          throw new Error("Missing credentials");
        }
        
        //? Verifica il token CAPTCHA
        const captchaVerified = await verifyCaptcha(credentials.captchaToken);
        if (!captchaVerified) {
          throw new Error("CAPTCHA verification failed");
        }
        
        try {
          //? Cerca l'utente tramite email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
          
          //? Se l'utente non esiste, errore
          if (!user) {
            throw new Error("Invalid email or password");
          }
          
          //? Verifica la password tramite bcrypt
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            throw new Error("Invalid email or password");
          }
          
          //? Restituisce i dati utente per la sessione
          return {
            id: user.id,
            email: user.email,
            username: user.username || user.email.split('@')[0],
            //? Altri campi utente se necessari
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        } finally {
          //? Disconnette Prisma per evitare memory leak
          await prisma.$disconnect();
        }
      }
    }),
    //? Provider OAuth: Google, GitHub, Discord
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt", //? Usa JWT per la gestione della sessione
  },
  pages: {
    signIn: '/sign-in',  //! Pagina personalizzata per il login
    error: '/auth/error', //? Pagina per la gestione degli errori
  },
  callbacks: {
    //? Callback per aggiungere dati custom al JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    //? Callback per aggiungere dati custom alla sessione
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    //? Callback per gestire la creazione/linking degli account OAuth
    async signIn({ user, account }) {
      if (account?.provider) {
        try {
          //? Verifica se l'account OAuth esiste già
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId
            }
          });
          
          //? Se esiste già, non fare nulla
          if (existingAccount) {
            return true;
          }
          
          //? Cerca utente tramite email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email as string }
          });
          
          //? Se l'utente esiste ma l'account no, crea il collegamento
          if (existingUser) {
            try {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                }
              });
            } catch (err) {
              //? Se fallisce perché già esiste, ignora l'errore
              console.log("Account linking error (likely already exists):", err);
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          //? Permetti comunque il login anche se il linking fallisce
        }
      }
      return true; //? Permetti sempre il login
    },
    //? Callback per gestire i redirect dopo il login
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET, //? Chiave segreta per NextAuth
};

//! Handler per le route GET e POST secondo la sintassi App Router di Next.js
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
