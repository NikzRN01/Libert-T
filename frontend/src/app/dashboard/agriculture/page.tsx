"use client";

import { useCallback, useEffect, useState } from "react";
import { TrendingUp, Award, Briefcase, Target, Sprout, BarChart3 } from "lucide-react";
import Link from "next/link";
import CourseCard from "@/components/course-card";

interface AgricultureStats {
    totalSkills: number;
    certifications: number;
    completedProjects: number;
    innovationScore: number;
    averageProficiency: string;
}

interface UdemyCourse {
    id: string;
    title: string;
    url: string;
    price: string;
    image: string;
    instructor: string;
    rating: number;
    students: number;
    duration: string;
    level: string;
}

interface CareerPathway {
    role: string;
    description: string;
    matchScore: number;
    salaryRange: string;
    demand: string;
    skills: string[];
    courses: UdemyCourse[];
}

export default function AgricultureDashboard() {
    const [stats, setStats] = useState<AgricultureStats | null>(null);
    const [pathways, setPathways] = useState<CareerPathway[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);

    const fetchAgricultureStats = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Fetch assessment data
            const assessmentRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/agriculture/assessment`,
                { headers }
            );

            if (assessmentRes.ok) {
                const assessmentData = await assessmentRes.json();
                if (assessmentData.success) {
                    setStats({
                        totalSkills: assessmentData.data.totalSkills || 0,
                        certifications: assessmentData.data.certifications || 0,
                        completedProjects: assessmentData.data.completedProjects || 0,
                        innovationScore: assessmentData.data.innovationScore || 0,
                        averageProficiency: assessmentData.data.averageProficiency || "0",
                    });
                }
            }

            // Fetch career pathways
            const pathwaysRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/agriculture/career-pathways`,
                { headers }
            );

            if (pathwaysRes.ok) {
                const pathwaysData = await pathwaysRes.json();
                if (pathwaysData.success && pathwaysData.data.pathways) {
                    setPathways(pathwaysData.data.pathways.slice(0, 2));
                }
            }
        } catch (error) {
            console.error("Error fetching agriculture data:", error);
            // Set default values on error
            setStats({
                totalSkills: 0,
                certifications: 0,
                completedProjects: 0,
                innovationScore: 0,
                averageProficiency: "0",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgricultureStats();
    }, [fetchAgricultureStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-muted-foreground">Loading agriculture data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 bg-linear-to-r from-secondary/10 to-secondary/5 p-6 rounded-2xl border-2 border-border shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Sprout className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors">
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-emerald-700">Agriculture</h1>
                    <p className="text-emerald-600 font-medium">
                        Track your agritech skills and innovation readiness
                    </p>
                </div>
            </div>

            {/* Progress Charts */}
            <div className="p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-white/80 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Progress Overview</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {[7, 14, 30].map((days) => (
                            <button
                                key={days}
                                onClick={() => setTimeRange(days as 7 | 14 | 30)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${timeRange === days
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {days} Days
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills Progress */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Skills Progress</h3>
                            <Target className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Total Skills</span>
                                <span className="text-2xl font-bold text-emerald-600">{stats?.totalSkills || 0}</span>
                            </div>
                            <div className="relative h-48 border-l-2 border-b-2 border-slate-300 pl-4 pb-4">
                                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400">
                                    <span>{stats?.totalSkills || 0}</span>
                                    <span>{Math.round((stats?.totalSkills || 0) * 0.5)}</span>
                                    <span>0</span>
                                </div>
                                <div className="h-full ml-6 flex items-end gap-3">
                                    {Array.from({ length: timeRange === 7 ? 7 : timeRange === 14 ? 7 : 6 }).map((_, i) => {
                                        const maxHeight = 100;
                                        const progress = ((stats?.totalSkills || 0) / (timeRange === 7 ? 7 : timeRange === 14 ? 14 : 30)) * (i + 1);
                                        const height = Math.min((progress / (stats?.totalSkills || 1)) * maxHeight, maxHeight);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full">
                                                    <div
                                                        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all duration-500 shadow-md"
                                                        style={{ height: `${Math.max(height, 8)}px` }}
                                                    >
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                            {Math.round(progress)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {timeRange === 7 ? `D${i + 1}` : timeRange === 14 ? `W${Math.floor(i / 2) + 1}` : `W${i + 1}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Progress */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Certifications</h3>
                            <Award className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Active</span>
                                <span className="text-2xl font-bold text-emerald-600">{stats?.certifications || 0}</span>
                            </div>
                            <div className="relative h-48 border-l-2 border-b-2 border-slate-300 pl-4 pb-4">
                                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400">
                                    <span>{stats?.certifications || 0}</span>
                                    <span>{Math.round((stats?.certifications || 0) * 0.5)}</span>
                                    <span>0</span>
                                </div>
                                <div className="h-full ml-6 flex items-end gap-3">
                                    {Array.from({ length: timeRange === 7 ? 7 : timeRange === 14 ? 7 : 6 }).map((_, i) => {
                                        const maxHeight = 100;
                                        const progress = ((stats?.certifications || 0) / (timeRange === 7 ? 7 : timeRange === 14 ? 14 : 30)) * (i + 1);
                                        const height = Math.min((progress / (stats?.certifications || 1)) * maxHeight, maxHeight);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full">
                                                    <div
                                                        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all duration-500 shadow-md"
                                                        style={{ height: `${Math.max(height, 8)}px` }}
                                                    >
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                            {Math.round(progress)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {timeRange === 7 ? `D${i + 1}` : timeRange === 14 ? `W${Math.floor(i / 2) + 1}` : `W${i + 1}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Progress */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Projects</h3>
                            <Briefcase className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Completed</span>
                                <span className="text-2xl font-bold text-emerald-600">{stats?.completedProjects || 0}</span>
                            </div>
                            <div className="relative h-48 border-l-2 border-b-2 border-slate-300 pl-4 pb-4">
                                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400">
                                    <span>{stats?.completedProjects || 0}</span>
                                    <span>{Math.round((stats?.completedProjects || 0) * 0.5)}</span>
                                    <span>0</span>
                                </div>
                                <div className="h-full ml-6 flex items-end gap-3">
                                    {Array.from({ length: timeRange === 7 ? 7 : timeRange === 14 ? 7 : 6 }).map((_, i) => {
                                        const maxHeight = 100;
                                        const progress = ((stats?.completedProjects || 0) / (timeRange === 7 ? 7 : timeRange === 14 ? 14 : 30)) * (i + 1);
                                        const height = Math.min((progress / (stats?.completedProjects || 1)) * maxHeight, maxHeight);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full">
                                                    <div
                                                        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all duration-500 shadow-md"
                                                        style={{ height: `${Math.max(height, 8)}px` }}
                                                    >
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                            {Math.round(progress)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {timeRange === 7 ? `D${i + 1}` : timeRange === 14 ? `W${Math.floor(i / 2) + 1}` : `W${i + 1}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Innovation Score Progress */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Innovation Score</h3>
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Current</span>
                                <span className="text-2xl font-bold text-emerald-600">{stats?.innovationScore || 0}%</span>
                            </div>
                            <div className="relative h-48 border-l-2 border-b-2 border-slate-300 pl-4 pb-4">
                                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400">
                                    <span>100</span>
                                    <span>50</span>
                                    <span>0</span>
                                </div>
                                <div className="h-full ml-6 flex items-end gap-3">
                                    {Array.from({ length: timeRange === 7 ? 7 : timeRange === 14 ? 7 : 6 }).map((_, i) => {
                                        const maxHeight = 100;
                                        const targetScore = stats?.innovationScore || 0;
                                        const progress = (targetScore / (timeRange === 7 ? 7 : timeRange === 14 ? 14 : 30)) * (i + 1);
                                        const height = Math.min((progress / 100) * maxHeight, maxHeight);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full">
                                                    <div
                                                        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all duration-500 shadow-md"
                                                        style={{ height: `${Math.max(height, 8)}px` }}
                                                    >
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                            {Math.round(progress)}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {timeRange === 7 ? `D${i + 1}` : timeRange === 14 ? `W${Math.floor(i / 2) + 1}` : `W${i + 1}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-white/80 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-emerald-700 font-semibold">Total Skills</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Target className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-emerald-900">{stats?.totalSkills || 0}</div>
                    <p className="text-sm text-emerald-600 mt-2 font-medium">AgriTech competencies</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-white/80 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-emerald-700 font-semibold">Certifications</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Award className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-emerald-900">{stats?.certifications || 0}</div>
                    <p className="text-sm text-emerald-600 mt-2 font-medium">Active credentials</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-white/80 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-emerald-700 font-semibold">Projects</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-emerald-900">{stats?.completedProjects || 0}</div>
                    <p className="text-sm text-emerald-600 mt-2 font-medium">Completed</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-white/80 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-emerald-700 font-semibold">Innovation Score</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-emerald-900">{stats?.innovationScore || 0}%</div>
                    <p className="text-sm text-emerald-600 mt-2 font-medium">
                        Avg proficiency: {stats?.averageProficiency || "0"}/5
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/agriculture/skills"
                    className="p-8 rounded-2xl border-2 border-emerald-200 bg-white/80 hover:shadow-2xl hover:border-emerald-400 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-900">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                        Manage your agritech skills and proficiency levels
                    </p>
                </Link>

                <Link
                    href="/dashboard/agriculture/certifications"
                    className="p-8 rounded-2xl border-2 border-emerald-200 bg-white/80 hover:shadow-2xl hover:border-emerald-400 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-900">Certifications</h3>
                    </div>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                        Track precision farming and sustainability certs
                    </p>
                </Link>

                <Link
                    href="/dashboard/agriculture/projects"
                    className="p-8 rounded-2xl border-2 border-emerald-200 bg-white/80 hover:shadow-2xl hover:border-emerald-400 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-900">Projects</h3>
                    </div>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                        Showcase your agricultural technology projects
                    </p>
                </Link>
            </div>

            {/* Recommended Courses */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-emerald-800">Recommended Courses</h2>
                </div>

                {pathways.length > 0 && pathways.some(p => p.courses && p.courses.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                            const allCourses = pathways.flatMap(pathway => pathway.courses || []);
                            const uniqueCourses = allCourses.filter((course, index, self) =>
                                index === self.findIndex((c) => c.id === course.id)
                            );
                            return uniqueCourses.slice(0, 9).map((course) => (
                                <div key={course.id} className="rounded-xl border-2 border-emerald-200 bg-white/90 shadow hover:shadow-lg transition-all">
                                    <CourseCard course={course} />
                                </div>
                            ));
                        })()}
                    </div>
                ) : (
                    <div className="p-8 rounded-xl border-2 border-emerald-200 bg-white/90 text-center">
                        <p className="text-emerald-700">No courses available. Add more skills to get personalized recommendations.</p>
                    </div>
                )}
            </div>

            {/* Innovation Readiness */}
            <div className="p-6 rounded-xl border-2 border-emerald-200 bg-white/90">
                <h2 className="text-xl font-semibold mb-4 text-emerald-800">Innovation Readiness Assessment</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-emerald-700">Overall Innovation Readiness</span>
                            <span className="text-sm font-medium text-emerald-700">{stats?.innovationScore || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all"
                                style={{ width: `${stats?.innovationScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/agriculture/assessment"
                        className="inline-block text-sm text-emerald-700 hover:underline"
                    >
                        View detailed assessment →
                    </Link>
                </div>
            </div>
        </div>
    );
}
