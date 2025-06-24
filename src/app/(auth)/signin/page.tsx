'use client'

import { useState } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [providers, setProviders] = useState<any>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const urlError = searchParams.get('error')

    useEffect(() => {
        // Get available providers
        getProviders().then(setProviders)

        // Show error from URL params
        if (urlError) {
            setError(getErrorMessage(urlError))
        }
    }, [urlError])

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else if (result?.ok) {
                router.push(callbackUrl)
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthSignIn = (providerId: string) => {
        signIn(providerId, { callbackUrl })
    }

    const getErrorMessage = (error: string) => {
        switch (error) {
            case 'CredentialsSignin':
                return 'Invalid email or password'
            case 'OAuthSignin':
                return 'Error with OAuth provider'
            case 'OAuthCallback':
                return 'Error in OAuth callback'
            case 'OAuthCreateAccount':
                return 'Could not create OAuth account'
            case 'EmailCreateAccount':
                return 'Could not create email account'
            case 'Callback':
                return 'Error in callback'
            default:
                return 'An error occurred during sign in'
        }
    }

    return (
        <div className="min-h-[18rem] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                        Sign in to your account
                    </h2>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-destructive border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                {/* Credentials Form */}
                <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignIn}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Email address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-input rounded-md placeholder:text-muted-foreground text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-input rounded-md placeholder:text-muted-foreground text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? 'Signing in...' : 'Sign in with Email'}
                        </Button>
                    </div>
                </form>

                {/* OAuth Providers */}
                {providers && (
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            {Object.values(providers).map((provider: any) => {
                                if (provider.id === 'credentials') return null

                                let Icon = null
                                if (provider.id === 'github') Icon = FaGithub
                                else if (provider.id === 'google') Icon = FaGoogle

                                return (
                                    <Button
                                        key={provider.id}
                                        onClick={() => handleOAuthSignIn(provider.id)}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer gap-2"
                                    >
                                        {Icon && <Icon className="mr-2 h-5 w-5" />}
                                        <span className="capitalize">{provider.name}</span>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-medium text-primary hover:text-primary/90">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}