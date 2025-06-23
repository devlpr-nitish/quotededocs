import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
// @ts-ignore - Prisma client will be available after installation
import { PrismaClient } from "@prisma/client"
// @ts-ignore - bcryptjs will be available after installation
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export default NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID || "",
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "email-password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    // Find user by email
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })

                    if (!user || !user.password) {
                        return null
                    }

                    // Compare password with hashed password
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        return null
                    }

                    // Return user object (without password)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image
                    }
                } catch (error) {
                    console.error("Authentication error:", error)
                    return null
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            // Add user ID to session
            if (token.sub && session.user) {
                (session.user as any).id = token.sub
            }
            return session
        },
        async jwt({ token, user }) {
            // Add user ID to JWT token
            if (user) {
                token.sub = user.id
            }
            return token
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: "jwt"
    }
})