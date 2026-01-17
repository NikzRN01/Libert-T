"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid credentials");
            }

            // Store token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                <p className="text-sm text-slate-700 font-semibold">
                    Enter your credentials to access your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl flex items-center gap-2 border-2 border-red-300 shadow-md">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="flex h-11 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-900" htmlFor="password">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        className="flex h-11 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                <button
                    className="inline-flex items-center justify-center rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-700 hover:bg-slate-800 text-white h-12 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </button>
            </form>

            <div className="text-center text-sm text-slate-700">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4 text-slate-900 hover:text-slate-700 font-bold transition-colors">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
