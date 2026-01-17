"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Check, Eye, EyeOff, RefreshCw, Copy, CheckCircle2 } from "lucide-react";
import { setAuthSession } from "@/lib/auth";

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    bgColor: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT",
    });

    const roles = [
        { id: "STUDENT", label: "Student/Learner" },
        { id: "EDUCATOR", label: "Educator/Mentor" },
        { id: "EMPLOYER", label: "Employer/Recruiter" },
    ];

    // Password strength calculation
    const passwordStrength = useMemo((): PasswordStrength => {
        const password = formData.password;
        if (!password) return { score: 0, label: "", color: "", bgColor: "" };

        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) return { score, label: "Weak", color: "text-red-600", bgColor: "bg-red-500" };
        if (score <= 4) return { score, label: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-500" };
        return { score, label: "Strong", color: "text-green-600", bgColor: "bg-green-500" };
    }, [formData.password]);

    // Generate strong password
    const generatePassword = () => {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        const allChars = lowercase + uppercase + numbers + symbols;
        
        let password = "";
        // Ensure at least one of each type
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        // Fill the rest randomly (total 12 characters)
        for (let i = 4; i < 12; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        setFormData({ ...formData, password, confirmPassword: password });
        setShowPassword(true);
        setShowConfirmPassword(true);
    };

    // Copy password to clipboard
    const copyPassword = async () => {
        await navigator.clipboard.writeText(formData.password);
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
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
                setAuthSession({ token: loginData.token, user: loginData.user });
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
        <div className="space-y-7">
            <div className="space-y-3 text-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Create an account
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                    Join SkillXIntell to start your journey
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                        className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
                        className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
                        <button
                            type="button"
                            onClick={generatePassword}
                            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
                            disabled={isLoading}
                        >
                            <RefreshCw className="h-3 w-3" />
                            Generate
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-2 pr-20 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            disabled={isLoading}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={8}
                            placeholder="Enter password"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            {formData.password && (
                                <button
                                    type="button"
                                    onClick={copyPassword}
                                    className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                                    title="Copy password"
                                >
                                    {passwordCopied ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Password Strength:</span>
                                <span className={`text-xs font-bold ${passwordStrength.color}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6].map((bar) => (
                                    <div
                                        key={bar}
                                        className={`h-1.5 flex-1 rounded-full transition-all ${
                                            bar <= passwordStrength.score
                                                ? passwordStrength.bgColor
                                                : "bg-slate-200"
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="text-xs text-slate-600 space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span>At least 8 characters</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span>One uppercase letter</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span>One lowercase letter</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span>One number</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span>One special character</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            className={`flex h-12 w-full rounded-xl border-2 bg-slate-50/50 px-4 py-2 pr-10 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                                formData.confirmPassword && formData.password !== formData.confirmPassword
                                    ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500'
                                    : formData.confirmPassword && formData.password === formData.confirmPassword
                                    ? 'border-green-300 focus-visible:border-green-500 focus-visible:ring-green-500'
                                    : 'border-slate-300 focus-visible:border-slate-700'
                            }`}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            disabled={isLoading}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            placeholder="Re-enter password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-900 transition-colors"
                            title={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Passwords do not match
                        </p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-xs font-semibold text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Passwords match
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">
                        I am a...
                    </label>
                    <div className="relative">
                        {/* Custom Trigger */}
                        <div
                            className={`flex h-12 w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-all ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
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
                    className="inline-flex items-center justify-center rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    type="submit"
                    disabled={isLoading || (formData.password !== formData.confirmPassword && formData.confirmPassword !== "")}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </button>
            </form>

            <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
                    Sign in →
                </Link>
            </div>
        </div>
    );
}
