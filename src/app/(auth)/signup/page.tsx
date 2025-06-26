'use client';
import { useState } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import AuthProviders from '@/components/custom/auth-providers';
import AuthSkeleton from '@/components/custom/auth-skeleton';




export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      toast.error(getErrorMessage(urlError))
    }
  }, [urlError])

  const handleCredentialsSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response  = await axios.post('/api/auth/signup', { name, email, password });
      const data = response.data;
      const user = data.user;

      if (!user) {
        toast.error('Failed to create user')
        return
      }

      console.log(user);

      toast.success('Account created successfully! Please sign in.')
      router.push('/signin');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.')
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
    <div className="min-h-[calc(100vh-15rem)] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create an account
          </h2>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignUp}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-input rounded-md placeholder:text-muted-foreground text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
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
              {loading ? 'Signing up...' : 'Sign up with Email'}
            </Button>
          </div>
        </form>

        {/* OAuth Providers */}
        
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>
            {
              !providers ? <AuthSkeleton /> : (
                <AuthProviders providers={providers} handleOAuthSignIn={handleOAuthSignIn} />
              )
            }
          </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}