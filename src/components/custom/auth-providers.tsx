import React from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { Button } from '../ui/button'

const AuthProviders = ({ providers, handleOAuthSignIn }: { providers: any, handleOAuthSignIn: (providerId: string) => void }) => {
    return (
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
                        className="w-full h-10 inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer gap-2"
                    >
                        {Icon && <Icon className="mr-2 h-5 w-5" />}
                        <span className="capitalize">{provider.name}</span>
                    </Button>
                )
            })}
        </div>
    )
}

export default AuthProviders