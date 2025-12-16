"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    Code,
    FolderOpen,
    LogOut,
    Image as ImageIcon,
    Link as LinkIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Projects", href: "/admin/projects", icon: FolderOpen },
        { label: "Skills", href: "/admin/skills", icon: Code },
        { label: "Experience", href: "/admin/experience", icon: Briefcase },
        { label: "Technologies", href: "/admin/technologies", icon: ImageIcon },
        { label: "Contacts", href: "/admin/contacts", icon: LinkIcon },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Main</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-black text-white shadow-lg shadow-black/20"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors rounded-xl"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
