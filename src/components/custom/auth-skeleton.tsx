import React from 'react'
import { Skeleton } from '../ui/skeleton'

const AuthSkeleton = () => {
  return (
    <div className='mt-6 grid grid-cols-1 gap-3'>
        <Skeleton className="w-full h-10 py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer gap-2" />
        <Skeleton className="w-full h-10 py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer gap-2" />
    </div>
  )
}

export default AuthSkeleton