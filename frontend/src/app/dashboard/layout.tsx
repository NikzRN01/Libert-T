"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, User, Award, LayoutDashboard, LogOut } from "lucide-react";
import { clearAuthStorage, useStoredToken, useStoredUser } from "@/lib/auth";

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            {/* Top Navigation */}
            <nav className="bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                SkillXIntell
                            </span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200">
                                <span className="text-blue-600">{user.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-red-200 font-medium"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0 hidden lg:block">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-slate-200/60 sticky top-24">
                            <nav className="space-y-1">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-900 bg-blue-50 border-l-4 border-l-blue-600 rounded-xl transition-all font-semibold"
                                >
                                    <LayoutDashboard className="h-5 w-5 text-blue-600" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-all font-medium"
                                >
                                    <User className="h-5 w-5 text-slate-600" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    href="/dashboard/skills"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-all font-medium"
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
