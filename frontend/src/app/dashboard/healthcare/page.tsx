"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Award, Briefcase, TrendingUp, Target } from "lucide-react";
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

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[{
                    title: "Total Skills",
                    value: stats?.totalSkills || 0,
                    hint: `${stats?.verifiedSkills || 0} verified`,
                    icon: <Target className="h-5 w-5 text-blue-600" />,
                    color: "blue",
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
                        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.65), rgba(99,102,241,0.65))" }}></div>
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
                    icon: <Target className="h-6 w-6 text-blue-600" />,
                    title: "Skills Tracker",
                    copy: "Manage healthcare IT skills, proficiencies, and gaps.",
                    accent: "blue",
                }, {
                    href: "/dashboard/certifications?sector=HEALTHCARE",
                    icon: <Award className="h-6 w-6 text-indigo-600" />,
                    title: "Certifications",
                    copy: "Track CPHIMS, CAHIMS, and compliance credentials.",
                    accent: "indigo",
                }, {
                    href: "/dashboard/projects?sector=HEALTHCARE",
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
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all"
                                style={{ width: `${stats?.competencyScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/healthcare/assessment"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                        View detailed assessment
                        <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
