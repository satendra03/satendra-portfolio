"use client";

import React, { useState } from "react";
import { Skill, Organization, Technology } from "@/types";

export const SkillItem = ({ skill }: { skill: Skill }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="item flex flex-col md:flex-row items-center justify-center md:gap-3"
        >
            <div
                className={`min-w-36 md:min-w-fit flex flex-wrap 
      ${hovered && "text-black/40 drop-shadow-md"}
        `}
            >
                <span className="text-6xl md:text-7xl uppercase">
                    {skill.title}
                </span>
            </div>
            <div
                className="desc flex items-center justify-center
      "
            >
                <p
                    className={`text-lg font-normal text-center md:text-start md:text-2xl tracking-tighter ${hovered && "text-red-400 drop-shadow-lg"
                        } `}
                >
                    {hovered ? skill.funny : skill.description}
                </p>
            </div>
        </div>
    );
};

export const OrganizationItem = ({ org }: { org: Organization }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="item flex flex-col md:flex-row items-center justify-center md:gap-3"
        >
            <div className="main-text min-w-36 md:min-w-fit flex flex-col">
                <div
                    className={`${hovered && "text-black/40 drop-shadow-md"
                        }`}
                >
                    {org.name.split("").map((letter, indexx) => {
                        return (
                            <span
                                key={indexx}
                                className="text-6xl md:text-7xl uppercase"
                            >
                                {letter}
                            </span>
                        );
                    })}
                </div>
                <p
                    className={`font-normal ${hovered ? "text-black" : "text-gray-500"
                        }`}
                >
                    {org.role}
                </p>
            </div>
            <div className="desc flex items-center justify-center">
                <p
                    className={`text-lg font-normal text-center md:text-start md:text-2xl tracking-tighter ${hovered ? "text-red-400 drop-shadow-lg" : ""
                        }`}
                >
                    {hovered ? org.funny : org.description}
                </p>
            </div>
        </div>
    );
};

export const TechnologyItem = ({ tech }: { tech: Technology }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="item flex flex-col md:flex-row items-center justify-center md:gap-2"
        >
            <div className="main-text min-w-64 flex flex-col">
                <div
                    className={`${hovered && "text-black/40 drop-shadow-md"
                        }`}
                >
                    {tech.name.split("").map((letter, indexx) => {
                        return (
                            <span
                                key={indexx}
                                className="text-2xl md:text-5xl uppercase"
                            >
                                {letter}
                            </span>
                        );
                    })}
                </div>
                <p
                    className={`font-normal ${hovered ? "text-black" : "text-gray-500"
                        }`}
                >
                    {tech.category}
                </p>
            </div>
            <div className="desc flex items-center justify-center">
                <p
                    className={`text-lg font-normal text-center md:text-start md:text-2xl tracking-tighter ${hovered && "text-red-400 drop-shadow-lg"
                        }`}
                >
                    {hovered ? tech.funny : tech.description}
                </p>
            </div>
        </div>
    );
};
