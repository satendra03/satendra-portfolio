"use client";

import React, { useState, useEffect } from "react";
import { ContactLink } from "@/types";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Plus, Trash, Pencil, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import SortableList from "@/components/admin/sortable-list";
import { revalidateContacts } from "@/app/actions/revalidate";

export default function AdminContacts() {
    const [contacts, setContacts] = useState<ContactLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<ContactLink | null>(null);

    const [formData, setFormData] = useState<Omit<ContactLink, "id">>({
        title: "",
        link: "",
        desc: "",
        icon: "Mail",
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "contacts"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ContactLink[];
            // Sort client-side ensuring numeric comparison
            setContacts(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newContacts: ContactLink[]) => {
        setContacts(newContacts);
        try {
            const batch = writeBatch(db);
            newContacts.forEach((contact, index) => {
                if (contact.id) {
                    const ref = doc(db, "contacts", contact.id);
                    batch.update(ref, { order: index });
                }
            });
            await batch.commit();
            await revalidateContacts();
        } catch (error) {
            console.error("Error updating contact order:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingContact && editingContact.id) {
                await updateDoc(doc(db, "contacts", editingContact.id), formData);
            } else {
                const newOrder = contacts.length;
                await addDoc(collection(db, "contacts"), { ...formData, order: newOrder });
            }
            setIsModalOpen(false);
            setEditingContact(null);
            setFormData({ title: "", link: "", desc: "", icon: "Mail" });
            fetchContacts();
            await revalidateContacts();
        } catch (error) {
            console.error("Error saving contact:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this contact?")) {
            try {
                await deleteDoc(doc(db, "contacts", id));
                fetchContacts();
                await revalidateContacts();
            } catch (error) {
                console.error("Error deleting contact:", error);
            }
        }
    };

    const handleEdit = (contact: ContactLink) => {
        setEditingContact(contact);
        setFormData({
            title: contact.title,
            link: contact.link,
            desc: contact.desc,
            icon: contact.icon,
        });
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingContact(null);
        setFormData({ title: "", link: "", desc: "", icon: "Mail" });
        setIsModalOpen(true);
    };

    if (loading) return <div>Loading contacts...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Contacts</h1>
                <button
                    onClick={openNewModal}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Contact
                </button>
            </div>

            <SortableList
                items={contacts}
                onReorder={handleReorder}
                renderItem={(contact) => {
                    // @ts-expect-error - LucideIcons key access
                    const IconComponent = LucideIcons[contact.icon] as React.ElementType || LucideIcons.HelpCircle;
                    return (
                        <div className="w-full">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <IconComponent size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-black">{contact.title}</h3>
                                        <p className="text-gray-500 text-xs truncate max-w-[200px]">{contact.link}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEdit(contact); }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (contact.id) handleDelete(contact.id); }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-gray-600 text-sm">
                                    {contact.desc}
                                </p>
                            </div>
                        </div>
                    );
                }}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-black">{editingContact ? "Edit Contact" : "New Contact"}</h2>
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
                                    placeholder="e.g. Email, GitHub"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="e.g. Mail, Github, Twitter"
                                />
                                <p className="text-xs text-gray-400 mt-1">Found at <a href="https://lucide.dev/icons" target="_blank" className="underline">lucide.dev</a></p>
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
                                    {editingContact ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
