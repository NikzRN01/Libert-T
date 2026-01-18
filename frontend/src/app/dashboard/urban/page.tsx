"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Award, Briefcase, Target, Building2, BarChart3 } from "lucide-react";
import Link from "next/link";
import CourseCard from "@/components/course-card";

interface UrbanStats {
    totalSkills: number;
    certifications: number;
    completedProjects: number;
    readinessScore: number;
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

interface UrbanSkill {
    id: string;
    name: string;
    sector: string;
    category: string;
    proficiencyLevel: number;
    verified?: boolean;
    tags?: string[];
    description?: string;
}

const proficiencyColors: Record<number, string> = {
    1: "bg-red-100 text-red-700",
    2: "bg-orange-100 text-orange-700",
    3: "bg-yellow-100 text-yellow-800",
    4: "bg-green-100 text-green-700",
    5: "bg-emerald-100 text-emerald-700",
};

const proficiencyLabels: Record<number, string> = {
    1: "Beginner",
    2: "Developing",
    3: "Competent",
    4: "Proficient",
    5: "Expert",
};

const getProficiencyColor = (level: number) => proficiencyColors[level] || "bg-muted text-muted-foreground";
const getProficiencyLabel = (level: number) => proficiencyLabels[level] || "Unknown";

export default function UrbanDashboard() {
    const [stats, setStats] = useState<UrbanStats | null>(null);
    const [pathways, setPathways] = useState<CareerPathway[]>([]);
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState<UrbanSkill[]>([]);
    const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);

    useEffect(() => {
        fetchUrbanData();
        fetchSkills();
    }, []);

    const fetchUrbanData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Fetch assessment data
            const assessmentRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/urban/assessment`,
                { headers }
            );

            if (assessmentRes.ok) {
                const assessmentData = await assessmentRes.json();
                if (assessmentData.success) {
                    setStats({
                        totalSkills: assessmentData.data.totalSkills || 0,
                        certifications: assessmentData.data.certifications || 0,
                        completedProjects: assessmentData.data.completedProjects || 0,
                        readinessScore: assessmentData.data.readinessScore || 0,
                        averageProficiency: assessmentData.data.averageProficiency || "0",
                    });
                }
            }

            // Fetch career pathways
            const pathwaysRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/urban/career-pathways`,
                { headers }
            );

            if (pathwaysRes.ok) {
                const pathwaysData = await pathwaysRes.json();
                if (pathwaysData.success && pathwaysData.data.pathways) {
                    setPathways(pathwaysData.data.pathways.slice(0, 2));
                }
            }
        } catch (error) {
            console.error("Error fetching urban data:", error);
            // Set default values on error
            setStats({
                totalSkills: 0,
                certifications: 0,
                completedProjects: 0,
                readinessScore: 0,
                averageProficiency: "0",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchSkills = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills`,
                { headers }
            );

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    setSkills(data.data);
                }
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    };

    const filteredSkills = skills;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading urban data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-accent/10 to-accent/5 p-6 rounded-2xl border-2 border-border shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Urban Technology</h1>
                    <p className="text-muted-foreground font-medium">
                        Track your smart city skills and transformation readiness
                    </p>
                </div>
            </div>

            {/* Progress Charts */}
            <div className="p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-white/80 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-cyan-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Progress Overview</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {[7, 14, 30].map((days) => (
                            <button
                                key={days}
                                onClick={() => setTimeRange(days as 7 | 14 | 30)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${timeRange === days
                                    ? "bg-cyan-600 text-white shadow-lg"
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
                    <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl border border-cyan-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Skills Progress</h3>
                            <Target className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Total Skills</span>
                                <span className="text-2xl font-bold text-cyan-600">{stats?.totalSkills || 0}</span>
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
                                                        className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-t transition-all duration-500 shadow-md"
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
                    <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl border border-cyan-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Certifications</h3>
                            <Award className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Active</span>
                                <span className="text-2xl font-bold text-cyan-600">{stats?.certifications || 0}</span>
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
                                                        className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-t transition-all duration-500 shadow-md"
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
                    <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl border border-cyan-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Projects</h3>
                            <Briefcase className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Completed</span>
                                <span className="text-2xl font-bold text-cyan-600">{stats?.completedProjects || 0}</span>
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
                                                        className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-t transition-all duration-500 shadow-md"
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

                    {/* Readiness Score Progress */}
                    <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl border border-cyan-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Readiness Score</h3>
                            <TrendingUp className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-600">Current</span>
                                <span className="text-2xl font-bold text-cyan-600">{stats?.readinessScore || 0}%</span>
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
                                        const targetScore = stats?.readinessScore || 0;
                                        const progress = (targetScore / (timeRange === 7 ? 7 : timeRange === 14 ? 14 : 30)) * (i + 1);
                                        const height = Math.min((progress / 100) * maxHeight, maxHeight);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full">
                                                    <div
                                                        className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-t transition-all duration-500 shadow-md"
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
                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Total Skills</span>
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-accent" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.totalSkills || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Urban tech competencies</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Certifications</span>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.certifications || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Active credentials</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Projects</span>
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-secondary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.completedProjects || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Completed</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Readiness Score</span>
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-accent" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.readinessScore || 0}%</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                        Avg proficiency: {stats?.averageProficiency || "0"}/5
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/urban/skills"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-accent/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Manage your urban tech skills and proficiency levels
                    </p>
                </Link>

                <Link
                    href="/dashboard/urban/certifications"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-primary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Certifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Track GIS, smart city, and urban planning certs
                    </p>
                </Link>

                <Link
                    href="/dashboard/urban/projects"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-secondary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Projects</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Showcase your urban technology projects
                    </p>
                </Link>
            </div>

            {/* Recommended Courses */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recommended Courses</h2>
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
                    <div className="p-8 rounded-xl border border-border bg-card text-center">
                        <p className="text-muted-foreground">No courses available. Add more skills to get personalized recommendations.</p>
                    </div>
                )}
            </div>

            {/* Skills Grid */}
            {filteredSkills.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-border">
                    <p className="text-muted-foreground mb-6 text-lg">
                        You haven&apos;t added any skills yet
                    </p>
                    <Link
                        href="/dashboard/urban/skills"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Add your first skill →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.map((skill) => (
                        <div
                            key={skill.id}
                            className="bg-card rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-border"
                        >
                            {/* Skill Header */}
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-bold text-foreground">
                                    {skill.name}
                                </h3>
                                {skill.verified && (
                                    <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-xl font-semibold border border-secondary/30">
                                        Verified
                                    </span>
                                )}
                            </div>

                            {/* Category & Sector */}
                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-muted-foreground font-medium">
                                    {skill.category.replace(/_/g, " ")}
                                </p>
                                <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs rounded-xl font-semibold border border-accent/30">
                                    {skill.sector}
                                </span>
                            </div>

                            {/* Proficiency */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground font-semibold">
                                        Proficiency
                                    </span>
                                    <span
                                        className={`px-3 py-1 text-xs rounded-xl font-semibold ${getProficiencyColor(
                                            skill.proficiencyLevel
                                        )}`}
                                    >
                                        {getProficiencyLabel(skill.proficiencyLevel)}
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3 shadow-inner">
                                    <div
                                        className="bg-linear-to-r from-primary to-accent h-3 rounded-full transition-all shadow-md"
                                        style={{ width: `${(skill.proficiencyLevel / 5) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            {skill.description && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                    {skill.description}
                                </p>
                            )}

                            {/* Tags */}
                            {skill.tags && skill.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {skill.tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {skill.tags.length > 3 && (
                                        <span className="px-3 py-1 text-muted-foreground text-xs font-medium">
                                            +{skill.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="bg-card rounded-2xl shadow-lg p-8 border-2 border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">
                    Skills Overview
                </h2>
                <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-xl bg-primary/10 border-2 border-primary/20">
                        <div className="text-4xl font-bold text-primary">
                            {skills.length}
                        </div>
                        <div className="text-sm text-muted-foreground font-semibold mt-2">
                            Total Skills
                        </div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/10 border-2 border-secondary/20">
                        <div className="text-4xl font-bold text-secondary">
                            {skills.filter((s) => s.verified).length}
                        </div>
                        <div className="text-sm text-muted-foreground font-semibold mt-2">
                            Verified
                        </div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-accent/10 border-2 border-accent/20">
                        <div className="text-4xl font-bold text-accent">
                            {skills.filter((s) => s.proficiencyLevel >= 4).length}
                        </div>
                        <div className="text-sm text-muted-foreground font-semibold mt-2">
                            Expert Level
                        </div>
                    </div>
                </div>
            </div>

            {/* Competency Assessment */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Competency Assessment</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2 text-sm font-semibold text-slate-600">
                            <span>Overall Competency</span>
                            <span>{stats?.readinessScore || 0}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 transition-all"
                                style={{ width: `${stats?.readinessScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/urban/assessment"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                    >
                        View detailed assessment
                        <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
