import React from 'react'
import { Github, Linkedin } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6'


const Footer = () => {
    return (
        <footer className="bg-background max-w-5xl mx-auto mt-10">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4 gap-2">
                <div className="text-sm text-gray-500">made by <span className="font-semibold text-primary">Nitish</span></div>
                <div className="flex items-center gap-4">
                        
                    <a href="https://x.com/devlprnitish" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                        <FaXTwitter className="size-5 hover:text-primary transition-colors" />
                    </a>
                    
                    <a href="https://github.com/devlpr-nitish" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="size-5 hover:text-primary transition-colors" />
                    </a>
                    
                    <a href="https://www.linkedin.com/in/devlpr-nitish/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="size-5 hover:text-primary transition-colors" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer   