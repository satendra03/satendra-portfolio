"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface TextToggleProps {
    textTrue: string;
    textFalse: string;
    className?: string;
}

function TextToggle({ textTrue, textFalse, className }: TextToggleProps) {
    const [reality, setReality] = useState(false);
    const toggleReality = () => {
        setReality(!reality);
    };
    return (
        <>
            <p className={cn(`text-4xl md:text-5xl ${reality && "text-gray-400"}`, className)}>{reality ? textTrue : textFalse}

            </p>
            <div
                className={`py-5 flex items-center justify-center text-gray-400`}
            >
                {reality ? <Eye className="hover:cursor-pointer" onClick={toggleReality} /> : <EyeOff className="hover:cursor-pointer" onClick={toggleReality} />}
            </div>
        </>
    );
}

export default TextToggle;
