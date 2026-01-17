"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Award, Briefcase, Target, Building2 } from "lucide-react";
import Link from "next/link";

interface UrbanStats {
    totalSkills: number;
    certifications: number;
    completedProjects: number;
    readinessScore: number;
    averageProficiency: string;
}

interface CareerPathway {
    role: string;
    description: string;
    matchScore: number;
    salaryRange: string;
    demand: string;
}

export default function UrbanDashboard() {
    const [stats, setStats] = useState<UrbanStats | null>(null);
    const [pathways, setPathways] = useState<CareerPathway[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUrbanData();
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Urban Technology</h1>
                    <p className="text-muted-foreground font-medium">
                        Track your smart city skills and transformation readiness
                    </p>
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
<<<<<<< HEAD
                    href="/dashboard/skills?sector=URBAN"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-accent/50 transition-all transform hover:-translate-y-1 group"
=======
                    href="/dashboard/skills/add"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
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
                    href="/dashboard/certifications?sector=URBAN"
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
                    href="/dashboard/projects?sector=URBAN"
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

            {/* Career Pathways */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Recommended Career Pathways</h2>
                <div className="space-y-3">
                    {pathways.length > 0 ? (
                        pathways.map((pathway, index) => (
                            <div key={index} className="p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{pathway.role}</h3>
                                    <span className="text-sm font-medium text-accent">{pathway.matchScore}% Match</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {pathway.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>💰 {pathway.salaryRange}</span>
                                    <span>•</span>
                                    <span>📈 {pathway.demand}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Smart City Planner</h3>
                                    <span className="text-sm font-medium text-accent">-- Match</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Design and implement smart city initiatives
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>💰 $65,000 - $100,000</span>
                                    <span>•</span>
                                    <span>📈 Very High Demand</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">GIS Specialist</h3>
                                    <span className="text-sm font-medium text-accent">-- Match</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Analyze spatial data for urban development
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>💰 $55,000 - $85,000</span>
                                    <span>•</span>
                                    <span>📈 High Demand</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <Link
                    href="/dashboard/urban/career-pathways"
                    className="mt-4 inline-block text-sm text-accent hover:underline"
                >
                    View all career pathways →
                </Link>
            </div>

<<<<<<< HEAD
            {/* Transformation Readiness */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Transformation Readiness Assessment</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Transformation Readiness</span>
                            <span className="text-sm font-medium">{stats?.readinessScore || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent transition-all"
                                style={{ width: `${stats?.readinessScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/urban/assessment"
                        className="inline-block text-sm text-accent hover:underline"
=======
            {/* Skills Grid */}
            {filteredSkills.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-border">
                    <p className="text-muted-foreground mb-6 text-lg">
                        {searchTerm || sectorFilter
                            ? "No skills found matching your filters"
                            : "You haven&apos;t added any skills yet"}
                    </p>
                    <Link
                        href="/dashboard/skills/add"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
                    >
                        View detailed assessment →
                    </Link>
                </div>
<<<<<<< HEAD
=======
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
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
            </div>
        </div>
    );
}
