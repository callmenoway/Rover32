// This import is needed for module augmentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Extends the default NextAuth User interface.
     * @remarks
     * This declaration is used to add custom properties to the User object.
     * The @typescript-eslint/no-unused-vars rule is disabled for this type declaration.
     * @typedef {Object} User
     * @property {string} username - The username of the user
     */
    // @typescript-eslint/no-unused-vars
    interface User {
        username: string
    }

    interface Session {
        user: User & {
            username: string
        }
        token: {
            username: string
        }
    }
}