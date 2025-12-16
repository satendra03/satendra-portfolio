"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    // Don't show public header on login or admin pages
    const isHidden = pathname === "/login" || pathname.startsWith("/admin");

    if (isHidden) return null;

    return <Header />;
}
