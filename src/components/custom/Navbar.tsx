"use client";

import Link from 'next/link';
import React, { useState } from 'react'
import { ModeToggle } from '../ui/theme';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const items = [
        {
            id: 1,
            title: 'Home',
            url: '/'
        }, {
            id: 3,
            title: 'About us',
            url: '/about'
        }
        , {
            id: 4,
            title: 'Sign In',
            url: '/signin'
        }
    ];


    return (
        <nav className="w-full">
            {/* Desktop Menu */}
            <ul className="hidden w-full md:flex gap-46 justify-center items-center">
                {
                    items.map((item) => (

                        <li key={item.id} className="px-2 py-4 hover:text-gray-600">
                            <Link href={item?.url}>{item.title}</Link>
                        </li>

                    ))

                }
                <li className=''>
                    <ModeToggle />
                </li>
            </ul>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex justify-between items-center p-4">
                <div></div>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden flex flex-col items-center">
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