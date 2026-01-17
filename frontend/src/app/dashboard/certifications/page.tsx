"use client";

import { useCallback, useEffect, useState } from "react";
<<<<<<< HEAD
import { useSearchParams } from "next/navigation";
import { Award, Plus, Calendar, ExternalLink, Trash2, Edit, X } from "lucide-react";
=======
import { TrendingUp, Award, Briefcase, Target, Sprout } from "lucide-react";
import Link from "next/link";
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d

interface Certification {
    id: string;
    name: string;
    issuingOrg: string;
    sector: string;
    credentialId?: string;
    credentialUrl?: string;
    issueDate: string;
    expiryDate?: string;
    neverExpires: boolean;
    skills: string[];
}

interface AddCertificationForm {
    name: string;
    issuingOrg: string;
    credentialId: string;
    credentialUrl: string;
    issueDate: string;
    expiryDate: string;
    neverExpires: boolean;
    skills: string[];
}

export default function CertificationsPage() {
    const searchParams = useSearchParams();
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectorFilter, setSectorFilter] = useState(searchParams.get("sector") || "");
    const [showAddModal, setShowAddModal] = useState(false);
    const [formSector, setFormSector] = useState(searchParams.get("sector") || "HEALTHCARE");
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<AddCertificationForm>({
        name: "",
        issuingOrg: "",
        credentialId: "",
        credentialUrl: "",
        issueDate: "",
        expiryDate: "",
        neverExpires: false,
        skills: [],
    });
    const [skillInput, setSkillInput] = useState("");

<<<<<<< HEAD
    const fetchCertifications = useCallback(async () => {
=======
    const fetchAgricultureStats = useCallback(async () => {
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Fetch from all sectors or specific sector
            const sectors = sectorFilter ? [sectorFilter] : ["HEALTHCARE", "AGRICULTURE", "URBAN"];
            const allCerts: Certification[] = [];

            for (const sector of sectors) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${sector.toLowerCase()}/certifications`,
                    { headers }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        allCerts.push(...data.data.map((c: Certification) => ({ ...c, sector })));
                    }
                }
            }

            setCertifications(allCerts);
        } catch (error) {
            console.error("Failed to fetch certifications:", error);
        } finally {
            setLoading(false);
        }
<<<<<<< HEAD
    }, [sectorFilter]);

    useEffect(() => {
        fetchCertifications();
    }, [fetchCertifications]);

    const handleAddCertification = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${formSector.toLowerCase()}/certifications`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                setShowAddModal(false);
                setFormData({
                    name: "",
                    issuingOrg: "",
                    credentialId: "",
                    credentialUrl: "",
                    issueDate: "",
                    expiryDate: "",
                    neverExpires: false,
                    skills: [],
                });
                fetchCertifications();
            }
        } catch (error) {
            console.error("Failed to add certification:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCertification = async (id: string, sector: string) => {
        if (!confirm("Are you sure you want to delete this certification?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${sector.toLowerCase()}/certifications/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                fetchCertifications();
            }
        } catch (error) {
            console.error("Failed to delete certification:", error);
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skillInput.trim()],
            });
            setSkillInput("");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    const isExpired = (expiryDate?: string) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const getSectorColor = (sector: string) => {
        switch (sector) {
            case "HEALTHCARE":
                return "bg-primary/20 text-primary border-primary/30";
            case "AGRICULTURE":
                return "bg-secondary/20 text-secondary border-secondary/30";
            case "URBAN":
                return "bg-accent/20 text-accent border-accent/30";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground font-medium">Loading certifications...</p>
                </div>
=======
    }, []);

    useEffect(() => {
        fetchAgricultureStats();
    }, [fetchAgricultureStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-muted-foreground">Loading agriculture data...</div>
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
<<<<<<< HEAD
            <div className="flex items-center justify-between">
=======
            <div className="flex items-center gap-4 bg-linear-to-r from-secondary/10 to-secondary/5 p-6 rounded-2xl border-2 border-border shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                    <Sprout className="h-8 w-8 text-white" />
                </div>
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Certifications</h1>
                    <p className="text-muted-foreground font-medium">
                        {sectorFilter
                            ? `Viewing ${sectorFilter.toLowerCase()} certifications`
                            : "All your professional certifications"}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Certification</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border-2 border-border">
                <div className="flex flex-col sm:flex-row gap-4">
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

            {/* Certifications Grid */}
            {certifications.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-border">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <Award className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        No Certifications Found
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
                        You haven&apos;t added any certifications yet. Start tracking your professional credentials.
                    </p>
<<<<<<< HEAD
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
=======
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/skills?sector=AGRICULTURE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-secondary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Manage your agritech skills and proficiency levels
                    </p>
                </Link>

                <Link
                    href="/dashboard/certifications?sector=AGRICULTURE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-primary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Certifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Track precision farming and sustainability certs
                    </p>
                </Link>

                <Link
                    href="/dashboard/projects?sector=AGRICULTURE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-accent/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Projects</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Showcase your agricultural technology projects
                    </p>
                </Link>
            </div>

            {/* Career Pathways */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Recommended Career Pathways</h2>
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Precision Agriculture Specialist</h3>
                            <span className="text-sm font-medium text-agriculture">82% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Implement technology-driven farming solutions
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $55,000 - $85,000</span>
                            <span>•</span>
                            <span>📈 High Demand</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Sustainable Farming Consultant</h3>
                            <span className="text-sm font-medium text-agriculture">75% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Advise on sustainable agricultural practices
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $60,000 - $90,000</span>
                            <span>•</span>
                            <span>📈 Very High Demand</span>
                        </div>
                    </div>
                </div>
                <Link
                    href="/dashboard/agriculture/career-pathways"
                    className="mt-4 inline-block text-sm text-agriculture hover:underline"
                >
                    View all career pathways →
                </Link>
            </div>

            {/* Innovation Readiness */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Innovation Readiness Assessment</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Innovation Readiness</span>
                            <span className="text-sm font-medium">{stats?.innovationScore || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-agriculture transition-all"
                                style={{ width: `${stats?.innovationScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/agriculture/assessment"
                        className="inline-block text-sm text-agriculture hover:underline"
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
                    >
                        Add Your First Certification
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="bg-card rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-border"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-1">
                                        {cert.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        {cert.issuingOrg}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDeleteCertification(cert.id, cert.sector)}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Sector Badge */}
                            <div className="mb-4">
                                <span
                                    className={`inline-block px-3 py-1 text-xs rounded-xl font-semibold border ${getSectorColor(
                                        cert.sector
                                    )}`}
                                >
                                    {cert.sector}
                                </span>
                                {cert.neverExpires ? (
                                    <span className="ml-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-xl font-semibold border border-green-300">
                                        Never Expires
                                    </span>
                                ) : isExpired(cert.expiryDate) ? (
                                    <span className="ml-2 inline-block px-3 py-1 bg-red-100 text-red-700 text-xs rounded-xl font-semibold border border-red-300">
                                        Expired
                                    </span>
                                ) : (
                                    <span className="ml-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-xl font-semibold border border-green-300">
                                        Active
                                    </span>
                                )}
                            </div>

                            {/* Dates */}
                            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                                </div>
                                {!cert.neverExpires && cert.expiryDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Credential Link */}
                            {cert.credentialUrl && (
                                <a
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    View Credential
                                </a>
                            )}

                            {/* Skills */}
                            {cert.skills && cert.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {cert.skills.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {cert.skills.length > 3 && (
                                        <span className="px-3 py-1 text-muted-foreground text-xs font-medium">
                                            +{cert.skills.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Certification Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h2 className="text-xl font-bold">Add Certification</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCertification} className="p-6 space-y-4">
                            {/* Sector */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Sector *</label>
                                <select
                                    value={formSector}
                                    onChange={(e) => setFormSector(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    required
                                >
                                    <option value="HEALTHCARE">Healthcare</option>
                                    <option value="AGRICULTURE">Agriculture</option>
                                    <option value="URBAN">Urban</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Certification Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    placeholder="e.g., CPHIMS, AWS Certified"
                                    required
                                />
                            </div>

                            {/* Issuing Organization */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
                                <input
                                    type="text"
                                    value={formData.issuingOrg}
                                    onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    placeholder="e.g., HIMSS, Amazon Web Services"
                                    required
                                />
                            </div>

                            {/* Credential ID */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Credential ID</label>
                                <input
                                    type="text"
                                    value={formData.credentialId}
                                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    placeholder="Optional"
                                />
                            </div>

                            {/* Credential URL */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Credential URL</label>
                                <input
                                    type="url"
                                    value={formData.credentialUrl}
                                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Issue Date */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Issue Date *</label>
                                <input
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    required
                                />
                            </div>

                            {/* Never Expires */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="neverExpires"
                                    checked={formData.neverExpires}
                                    onChange={(e) => setFormData({ ...formData, neverExpires: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="neverExpires" className="text-sm font-medium">
                                    This certification never expires
                                </label>
                            </div>

                            {/* Expiry Date */}
                            {!formData.neverExpires && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    />
                                </div>
                            )}

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Related Skills</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                        className="flex-1 px-4 py-2 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                        placeholder="Add a skill"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-lg text-sm"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 border-2 border-border rounded-xl font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
                                >
                                    {submitting ? "Adding..." : "Add Certification"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
