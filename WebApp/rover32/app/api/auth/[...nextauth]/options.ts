import type {NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Username"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password"
                }
            },
            async authorize(credentials) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const user = { id: "42", name: "admin", password: "admin" }
                if (credentials?.username === user.name && credentials?.password === user.password){
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    
    // session: {
    //     // Choose how you want to save the user session.
    //     // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    //     // If you use an `adapter` however, we default it to `"database"` instead.
    //     // You can still force a JWT session by explicitly defining `"jwt"`.
    //     // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    //     // which is used to look up the session in the database.
    //     strategy: "database",
    //     // Seconds - How long until an idle session expires and is no longer valid.
    //     maxAge: 30 * 24 * 60 * 60, // 30 days
    //     // Seconds - Throttle how frequently to write to database to extend a session.
    //     // Use it to limit write operations. Set to 0 to always update the database.
    //     // Note: This option is ignored if using JSON Web Tokens
    //     updateAge: 24 * 60 * 60, // 24 hours
    //     // The session token is usually either a random UUID or string, however if you
    //     // need a more customized session token string, you can define your own generate function.
    //     generateSessionToken: () => {
    //       return randomUUID?.() ?? randomBytes(32).toString("hex")
    //     }
    // },
}