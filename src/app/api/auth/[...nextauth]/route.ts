import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import { db } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
    providers: [
        // OAuth providers
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                // email: { label: "Email", type: "email", placeholder: "devlprnitish@gmail.com" },
                // password: { label: "Password", type: "password", placeholder: "********" }
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    // Find user by email
                    const user = await db.user.findUnique({
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
                        name: user.name
                    }
                } catch (error) {
                    console.error("Authentication error:", error)
                    return null
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            // Add user ID to session
            if (token.sub && session.user) {
                (session.user as any).id = token.sub
            }
            return session
        },
        async jwt({ token, user, account }) {
            // Add user ID to JWT token on sign in
            if (user) {
                token.sub = user.id
            }
            
            // For OAuth providers, we might need to find/create user in database
            if (account && (account.provider === "google" || account.provider === "github")) {
                try {
                    const existingUser = await db.user.findUnique({
                        where: { email: user.email! }
                    })
                    
                    if (existingUser) {
                        token.sub = existingUser.id
                    } else {
                        // Create new user for OAuth
                        const newUser = await db.user.create({
                            data: {
                                email: user.email!,
                                name: user.name || user.email!.split("@")[0],
                                // no password for OAuth users
                            }
                        })
                        token.sub = newUser.id
                    }
                } catch (error) {
                    console.error("Error handling OAuth user:", error)
                }
            }
            
            return token
        }
    },
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your .env file
})

export { handler as GET, handler as POST }