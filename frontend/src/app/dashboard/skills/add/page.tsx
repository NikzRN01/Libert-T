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
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/dashboard/skills"
                    className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Skills</span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Skill
                </h1>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 space-y-6">
                    {/* Skill Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Skill Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Python Programming, Data Analysis"
                        />
                    </div>

                    {/* Sector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sector *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(["HEALTHCARE", "AGRICULTURE", "URBAN"] as const).map((sector) => (
                                <button
                                    key={sector}
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, sector, category: "" })
                                    }
                                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${formData.sector === sector
                                        ? "border-blue-600 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400"
                                        }`}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Proficiency Level: {["", "Beginner", "Intermediate", "Advanced", "Expert", "Master"][formData.proficiencyLevel]}
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
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Advanced</span>
                            <span>Expert</span>
                            <span>Master</span>
                        </div>
                    </div>

                    {/* Years of Experience */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            value={formData.yearsOfExperience}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    yearsOfExperience: parseInt(e.target.value) || 0,
                                })
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Describe your experience with this skill..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Add a tag..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center gap-2"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-gray-900 dark:hover:text-white"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex justify-end space-x-3">
                    <Link
                        href="/dashboard/skills"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                    >
                        {loading ? "Adding..." : "Add Skill"}
                    </button>
                </div>
            </form>
        </div>
    );
}
