"use client";

import React, { useState, useEffect } from "react";
import { Technology } from "@/types";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Plus, Trash, Pencil, X } from "lucide-react";
import SortableList from "@/components/admin/sortable-list";
import { revalidateTechnologies } from "@/app/actions/revalidate";

export default function AdminTechnologies() {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState<Technology | null>(null);

    const [formData, setFormData] = useState<Omit<Technology, "id">>({
        name: "",
        category: "",
        description: "",
        funny: "",
    });

    useEffect(() => {
        fetchTechnologies();
    }, []);

    const fetchTechnologies = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "technologies"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Technology[];
            // Sort client-side ensuring numeric comparison
            setTechnologies(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (error) {
            console.error("Error fetching technologies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newTechnologies: Technology[]) => {
        setTechnologies(newTechnologies);
        try {
            const batch = writeBatch(db);
            newTechnologies.forEach((tech, index) => {
                if (tech.id) {
                    const ref = doc(db, "technologies", tech.id);
                    batch.update(ref, { order: index });
                }
            });
            await batch.commit();
            await revalidateTechnologies();
        } catch (error) {
            console.error("Error updating technology order:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTech && editingTech.id) {
                await updateDoc(doc(db, "technologies", editingTech.id), formData);
            } else {
                const newOrder = technologies.length;
                await addDoc(collection(db, "technologies"), { ...formData, order: newOrder });
            }
            setIsModalOpen(false);
            setEditingTech(null);
            setFormData({ name: "", category: "", description: "", funny: "" });
            fetchTechnologies();
            await revalidateTechnologies();
        } catch (error) {
            console.error("Error saving technology:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this technology?")) {
            try {
                await deleteDoc(doc(db, "technologies", id));
                fetchTechnologies();
                await revalidateTechnologies();
            } catch (error) {
                console.error("Error deleting technology:", error);
            }
        }
    };

    const handleEdit = (tech: Technology) => {
        setEditingTech(tech);
        setFormData({
            name: tech.name,
            category: tech.category,
            description: tech.description,
            funny: tech.funny,
        });
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingTech(null);
        setFormData({ name: "", category: "", description: "", funny: "" });
        setIsModalOpen(true);
    };

    if (loading) return <div>Loading technologies...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Technologies</h1>
                <button
                    onClick={openNewModal}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Technology
                </button>
            </div>

            <SortableList
                items={technologies}
                onReorder={handleReorder}
                renderItem={(tech) => (
                    <div className="w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-black">{tech.name}</h3>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                    {tech.category}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(tech); }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (tech.id) handleDelete(tech.id); }}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 space-y-2">
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold">Desc:</span> {tech.description}
                            </p>
                            <p className="text-gray-500 text-sm italic">
                                <span className="font-semibold">Funny:</span> {tech.funny}
                            </p>
                        </div>
                    </div>
                )}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-black">{editingTech ? "Edit Technology" : "New Technology"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-black">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="e.g. Frontend, Tools, Design"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Funny Description</label>
                                <textarea
                                    required
                                    rows={2}
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
                                    {editingTech ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
