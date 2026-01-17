"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddSkillPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        sector: "HEALTHCARE" as "HEALTHCARE" | "AGRICULTURE" | "URBAN",
        proficiencyLevel: 3,
        description: "",
        tags: [] as string[],
        yearsOfExperience: 0,
    });
    const [monthsOfExperience, setMonthsOfExperience] = useState(0);
    const [tagInput, setTagInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add skill");
            }

            router.push("/dashboard/skills");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add skill");
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()],
            });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tag),
        });
    };

    const categories = {
        HEALTHCARE: [
            "CLINICAL_INFORMATICS",
            "HEALTH_DATA_ANALYTICS",
            "EHR_SYSTEMS",
            "TELEMEDICINE",
            "MEDICAL_CODING",
            "HIPAA_COMPLIANCE",
            "HEALTHCARE_IT",
        ],
        AGRICULTURE: [
            "PRECISION_AGRICULTURE",
            "FARM_MANAGEMENT_SOFTWARE",
            "AGRICULTURAL_IOT",
            "CROP_MONITORING",
            "SOIL_ANALYSIS",
            "SUSTAINABLE_FARMING",
            "AGRIBUSINESS",
        ],
        URBAN: [
            "URBAN_PLANNING",
            "GIS_MAPPING",
            "SMART_INFRASTRUCTURE",
            "IOT_SENSORS",
            "SUSTAINABLE_URBAN_DESIGN",
            "TRANSPORTATION_SYSTEMS",
            "ENERGY_MANAGEMENT",
        ],
    };

    const crossSectorCategories = [
        "DATA_ANALYSIS",
        "MACHINE_LEARNING",
        "PROJECT_MANAGEMENT",
        "COMMUNICATION",
        "LEADERSHIP",
        "RESEARCH",
    ];

    const availableCategories = [
        ...categories[formData.sector],
        ...crossSectorCategories,
    ];

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/skills"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Skills</span>
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                    Add New Skill
                </h1>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-2xl border-2 border-blue-200/70 bg-white/80 backdrop-blur-xl shadow-2xl">
                <div className="p-8 space-y-7">
                    {/* Skill Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Skill Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                            placeholder="e.g., Python Programming, Data Analysis"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                        >
                            <option value="">Select a category</option>
                            {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Proficiency Level */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Proficiency Level: <span className="text-blue-800">{["", "Beginner", "Intermediate", "Advanced", "Expert", "Master"][formData.proficiencyLevel]}</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={formData.proficiencyLevel}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    proficiencyLevel: parseInt(e.target.value),
                                })
                            }
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-700 mt-1 font-semibold">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Advanced</span>
                            <span>Expert</span>
                            <span>Master</span>
                        </div>
                    </div>

                    {/* Months/Years of Experience */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Months of Experience
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={monthsOfExperience === 0 ? "" : monthsOfExperience}
                            onChange={(e) => {
                                const months = parseInt(e.target.value) || 0;
                                setMonthsOfExperience(months);
                                setFormData({
                                    ...formData,
                                    yearsOfExperience: Math.floor(months / 12),
                                });
                            }}
                            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                            placeholder="Enter months of experience"
                        />
                        {monthsOfExperience >= 12 && (
                            <p className="mt-1 text-sm text-emerald-600 font-semibold">
                                = {Math.floor(monthsOfExperience / 12)} year{Math.floor(monthsOfExperience / 12) !== 1 ? 's' : ''} {monthsOfExperience % 12 > 0 ? `and ${monthsOfExperience % 12} month${monthsOfExperience % 12 !== 1 ? 's' : ''}` : ''}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={4}
                            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                            placeholder="Describe your experience with this skill..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && (e.preventDefault(), addTag())
                                }
                                className="flex-1 px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                                placeholder="Add a tag..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2 font-bold"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-blue-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-8 py-5 bg-blue-50 rounded-b-2xl flex justify-end space-x-3 border-t border-blue-100">
                    <Link
                        href="/dashboard/skills"
                        className="px-4 py-2 border border-blue-200 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-black shadow-md transition-colors"
                    >
                        {loading ? "Adding..." : "Add Skill"}
                    </button>
                </div>
            </form>
        </div>
    );
}
