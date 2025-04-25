"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function HomePage() {
    const showToast = () => {
        toast.success("This is a success message!");
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-24 text-center">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-lg">This is the home page of your application.</p>
        <Link href='/auth/login'>Login</Link>
        <Link href='/auth/register'>Register</Link>
        <Button onClick={showToast}>Show toast</Button>
        </div>
    );
}