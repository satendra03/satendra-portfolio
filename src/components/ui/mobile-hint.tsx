"use client";

import React from "react";
import useMobile from "@/hooks/use-mobile";

export default function MobileHint() {
    const isMobile = useMobile();
    return (
        <div className="hidden-text w-full flex items-center mt-5 justify-center text-gray-200 pointer-events-none select-none">
            {isMobile ? "(You can tap me)" : "(You can hover over)"}
        </div>
    );
}
// Force refresh
