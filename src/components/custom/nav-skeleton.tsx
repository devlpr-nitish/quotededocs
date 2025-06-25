import React from 'react'
import { Skeleton } from '../ui/skeleton'

const NavSkeleton = () => {
    return (
        <nav className="max-w-5xl mx-auto">
            <div className='hidden md:flex justify-between items-center'>
                <ul className="w-full md:flex gap-46 justify-between items-center">
                    <li className="px-2 py-4">
                        <Skeleton className="h-4 w-16" />
                    </li>
                    <li className="px-2 py-4">
                        <Skeleton className="h-4 w-20" />
                    </li>
                </ul>
                <div className='flex justify-end'>
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
            <div className="md:hidden flex justify-between items-center p-4">
                <div></div>
                <Skeleton className="h-6 w-6" />
            </div>
        </nav>
    )
}

export default NavSkeleton