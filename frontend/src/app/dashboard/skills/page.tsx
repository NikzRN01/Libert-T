"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2 } from "lucide-react";

interface Skill {
    id: string;
    name: string;
    category: string;
    sector: string;
    proficiencyLevel: number;
    verified: boolean;
    tags: string[];
    description?: string;
}

import { useSearchParams } from "next/navigation";

export default function SkillsPage() {
    const searchParams = useSearchParams();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sectorFilter, setSectorFilter] = useState(searchParams.get("sector") || "");

    const fetchSkills = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const params = new URLSearchParams();
            if (sectorFilter) params.append("sector", sectorFilter);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSkills(data.skills);
            }
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setLoading(false);
        }
    }, [sectorFilter]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleDeleteSkill = async (skillId: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills/${skillId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setSkills(skills.filter((s) => s.id !== skillId));
            } else {
                console.error("Failed to delete skill");
            }
        } catch (error) {
            console.error("Error deleting skill:", error);
        }
    };

    const filteredSkills = skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProficiencyLabel = (level: number) => {
        const labels = ["", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];
        return labels[level] || "Unknown";
    };

    const getProficiencyColor = (level: number) => {
        const colors = [
            "",
            "bg-gray-200 text-gray-700",
            "bg-blue-200 text-blue-700",
            "bg-green-200 text-green-700",
            "bg-purple-200 text-purple-700",
            "bg-yellow-200 text-yellow-700",
        ];
        return colors[level] || colors[0];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground font-medium">Loading skills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">
                    My Skills
                </h1>
                <Link
                    href="/dashboard/skills/add"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Skill</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border-2 border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search skills..."
                            className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground font-medium"
                        />
                    </div>

                    {/* Sector Filter */}
                    <div className="sm:w-48">
                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground font-medium"
                        >
                            <option value="">All Sectors</option>
                            <option value="HEALTHCARE">Healthcare</option>
                            <option value="AGRICULTURE">Agriculture</option>
                            <option value="URBAN">Urban</option>
                        </select>
                    </div>
                </div>
            </div>

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
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Your First Skill</span>
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
                                <div className="flex items-center gap-2">
                                    {skill.verified && (
                                        <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-xl font-semibold border border-secondary/30">
                                            Verified
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete skill"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
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
        </div>
    );
}
