'use client'

import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ThemeProvider } from "../context/ThemeContext";
import { Button } from "~/components/ui/button";

export default function Home() {
    return (
        <ThemeProvider>
            <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-8">
                <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight dark:text-white">noki</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">i just really wanted a really simple habit app</p>
                </div>
                <div className="space-y-4">
                <SignedOut>
                    <div>
                    <SignInButton>
                        <Button className="px-8 py-4">Sign In</Button>
                    </SignInButton>
                    </div>
                    <div>
                    <SignUpButton>
                        <Button className="px-8 py-4">Sign Up</Button>
                    </SignUpButton>
                    </div>
                </SignedOut>
                </div>
            </div>
            </div>
        </ThemeProvider>
    )
}