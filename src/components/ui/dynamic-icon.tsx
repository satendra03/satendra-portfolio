"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

export const DynamicIcon = ({ name, size = 20 }: { name: string; size?: number }) => {
    // @ts-expect-error - LucideIcons key access
    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
        return <LucideIcons.HelpCircle size={size} />;
    }

    return <IconComponent size={size} />;
};
