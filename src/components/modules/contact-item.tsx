"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DynamicIcon } from "../ui/dynamic-icon";
import { ContactLink } from "@/types";

export const ContactLinkItem = ({ contact }: { contact: ContactLink }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="item flex flex-col items-center justify-center md:gap-3"
        >
            <div
                className={`min-w-36 text-center md:min-w-fit flex flex-wrap 
      ${hovered && "text-black/40 drop-shadow-md"}
        `}
            >
                <Link
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl md:text-3xl uppercase flex gap-4 items-center justify-center transition-colors"
                >
                    <DynamicIcon name={contact.icon} size={28} />
                    {contact.title}
                </Link>
            </div>
            <div className="desc flex items-center justify-center">
                <p
                    className={`text-lg font-normal text-center tracking-tighter transition-colors ${hovered && "text-red-400 drop-shadow-lg"
                        } `}
                >
                    {contact.desc}
                </p>
            </div>
        </div>
    );
};
