'use client'
import '@/styles/admin/login.css'
import LoginForm from "@/components/admin/loginForm";
import Footer from '@/components/footer';
import { useEffect } from 'react';

export default function Login() {
    useEffect(() => {
        const hasCookie = document.cookie.includes('authCookie=');

        if (hasCookie) {
            window.location.href = '/admin/dashboard'
        }
    },[])


    return (
    <>
        <header className="flex-center w-full px-5 py-10 text-3xl" style={{fontFamily:'"Radio Canada",sans-serif'}}>ACCESS PANEL</header>

        <main className="flex flex-1 w-full h-full box-border justify-center items-start">
            <LoginForm/>
        </main>

        <Footer/>
    </>)
}