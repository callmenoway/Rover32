import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { db } from "./db";

//! Rimozione dell'importazione diretta di bcrypt per evitare problemi sul client
// import { compare } from "bcrypt";

//? Adapter Prisma personalizzato per NextAuth
const customPrismaAdapter = {
    //? Estende l'adapter Prisma base
    ...PrismaAdapter(db),

    //? Sovrascrive il metodo createUser per gestire username
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createUser: async (userData: any) => {
        const { name, ...validUserData } = userData;

        //? Genera un username basato sul nome o email, o casuale come fallback
        const username = name?.split(" ").join("_").toLowerCase() ?? 
                        userData.email?.split("@")[0] ?? 
                        "user_" + Math.random().toString(36).substring(2, 10);

        //? Crea l'utente nel database
        return db.user.create({
            data: {
                ...validUserData,
                username,
                password: "",
                emailVerified: new Date(),
            },
        });
    },
};

//? Configurazione principale di NextAuth
export const authOptions: NextAuthOptions = {
    adapter: customPrismaAdapter,
    secret: process.env.NEXTAUTH_SECRET,

    //? Configurazione della sessione
    session: {
        strategy: 'jwt',
        maxAge: 1 * 24 * 60 * 60, //sessione di 1 giorno
    },

    //? Pagine personalizzate
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out',
        error: '/auth/error',
    },

    //? Provider di autenticazione
    providers: [
        //? Provider Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        //? Provider GitHub
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

        //? Provider Discord
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string
        }),

        //? Provider credenziali (email/password)
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@mail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                //! Validazione dei dati di input
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }

                // Solo il codice lato server arriverà a questo punto
                const existingUser = await db.user.findUnique({
                    where: { email: credentials.email },
                });

                //? Se l'utente non esiste, lancia un errore
                if (!existingUser) {
                    throw new Error("The email address and password do not match.");
                }

                //! Importa bcrypt dinamicamente solo sul server
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const { compare } = require("bcrypt");

                //? Verifica la password
                const passwordMatch = await compare(credentials.password, existingUser.password);

                //? Se la password non corrisponde, lancia un errore
                if (!passwordMatch) {
                    throw new Error("The email address and password do not match.");
                }

                //? Restituisce i dati dell'utente per la sessione
                return {
                    id: `${existingUser.id}`,
                    username: existingUser.username || "default_username",
                    email: existingUser.email,
                };
            }
        })
    ],
    
    //? Callback per personalizzare il comportamento di NextAuth
    callbacks: {
        //? Callback jwt per arricchire il token con dati aggiuntivi
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },

        //? Callback session per arricchire la sessione con dati aggiuntivi
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id as string,
                username: token.username as string,
            };
            return session;
        },

        //? Callback signIn per gestire il processo di accesso
        async signIn({ user, account, profile }) {
            if (account?.provider && user) {
                //? Cerca se esiste già un account con lo stesso provider
                const existingAccount = await db.account.findFirst({
                    where: {
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    },
                });

                if (!existingAccount) {
                    //? Cerca se esiste già un utente con la stessa email
                    let existingUser = await db.user.findUnique({
                        where: { email: profile?.email || "" },
                    });

                    if (!existingUser) {
                        //? Crea un nuovo utente se non esiste con la stessa email
                        const username = profile?.name?.split(" ").join("_").toLowerCase() ??
                                         profile?.email?.split("@")[0] ??
                                         "user_" + Math.random().toString(36).substring(2, 10);

                        existingUser = await db.user.create({
                            data: {
                                email: profile?.email || "",
                                username,
                                password: "", // Password predefinita per utenti OAuth
                            },
                        });
                    }

                    //? Collega il nuovo account all'utente esistente
                    await db.account.create({
                        data: {
                            userId: existingUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            type: account.type,
                            access_token: account.access_token || null,
                            expires_at: account.expires_at || null,
                        },
                    });
                }
            }
            return true;
        },

        //? Callback redirect per gestire i reindirizzamenti dopo l'autenticazione
        async redirect({ url, baseUrl }) {
            // Non reindirizza automaticamente a /vehicles
            // Consente URL di callback relativi
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Consente URL di callback sulla stessa origine
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    }
};

//TODO Implementare validazione email per gli account creati con credenziali
//TODO Aggiungere autenticazione a due fattori