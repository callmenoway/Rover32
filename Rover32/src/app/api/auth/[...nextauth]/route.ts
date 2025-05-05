import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

// Use environment variable for Turnstile secret key
const TURNSTILE_SECRET_KEY = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY as string;

// Function to verify Turnstile token
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
  return data.success;
}

// Create a custom adapter based on PrismaAdapter
const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createUser: async (data: any) => {
    // Filter out fields that don't exist in your schema
    const { name, ...validData } = data;
    
    // Create username based on incoming data
    const username = name?.replace(/\s+/g, '_').toLowerCase() || 
                    data.email?.split('@')[0] || 
                    `user_${Math.random().toString(36).substring(2, 10)}`;
    
    // Create user with valid fields
    const user = await prisma.user.create({
      data: {
        ...validData,
        username,
        password: "", // Add default empty password
      },
    });
    return user;
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "CAPTCHA Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.captchaToken) {
          throw new Error("Missing credentials");
        }
        
        // Verify the CAPTCHA token
        const captchaVerified = await verifyCaptcha(credentials.captchaToken);
        if (!captchaVerified) {
          throw new Error("CAPTCHA verification failed");
        }
        
        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
          
          // If user not found, return null
          if (!user) {
            throw new Error("Invalid email or password");
          }
          
          // Check if password matches
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            throw new Error("Invalid email or password");
          }
          
          // Return user data for the session
          return {
            id: user.id,
            email: user.email,
            username: user.username || user.email.split('@')[0],
            // Add any other user properties needed for the session
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        } finally {
          // Disconnect from Prisma to prevent connection leaks
          await prisma.$disconnect();
        }
      }
    }),
    // Add OAuth providers
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
    strategy: "jwt",
  },
  pages: {
    signIn: '/sign-in',  // Changed from '/signin' to '/sign-in' to match your route structure
    error: '/auth/error', // This should point to a valid error page
  },
  callbacks: {
    async jwt({ token, user }) {
      // If the user object exists, it means we're signing in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    // Add signIn callback to properly handle account creation and redirects
    async signIn({ user, account }) {
      // For OAuth sign-ins, allow linking accounts by email
      if (account?.provider) {
        try {
          // First check if this OAuth account already exists
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId
            }
          });
          
          // If the account already exists, no need to create it again
          if (existingAccount) {
            return true;
          }
          
          // Check if there's a user with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email as string }
          });
          
          // If user exists but account doesn't, link the account
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
              // If account creation fails because it already exists, just continue
              console.log("Account linking error (likely already exists):", err);
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          // Still allow sign-in even if there's an error with account linking
        }
      }
      
      // Always return true to allow sign-in
      return true;
    },
    
    // Add redirect callback to properly handle redirection after sign-in
    async redirect({ url, baseUrl }) {
      // If the URL starts with the base URL, allow it
      if (url.startsWith(baseUrl)) return url;
      
      // If it's a relative URL, prefix it with the base URL
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Otherwise, return to the base URL
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Using Route Handler syntax for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };