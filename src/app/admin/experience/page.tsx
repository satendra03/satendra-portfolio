"use client";

import React, { useState, useEffect } from "react";
import { Organization } from "@/types";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Plus, Trash, Pencil, X } from "lucide-react";
import SortableList from "@/components/admin/sortable-list";

export default function AdminExperience() {
    const [experiences, setExperiences] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Organization | null>(null);

    const [formData, setFormData] = useState<Omit<Organization, "id">>({
        name: "",
        role: "",
        description: "",
        funny: "",
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "experiences"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Organization[];
            // Sort client-side ensuring numeric comparison
            setExperiences(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (error) {
            console.error("Error fetching experiences:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newExperiences: Organization[]) => {
        setExperiences(newExperiences);
        try {
            const batch = writeBatch(db);
            newExperiences.forEach((exp, index) => {
                if (exp.id) {
                    const ref = doc(db, "experiences", exp.id);
                    batch.update(ref, { order: index });
                }
            });
            await batch.commit();
        } catch (error) {
            console.error("Error updating experience order:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExperience && editingExperience.id) {
                await updateDoc(doc(db, "experiences", editingExperience.id), formData);
            } else {
                const newOrder = experiences.length;
                await addDoc(collection(db, "experiences"), { ...formData, order: newOrder });
            }
            setIsModalOpen(false);
            setEditingExperience(null);
            setFormData({ name: "", role: "", description: "", funny: "" });
            fetchExperiences();
        } catch (error) {
            console.error("Error saving experience:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this experience?")) {
            try {
                await deleteDoc(doc(db, "experiences", id));
                fetchExperiences();
            } catch (error) {
                console.error("Error deleting experience:", error);
            }
        }
    };

    const handleEdit = (org: Organization) => {
        setEditingExperience(org);
        setFormData({
            name: org.name,
            role: org.role,
            description: org.description,
            funny: org.funny,
        });
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingExperience(null);
        setFormData({ name: "", role: "", description: "", funny: "" });
        setIsModalOpen(true);
    };

    if (loading) return <div>Loading experiences...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Experience</h1>
                <button
                    onClick={openNewModal}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Experience
                </button>
            </div>

            <SortableList
                items={experiences}
                onReorder={handleReorder}
                renderItem={(org) => (
                    <div className="w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-black">{org.name}</h3>
                                <p className="text-gray-600 font-medium">{org.role}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(org); }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (org.id) handleDelete(org.id); }}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 space-y-2">
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold">Desc:</span> {org.description}
                            </p>
                            <p className="text-gray-500 text-sm italic">
                                <span className="font-semibold">Funny:</span> {org.funny}
                            </p>
                        </div>
                    </div>
                )}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-black">{editingExperience ? "Edit Experience" : "New Experience"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-black">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Funny Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.funny}
                                    onChange={(e) => setFormData({ ...formData, funny: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div className="flex justify-end pt-4 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                                    {editingExperience ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
