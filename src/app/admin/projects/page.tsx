"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/types";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Plus, Trash, Pencil, X } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/admin/image-upload";
import SortableList from "@/components/admin/sortable-list";

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [formData, setFormData] = useState<Omit<Project, "id">>({
        title: "",
        description: "",
        desktopImage: "",
        liveLink: "",
        githubLink: "",
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            // Fetch projects sorted by order
            const querySnapshot = await getDocs(collection(db, "projects"));
            const projectsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Project[];
            // Sort client-side ensuring numeric comparison
            setProjects(projectsData.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newProjects: Project[]) => {
        setProjects(newProjects);
        try {
            const batch = writeBatch(db);
            newProjects.forEach((project, index) => {
                if (project.id) {
                    const ref = doc(db, "projects", project.id);
                    batch.update(ref, { order: index });
                }
            });
            await batch.commit();
        } catch (error) {
            console.error("Error updating project order:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProject && editingProject.id) {
                await updateDoc(doc(db, "projects", editingProject.id), formData);
            } else {
                // Assign new project to the end of the list
                const newOrder = projects.length;
                await addDoc(collection(db, "projects"), { ...formData, order: newOrder });
            }
            setIsModalOpen(false);
            setEditingProject(null);
            setFormData({
                title: "",
                description: "",
                desktopImage: "",
                liveLink: "",
                githubLink: "",
            });
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteDoc(doc(db, "projects", id));
                fetchProjects();
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            desktopImage: project.desktopImage,
            liveLink: project.liveLink,
            githubLink: project.githubLink,
        });
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingProject(null);
        setFormData({
            title: "",
            description: "",
            desktopImage: "",
            liveLink: "",
            githubLink: "",
        });
        setIsModalOpen(true);
    }

    if (loading) return <div>Loading projects...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Projects</h1>
                <button
                    onClick={openNewModal}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            <SortableList
                items={projects}
                onReorder={handleReorder}
                renderItem={(project) => (
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                            {project.desktopImage ? (
                                <Image src={project.desktopImage} alt={project.title} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-black">{project.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mt-1">{project.description}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (project.id) handleDelete(project.id); }}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-black">{editingProject ? "Edit Project" : "New Project"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-black">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                                <ImageUpload
                                    value={formData.desktopImage}
                                    onChange={(url) => setFormData({ ...formData, desktopImage: url })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Live Link</label>
                                    <input
                                        type="url"
                                        value={formData.liveLink}
                                        onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link</label>
                                    <input
                                        type="url"
                                        value={formData.githubLink}
                                        onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                </div>
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
                                    {editingProject ? "Update Project" : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
