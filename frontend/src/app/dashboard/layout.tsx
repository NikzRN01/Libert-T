"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, User, Award, LayoutDashboard, LogOut } from "lucide-react";
import { clearAuthStorage, useStoredToken, useStoredUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const user = useStoredUser();
    const token = useStoredToken();

    useEffect(() => {
        if (!token || !user) {
            router.replace("/login");
        }
    }, [router, token, user]);

    const handleLogout = () => {
        clearAuthStorage();
        router.replace("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-300 via-blue-100 to-slate-200">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-300 via-blue-100 to-slate-200">
            {/* Top Navigation */}
            <nav className="bg-white shadow-lg border-b-2 border-slate-300 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <Brain className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">
                                SkillXIntell
                            </span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <span className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl text-sm font-bold shadow-md border-2 border-slate-300">
                                Role: <span className="text-slate-700 font-bold">{user.role}</span>
                            </span>
                            <ThemeToggle />
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-300"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="font-semibold">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-slate-200 sticky top-24">
                            <nav className="space-y-2">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-3 px-4 py-3 text-slate-900 hover:bg-slate-100 rounded-xl transition-all font-semibold hover:shadow-md border-l-4 border-l-slate-700"
                                >
                                    <LayoutDashboard className="h-5 w-5 text-slate-700" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-all font-medium hover:shadow-md"
                                >
                                    <User className="h-5 w-5 text-slate-600" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    href="/dashboard/skills"
                                    className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-all font-medium hover:shadow-md"
                                >
                                    <Award className="h-5 w-5 text-slate-600" />
                                    <span>Skills</span>
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
