import React from "react";
import Link from "next/link";
import { FolderOpen, Code, Briefcase, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome back, Admin</h1>
                <p className="text-gray-500 mt-2 text-lg">Here&apos;s an overview of your portfolio content.</p>
            </div>

            {/* Quick Stats / Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/projects" className="group block">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-black/10 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FolderOpen size={24} />
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-black transition-colors" size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Projects</h3>
                        <p className="text-gray-500 mt-1 text-sm">Manage your case studies and experiments.</p>
                    </div>
                </Link>

                <Link href="/admin/skills" className="group block">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-black/10 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Code size={24} />
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-black transition-colors" size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                        <p className="text-gray-500 mt-1 text-sm">Update your technical expertise keypoints.</p>
                    </div>
                </Link>

                <Link href="/admin/experience" className="group block">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-black/10 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <Briefcase size={24} />
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-black transition-colors" size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Experience</h3>
                        <p className="text-gray-500 mt-1 text-sm">Add new work roles and organizations.</p>
                    </div>
                </Link>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 w-full md:w-2/3">
                    <h2 className="text-2xl font-bold mb-4">Pro Tip</h2>
                    <p className="text-gray-300 leading-relaxed">
                        When adding images, use Cloudinary&apos;s auto-format and optimization features.
                        Keep your project descriptions concise and focused on the problem you solved.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>
        </div>
    );
}
