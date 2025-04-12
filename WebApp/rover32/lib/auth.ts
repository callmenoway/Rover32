import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in'
    },
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith@mail.com" },
            password: { label: "Password", type: "password" }
          },

          async authorize(credentials, req) {
            if(!credentials?.email || !credentials?.password) {
                return null;
            }

            const existingUser = await db.user.findUnique({
                where: { email: credentials?.email }
            });
            if(!existingUser) {
                return null;
            }

            const passowrdMatch = await compare(credentials.password, existingUser.password);

            if(!passowrdMatch) {
                return null
            }

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email
            }
          }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            console.log(token, user);

            if(user) {
                return {
                    ...token,
                    username: user.username
                }
            }
            return token
        },
        async session({ session, user, token }) {
            console.log(token, user, session);
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }
        },
    }
}