'use client'

import React, { createContext, useState, useEffect, useContext, useMemo, useCallback, useRef } from "react";

type ThemeContextType = {
    darkMode: boolean,
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleTheme: () => {},
});

export const useTheme = () => {
    return useContext(ThemeContext)
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false)
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('darkMode');
        if (saved) {
            setDarkMode(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
        }
    }, [darkMode, mounted]);

    const toggleTheme = useCallback(() => {
        setDarkMode((mode: boolean) => {
            const newValue = !mode;
            localStorage.setItem('darkMode', JSON.stringify(newValue));
            return newValue;
        });
    }, []);

    useEffect(() => {
        if(darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const value = useMemo(() => ({ darkMode, toggleTheme}), [darkMode]);

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={value}>
            { children }
        </ThemeContext.Provider>
    );
};