"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Check } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
    });

    const roles = [
        { id: "STUDENT", label: "Student/Learner" },
        { id: "EDUCATOR", label: "Educator/Mentor" },
        { id: "EMPLOYER", label: "Employer/Recruiter" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Auto login after register
            const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const loginData = await loginRes.json();

            if (loginRes.ok) {
                localStorage.setItem("token", loginData.token);
                localStorage.setItem("user", JSON.stringify(loginData.user));
                router.push("/dashboard");
            } else {
                router.push("/login");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h1>
                <p className="text-sm text-slate-700 font-semibold">
                    Join SkillXIntell to start your journey
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
                    <label className="text-sm font-bold text-slate-900" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        className="flex h-11 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        id="name"
                        placeholder="John Doe"
                        type="text"
                        disabled={isLoading}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

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
                    <label className="text-sm font-bold text-slate-900" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="flex h-11 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">
                        I am a...
                    </label>
                    <div className="relative">
                        {/* Custom Trigger */}
                        <div
                            className={`flex h-11 w-full items-center justify-between rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-all ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => !isLoading && setIsRoleOpen(!isRoleOpen)}
                        >
                            <span className={formData.role ? "text-slate-900" : "text-slate-400"}>
                                {roles.find(r => r.id === formData.role)?.label || "Select your role"}
                            </span>
                            <div className="text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {/* Custom Menu */}
                        {isRoleOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsRoleOpen(false)} />
                                <div className="absolute z-20 mt-1 w-full rounded-xl border-2 border-slate-300 bg-white shadow-xl">
                                    <div className="p-1">
                                        {roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className={`
                                                    relative flex w-full cursor-pointer select-none items-center rounded-lg py-3 px-3 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900
                                                    ${formData.role === role.id ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-700 font-medium'}
                                                `}
                                                onClick={() => {
                                                    setFormData({ ...formData, role: role.id });
                                                    setIsRoleOpen(false);
                                                }}
                                            >
                                                {role.label}
                                                {formData.role === role.id && (
                                                    <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                                                        <Check className="h-5 w-5 text-slate-700" />
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <button
                    className="inline-flex items-center justify-center rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-700 hover:bg-slate-800 text-white h-12 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </button>
            </form>

            <div className="text-center text-sm text-slate-700">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 text-slate-900 hover:text-slate-700 font-bold transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
