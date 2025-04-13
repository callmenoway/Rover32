import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { db } from "./db";
import { compare } from "bcrypt";
import * as z from "zod";

const userSchema = z.object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
});

const customPrismaAdapter = {
    ...PrismaAdapter(db),
    createUser: async (userData: any) => {
        const { name, ...validUserData } = userData;

        const username = name?.split(" ").join("_").toLowerCase() ?? 
                        userData.email?.split("@")[0] ?? 
                        "user_" + Math.random().toString(36).substring(2, 10);

        return db.user.create({
            data: {
            ...validUserData,
            username,
            password: "",
            },
        });
    },
};

export const authOptions: NextAuthOptions = {
    adapter: customPrismaAdapter,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 1 * 24 * 60 * 60, // sessione di 1 giorno
    },
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out',
        error: '/auth/error',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@mail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                throw new Error("Email and password are required.");
                }

                const existingUser = await db.user.findUnique({
                where: { email: credentials.email },
                });

                if (!existingUser) {
                throw new Error("The email address and password do not match.");
                }

                const passwordMatch = await compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                throw new Error("The email address and password do not match.");
                }

                return {
                id: `${existingUser.id}`,
                username: existingUser.username || "default_username",
                email: existingUser.email,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id as string,
                username: token.username as string,
            };
            return session;
        },
        async signIn() {
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
                return `${baseUrl}/dashboard`;
            }
            return url;
        }
    }
};