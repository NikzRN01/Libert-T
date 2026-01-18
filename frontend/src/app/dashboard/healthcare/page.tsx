"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Award, Briefcase, TrendingUp, Target, BarChart3 } from "lucide-react";
import Link from "next/link";
import CourseCard from "@/components/course-card";

interface HealthcareStats {
    totalSkills: number;
    verifiedSkills: number;
    activeCertifications: number;
    completedProjects: number;
    competencyScore: number;
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

export default function HealthcareDashboard() {
    const [stats, setStats] = useState<HealthcareStats | null>(null);
    const [pathways, setPathways] = useState<CareerPathway[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);

    const fetchHealthcareStats = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Fetch assessment data
            const assessmentRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/healthcare/assessment`,
                { headers }
            );

            if (assessmentRes.ok) {
                const assessmentData = await assessmentRes.json();
                if (assessmentData.success) {
                    setStats({
                        totalSkills: assessmentData.data.totalSkills || 0,
                        verifiedSkills: assessmentData.data.verifiedSkills || 0,
                        activeCertifications: assessmentData.data.activeCertifications || 0,
                        completedProjects: assessmentData.data.completedProjects || 0,
                        competencyScore: assessmentData.data.competencyScore || 0,
                        averageProficiency: assessmentData.data.averageProficiency || "0",
                    });
                }
            }

            // Fetch career pathways
            const pathwaysRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/healthcare/career-pathways`,
                { headers }
            );

            if (pathwaysRes.ok) {
                const pathwaysData = await pathwaysRes.json();
                if (pathwaysData.success && pathwaysData.data.pathways) {
                    setPathways(pathwaysData.data.pathways.slice(0, 2));
                }
            }

        } catch (error) {
            console.error("Error fetching healthcare data:", error);
            // Set default values on error
            setStats({
                totalSkills: 0,
                verifiedSkills: 0,
                activeCertifications: 0,
                completedProjects: 0,
                competencyScore: 0,
                averageProficiency: "0",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHealthcareStats();
    }, [fetchHealthcareStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[220px]">
                <div className="text-slate-500">Loading healthcare data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-2xl backdrop-blur-xl p-6 md:p-8">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 38%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.12), transparent 36%), radial-gradient(circle at 45% 110%, rgba(16,185,129,0.14), transparent 40%)",
                        }}
                    ></div>
                    <div
                        className="absolute inset-0 opacity-35"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                        }}
                    ></div>
                </div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200/60">
                            <Activity className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Sector</p>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                                Healthcare Informatics
                            </h1>
                            <p className="text-slate-600 font-medium">Skills, credentials, and readiness</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                            {stats?.competencyScore || 0}% competency
                        </span>
                        <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                            {stats?.verifiedSkills || 0} verified skills
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Charts */}
            <div className="p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-white/80 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-violet-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Progress Overview</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {[7, 14, 30].map((days) => (
                            <button
                                key={days}
                                onClick={() => setTimeRange(days as 7 | 14 | 30)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${timeRange === days
                                    ? "bg-violet-600 text-white shadow-lg"
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
                    <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border border-violet-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Skills Progress</h3>
                            <Target className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Total Skills</span>
                                <span className="text-2xl font-bold text-violet-600">{stats?.totalSkills || 0}</span>
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
                                                        className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-all duration-500 shadow-md"
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
                    <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border border-violet-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Certifications</h3>
                            <Award className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Active</span>
                                <span className="text-2xl font-bold text-violet-600">{stats?.activeCertifications || 0}</span>
                            </div>
                            <div className="relative h-48 border-l-2 border-b-2 border-slate-300 pl-4 pb-4">
                                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400">
                                    <span>{stats?.activeCertifications || 0}</span>
                                    <span>{Math.round((stats?.activeCertifications || 0) * 0.5)}</span>
                                    <span>0</span>
                                </div>
                                <div className="h-full ml-6 flex items-end gap-3">
                                    {Array.from({ length: timeRange === 7 ? 7 : timeRange === 14 ? 7 : 6 }).map((_, i) => {
                                        const maxHeight = 100;
                                        const progress = ((stats?.activeCertifications || 0) / (timeRange === 7 ? 7 : timeRange === 14 ? 14 : 30)) * (i + 1);
                                        const height = Math.min((progress / (stats?.activeCertifications || 1)) * maxHeight, maxHeight);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full">
                                                    <div
                                                        className="w-full bg-violet-500 hover:bg-violet-600 rounded-t transition-all duration-500 shadow-md"
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
                    <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border border-violet-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Projects</h3>
                            <Briefcase className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Completed</span>
                                <span className="text-2xl font-bold text-violet-600">{stats?.completedProjects || 0}</span>
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
                                                        className="w-full bg-violet-500 hover:bg-violet-600 rounded-t transition-all duration-500 shadow-md"
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

                    {/* Competency Progress */}
                    <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border border-violet-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Competency Score</h3>
                            <TrendingUp className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Current</span>
                                <span className="text-2xl font-bold text-violet-600">{stats?.competencyScore || 0}%</span>
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
                                        const targetScore = stats?.competencyScore || 0;
                                        const progress = (targetScore / (timeRange === 7 ? 7 : timeRange === 14 ? 14 : 30)) * (i + 1);
                                        const height = Math.min((progress / 100) * maxHeight, maxHeight);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full">
                                                    <div
                                                        className="w-full bg-violet-500 hover:bg-violet-600 rounded-t transition-all duration-500 shadow-md"
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
                {[{
                    title: "Total Skills",
                    value: stats?.totalSkills || 0,
                    hint: `${stats?.verifiedSkills || 0} verified`,
                    icon: <Target className="h-5 w-5 text-violet-600" />,
                    color: "violet",
                }, {
                    title: "Certifications",
                    value: stats?.activeCertifications || 0,
                    hint: "Active credentials",
                    icon: <Award className="h-5 w-5 text-indigo-600" />,
                    color: "indigo",
                }, {
                    title: "Projects",
                    value: stats?.completedProjects || 0,
                    hint: "Completed",
                    icon: <Briefcase className="h-5 w-5 text-emerald-600" />,
                    color: "emerald",
                }, {
                    title: "Competency",
                    value: `${stats?.competencyScore || 0}%`,
                    hint: `Avg proficiency ${stats?.averageProficiency || "0"}/5`,
                    icon: <TrendingUp className="h-5 w-5 text-amber-600" />,
                    color: "amber",
                }].map((card) => (
                    <div
                        key={card.title}
                        className="relative p-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.65), rgba(168,85,247,0.65))" }}></div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-slate-500 font-semibold">{card.title}</span>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shadow-inner">
                                {card.icon}
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tight">{card.value}</div>
                        <p className="text-sm text-slate-600 mt-2 font-medium">{card.hint}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                {[{
                    href: "/dashboard/healthcare/skills",
                    icon: <Target className="h-6 w-6 text-violet-600" />,
                    title: "Skills Tracker",
                    copy: "Manage healthcare IT skills, proficiencies, and gaps.",
                    accent: "violet",
                }, {
                    href: "/dashboard/healthcare/certifications",
                    icon: <Award className="h-6 w-6 text-indigo-600" />,
                    title: "Certifications",
                    copy: "Track CPHIMS, CAHIMS, and compliance credentials.",
                    accent: "indigo",
                }, {
                    href: "/dashboard/healthcare/projects",
                    icon: <Briefcase className="h-6 w-6 text-emerald-600" />,
                    title: "Projects",
                    copy: "Showcase healthcare informatics and integration projects.",
                    accent: "emerald",
                }].map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className="group relative p-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: "radial-gradient(circle at 80% 0%, rgba(59,130,246,0.12), transparent 45%)" }}></div>
                        <div className="relative flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shadow-inner">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 tracking-tight">{item.title}</h3>
                        </div>
                        <p className="relative text-sm text-slate-600 leading-relaxed">
                            {item.copy}
                        </p>
                        <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                            Open
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                    </Link>
                ))}
            </div>

            {/* Recommended Courses Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Recommended Courses</h2>
                    <span className="text-sm text-slate-500">Personalized from your pathways</span>
                </div>

                {pathways.length > 0 && pathways.some(p => p.courses && p.courses.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                            const allCourses = pathways.flatMap(pathway => pathway.courses || []);
                            const uniqueCourses = allCourses.filter((course, index, self) =>
                                index === self.findIndex((c) => c.id === course.id)
                            );
                            return uniqueCourses.slice(0, 9).map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ));
                        })()}
                    </div>
                ) : (
                    <div className="p-8 rounded-xl border border-slate-200 bg-white/80 backdrop-blur text-center shadow-sm">
                        <p className="text-slate-600">No courses available. Add more skills to get personalized recommendations.</p>
                    </div>
                )}
            </div>

            {/* Competency Assessment */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Competency Assessment</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2 text-sm font-semibold text-slate-600">
                            <span>Overall Competency</span>
                            <span>{stats?.competencyScore || 0}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 transition-all"
                                style={{ width: `${stats?.competencyScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/healthcare/assessment"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-800"
                    >
                        View detailed assessment
                        <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
