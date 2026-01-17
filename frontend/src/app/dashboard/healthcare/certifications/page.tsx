"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Calendar, ExternalLink, X, Trash2, Search, Pencil } from "lucide-react";

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

const SECTOR = "HEALTHCARE";

export default function HealthcareCertificationsPage() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);
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

    const isExpired = (expiryDate?: string) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skillToRemove),
        });
    };

    const handleAddCertification = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${SECTOR.toLowerCase()}/certifications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
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

    const handleDeleteCertification = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certification?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${SECTOR.toLowerCase()}/certifications/${id}`,
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

    const handleEditCertification = (cert: Certification) => {
        setEditingCert(cert);
        setFormData({
            name: cert.name,
            issuingOrg: cert.issuingOrg,
            credentialId: cert.credentialId || "",
            credentialUrl: cert.credentialUrl || "",
            issueDate: cert.issueDate.split('T')[0],
            expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : "",
            neverExpires: cert.neverExpires,
            skills: cert.skills,
        });
        setShowEditModal(true);
    };

    const handleUpdateCertification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCert) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${SECTOR.toLowerCase()}/certifications/${editingCert.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                setShowEditModal(false);
                setEditingCert(null);
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
            console.error("Failed to update certification:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const fetchCertifications = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${SECTOR.toLowerCase()}/certifications`,
                { headers }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setCertifications(data.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch certifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCertifications();
    }, [fetchCertifications]);

    const filteredCertifications = certifications.filter((cert) =>
        cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuingOrg.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground font-medium">Loading certifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Healthcare Certifications</h1>
                {certifications.length > 0 && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Certification</span>
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border-2 border-border">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search certifications..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground font-medium"
                    />
                </div>
            </div>

            {/* Certifications Grid */}
            {filteredCertifications.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-border">
                    <p className="text-muted-foreground mb-6 text-lg">
                        {searchTerm ? "No certifications found matching your search" : "You haven't added any certifications yet"}
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Your First Certification</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertifications.map((cert) => (
                        <div key={cert.id} className="bg-card rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-border">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-1">{cert.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">{cert.issuingOrg}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEditCertification(cert)}
                                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Edit certification"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCertification(cert.id)}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete certification"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="mb-4">
                                {cert.neverExpires ? (
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-xl font-semibold border border-green-300">
                                        Never Expires
                                    </span>
                                ) : isExpired(cert.expiryDate) ? (
                                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs rounded-xl font-semibold border border-red-300">
                                        Expired
                                    </span>
                                ) : (
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-xl font-semibold border border-green-300">
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
                                        <span key={index} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                    {cert.skills.length > 3 && (
                                        <span className="px-3 py-1 text-muted-foreground text-xs font-medium">+{cert.skills.length - 3} more</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Certification</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCertification} className="p-6 space-y-4 bg-white dark:bg-gray-900">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Certification Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder="e.g., CPHIMS, AWS Certified"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Issuing Organization *</label>
                                <input
                                    type="text"
                                    value={formData.issuingOrg}
                                    onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder="e.g., HIMSS, Amazon Web Services"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Credential ID</label>
                                <input
                                    type="text"
                                    value={formData.credentialId}
                                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Credential URL</label>
                                <input
                                    type="url"
                                    value={formData.credentialUrl}
                                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Issue Date *</label>
                                <input
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="neverExpires"
                                    checked={formData.neverExpires}
                                    onChange={(e) => setFormData({ ...formData, neverExpires: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="neverExpires" className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                    This certification never expires
                                </label>
                            </div>

                            {!formData.neverExpires && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Related Skills</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                        className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                        placeholder="Add a skill"
                                    />
                                    <button type="button" onClick={addSkill} className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90">
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg text-sm border border-gray-300 dark:border-gray-700">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600 dark:hover:text-red-400">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50 hover:bg-primary/90">
                                    {submitting ? "Adding..." : "Add Certification"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingCert && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Certification</h2>
                            <button onClick={() => { setShowEditModal(false); setEditingCert(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateCertification} className="p-6 space-y-4 bg-white dark:bg-gray-900">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Certification Name *</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Issuing Organization *</label>
                                <input type="text" required value={formData.issuingOrg} onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Credential ID</label>
                                <input type="text" value={formData.credentialId} onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Credential URL</label>
                                <input type="url" value={formData.credentialUrl} onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Issue Date *</label>
                                <input type="date" required value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="edit-neverExpires" checked={formData.neverExpires} onChange={(e) => setFormData({ ...formData, neverExpires: e.target.checked })} className="w-4 h-4 text-primary border-gray-300 rounded" />
                                <label htmlFor="edit-neverExpires" className="text-sm font-medium text-gray-900 dark:text-gray-200">This certification does not expire</label>
                            </div>

                            {!formData.neverExpires && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Expiry Date</label>
                                    <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Related Skills</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500" placeholder="Add a skill" />
                                    <button type="button" onClick={addSkill} className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg text-sm border border-gray-300 dark:border-gray-700">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600 dark:hover:text-red-400"><X className="h-3 w-3" /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => { setShowEditModal(false); setEditingCert(null); }} className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50 hover:bg-primary/90">{submitting ? "Updating..." : "Update Certification"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
