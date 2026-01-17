"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, User, Award, LayoutDashboard, LogOut } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/login");
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                SkillXIntell
                            </span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <nav className="space-y-2">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <User className="h-5 w-5" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    href="/dashboard/skills"
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Award className="h-5 w-5" />
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
