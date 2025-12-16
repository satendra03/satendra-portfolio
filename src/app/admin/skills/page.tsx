"use client";

import React, { useState, useEffect } from "react";
import { Skill } from "@/types";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Plus, Trash, Pencil, X } from "lucide-react";
import SortableList from "@/components/admin/sortable-list";

export default function AdminSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const [formData, setFormData] = useState<Omit<Skill, "id">>({
        title: "",
        description: "",
        funny: "",
        category: "",
    });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "skills"));
            const skillsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Skill[];
            // Sort client-side ensuring numeric comparison
            setSkills(skillsData.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newSkills: Skill[]) => {
        setSkills(newSkills);
        try {
            const batch = writeBatch(db);
            newSkills.forEach((skill, index) => {
                if (skill.id) {
                    const ref = doc(db, "skills", skill.id);
                    batch.update(ref, { order: index });
                }
            });
            await batch.commit();
        } catch (error) {
            console.error("Error updating skill order:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSkill && editingSkill.id) {
                await updateDoc(doc(db, "skills", editingSkill.id), formData);
            } else {
                const newOrder = skills.length;
                await addDoc(collection(db, "skills"), { ...formData, order: newOrder });
            }
            setIsModalOpen(false);
            setEditingSkill(null);
            setFormData({
                title: "",
                description: "",
                funny: "",
                category: "",
            });
            fetchSkills();
        } catch (error) {
            console.error("Error saving skill:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this skill?")) {
            try {
                await deleteDoc(doc(db, "skills", id));
                fetchSkills();
            } catch (error) {
                console.error("Error deleting skill:", error);
            }
        }
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            title: skill.title,
            description: skill.description,
            funny: skill.funny,
            category: skill.category || "",
        });
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingSkill(null);
        setFormData({
            title: "",
            description: "",
            funny: "",
            category: "",
        });
        setIsModalOpen(true);
    }

    if (loading) return <div>Loading skills...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Skills</h1>
                <button
                    onClick={openNewModal}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Skill
                </button>
            </div>

            <SortableList
                items={skills}
                onReorder={handleReorder}
                renderItem={(skill) => (
                    <div className="w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-black">{skill.title}</h3>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{skill.category}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(skill); }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (skill.id) handleDelete(skill.id); }}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 space-y-2">
                            <p className="text-gray-600 text-sm"><span className="font-semibold">Desc:</span> {skill.description}</p>
                            <p className="text-gray-500 text-sm italic"><span className="font-semibold">Funny:</span> {skill.funny}</p>
                        </div>
                    </div>
                )}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-black">{editingSkill ? "Edit Skill" : "New Skill"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-black">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="e.g. Visual"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Visual">Visual</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="UI/UX">UI/UX</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Formal)</label>
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
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                >
                                    {editingSkill ? "Update Skill" : "Add Skill"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
