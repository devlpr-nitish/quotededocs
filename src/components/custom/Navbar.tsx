"use client";

import Link from 'next/link';
import React, { useState } from 'react'
import { ModeToggle } from '../ui/theme';
import { Menu, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import NavSkeleton from './nav-skeleton';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const items = [
        {
            id: 1,
            title: 'Home',
            url: '/'
        },

    ];

    if (status === 'loading') {
        return (
            <NavSkeleton />
        )
    }

    return (
        <nav className="max-w-5xl mx-auto">
            {/* Desktop Menu */}
            <div className='hidden md:flex justify-between items-center'>
                <ul className=" w-full md:flex gap-46 justify-between items-center">
                    {
                        items.map((item) => (

                            <li key={item.id} className="px-2 py-4 hover:text-gray-600">
                                <Link href={item?.url}>{item.title}</Link>
                            </li>

                        ))

                    }
                    {
                        status === 'authenticated' ? (
                            <li className='px-2 py-4 hover:text-gray-600'>
                                <span className='dark:text-white cursor-pointer text-black hover:text-gray-600' onClick={() => signOut()}>Sign Out</span>
                            </li>
                        ) : (
                            <li className='px-2 py-4 hover:text-gray-600'>
                                <Link href={'/signin'}>Sign In</Link>
                            </li>
                        )
                    }
                </ul>
                <div className='flex justify-end'>
                    <ModeToggle />
                </div>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex justify-between items-center p-4">
                <div></div>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden flex flex-col justify-between items-center">
                    {
                        items.map((item) => (

                            <li key={item.id} className="px-2 py-4 hover:text-gray-600">
                                <Link href={item?.url} onClick={() => setIsOpen(false)}>{item.title}</Link>
                            </li>

                        ))

                    }
                    <li className='py-4'>
                        <ModeToggle />
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default Navbar