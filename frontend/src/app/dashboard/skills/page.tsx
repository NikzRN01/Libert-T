"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Filter, Search } from "lucide-react";

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

    useEffect(() => {
        fetchSkills();
    }, [sectorFilter]);

    const fetchSkills = async () => {
        try {
            const token = localStorage.getItem("token");
            const params = new URLSearchParams();
            if (sectorFilter) params.append("sector", sectorFilter);

            const response = await fetch(
                `http://localhost:5000/api/skills?${params.toString()}`,
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading skills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Skills
                </h1>
                <Link
                    href="/dashboard/skills/add"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Skill</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search skills..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Sector Filter */}
                    <div className="sm:w-48">
                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchTerm || sectorFilter
                            ? "No skills found matching your filters"
                            : "You haven't added any skills yet"}
                    </p>
                    <Link
                        href="/dashboard/skills/add"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Your First Skill</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSkills.map((skill) => (
                        <div
                            key={skill.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Skill Header */}
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {skill.name}
                                </h3>
                                {skill.verified && (
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                                        Verified
                                    </span>
                                )}
                            </div>

                            {/* Category & Sector */}
                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {skill.category.replace(/_/g, " ")}
                                </p>
                                <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                                    {skill.sector}
                                </span>
                            </div>

                            {/* Proficiency */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Proficiency
                                    </span>
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${getProficiencyColor(
                                            skill.proficiencyLevel
                                        )}`}
                                    >
                                        {getProficiencyLabel(skill.proficiencyLevel)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${(skill.proficiencyLevel / 5) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            {skill.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {skill.description}
                                </p>
                            )}

                            {/* Tags */}
                            {skill.tags && skill.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {skill.tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {skill.tags.length > 3 && (
                                        <span className="px-2 py-1 text-gray-500 text-xs">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Skills Overview
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {skills.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Total Skills
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {skills.filter((s) => s.verified).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Verified
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {skills.filter((s) => s.proficiencyLevel >= 4).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Expert Level
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
