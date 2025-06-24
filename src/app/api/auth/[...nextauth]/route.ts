import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
// @ts-ignore - Prisma client will be available after installation
// import { PrismaClient } from "@prisma/client"
// // @ts-ignore - bcryptjs will be available after installation
// import bcrypt from "bcryptjs"

// const prisma = new PrismaClient()

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "devlprnitish@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "********" }
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    // Find user by email
                    // const user = await prisma.user.findUnique({
                    //     where: {
                    //         email: credentials.email
                    //     }
                    // })

                    // if (!user || !user.password) {
                    //     return null
                    // }

                    // // Compare password with hashed password
                    // const isPasswordValid = await bcrypt.compare(
                    //     credentials.password,
                    //     user.password
                    // // )

                    // if (!isPasswordValid) {
                    //     return null
                    // }

                    // // Return user object (without password)
                    // return {
                    //     id: user.id,
                    //     email: user.email,
                    //     name: user.name
                    // }

                    return {
                        id: "1",
                        email: "devlprnitish@gmail.com",
                        name: "Nitish"
                    }
                } catch (error) {
                    console.error("Authentication error:", error)
                    return null
                }
            }
        }),
    ],
    // callbacks: {
    //     async session({ session, token, user }) {
    //         // Add user ID to session
    //         if (token.sub && session.user) {
    //             (session.user as any).id = token.sub
    //         }
    //         return session
    //     },
    //     async jwt({ token, user }) {
    //         // Add user ID to JWT token
    //         if (user) {
    //             token.sub = user.id
    //         }
    //         return token
    //     }
    // },
    // pages: {
    //     signIn: '/signin',
    // },
    // session: {
    //     strategy: "jwt"
    // }
})

export { handler as GET, handler as POST }