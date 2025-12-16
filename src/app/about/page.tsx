import React from "react";
import FontDraggableText from "@/components/ui/font-draggable-text";
import TextToggle from "@/components/ui/text-toggle";
import { VelocityScroll } from "@/components/ui/velocity-scroll";
import Link from "next/link";
import { getSkills, getExperiences, getTechnologies } from "@/services/portfolio";
import { Skill, Organization, Technology } from "@/types";

// Client component wrapper for mobile check if needed, or just standard responsive CSS.
// The original used useMobile for specific text changes "(You can tap me)" vs "(You can hover over)".
// We can handle that with CSS hidden/block or a small client component.
import MobileHint from "@/components/ui/mobile-hint";

export const revalidate = 3600; // Revalidate every hour

export default async function About() {
    const skills: Skill[] = await getSkills();
    const organizations: Organization[] = await getExperiences();
    const technologies: Technology[] = await getTechnologies();

    return (
        <div className="about w-screen overflow-x-hidden">
            <div className="content py-20 w-full min-h-[300vh]">

                {/* Header Section */}
                <div className="heading w-full flex items-center flex-col justify-center py-3 md:py-5">
                    <div className="about-me flex gap-5">
                        <FontDraggableText
                            words={["About", "Me?"]}
                            size={"text-3xl md:text-5xl"}
                        />
                    </div>
                    <div className="more-text mt-3 flex-col flex items-center justify-center text-center text-black/40 text-md md:text-lg">
                        <p className="tracking-tighter">
                            {" "}
                            are you really{" "}
                            <span className="underline bg-red-400 px-1 text-white">
                                Interested?
                            </span>
                        </p>
                    </div>
                </div>

                {/* Text Toggle Section */}
                <div className="text-content text-center font-bold tracking-tighter py-10 px-10 md:px-36 md:py-20">
                    <TextToggle
                        className={"text-4xl lg:text-6xl"}
                        textTrue={
                            "A visual designer with decent skills — still holding out against AI takeover — crafting 'masterpieces' only when the bribe, I mean paycheck, hits the sweet spot."
                        }
                        textFalse={
                            "I'm a selectively skilled designer and developer with strong focus on producing high quality & impactful digital experience."
                        }
                    />
                </div>

                {/* Velocity Scroll Section */}
                <div className="velocity-text py-44">
                    <VelocityScroll
                        text={" Satendra is best •"}
                        default_velocity={3}
                        className="font-display text-center hover:text-red-400 text-6xl font-bold tracking-[-0.02em] text-black/20 drop-shadow-lg select-none dark:text-white md:text-7xl md:leading-[5rem]"
                    />
                    <MobileHint />
                </div>

                <div className="text-content mt-10 text-center flex flex-col gap-32 items-center justify-center font-bold tracking-tighter py-10 px-10 md:px-36 md:py-20">

                    {/* Skills Section */}
                    <div className="skills h-full my-10 flex flex-col gap-5 w-full">
                        <div className="head">
                            <div className="heading text-3xl md:text-5xl">
                                <h4> What I do!</h4>
                            </div>
                            <div className="more-text md:mt-2 flex-col flex items-center justify-center text-center text-black/40 font-normal">
                                <p className="tracking-tighter">
                                    {" "}
                                    to{" "}
                                    <span className="underline text-white bg-red-400 px-1">
                                        Earn
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="skills-list p-3 my-10">
                            <div className="skill w-full h-full flex flex-col gap-10">
                                {skills.map((skill, index) => (
                                    <SkillItem key={skill.id || index} skill={skill} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Experiences Section */}
                    <div className="experience h-full my-10 flex flex-col gap-5 w-full">
                        <div className="head">
                            <div className="heading text-3xl md:text-5xl">
                                <h4>Experiences</h4>
                            </div>
                            <div className="more-text md:mt-2 flex-col flex items-center justify-center text-center text-black/40 font-normal">
                                <p className="tracking-tighter">
                                    Some{" "}
                                    <span className="underline text-white bg-red-400 px-1">
                                        lucky
                                    </span>{" "}
                                    organizations
                                </p>
                            </div>
                        </div>

                        <div className="organizations-list p-3 my-10">
                            <div className="organization w-full h-full flex flex-col gap-10">
                                {organizations.map((org, index) => (
                                    <OrganizationItem key={org.id || index} org={org} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Technologies Section */}
                    <div className="technologies h-full mt-10 flex flex-col gap-5 w-full">
                        <div className="head">
                            <div className="heading text-3xl md:text-5xl">
                                <h4>What I Use</h4>
                            </div>
                            <div className="more-text md:mt-2 flex-col flex items-center justify-center text-center text-black/40 font-normal">
                                <p className="tracking-tighter">
                                    My{" "}
                                    <span className="underline text-white bg-red-400 px-1">
                                        dependency array
                                    </span>{" "}
                                </p>
                            </div>
                        </div>

                        <div className="technologies-list p-3 my-10">
                            <div className="technology w-full h-full flex flex-col gap-10">
                                {technologies.map((tech, index) => (
                                    <TechnologyItem key={tech.id || index} tech={tech} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p>
                        This array will increase... for sure! <br /> Till then! <br />
                        <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={"https://buymeacoffee.com/satendra03"}
                            className="underline font-normal"
                        >
                            Buy me a coffee!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Client components for hover effects (since standard CSS hover works mostly, but state was used in orig)
// To keep it simple and server-side friendly where possible, we can use CSS group-hover.
// However, the original used state to change the TEXT content on hover (funny vs description).
// So we need client components for these items.

import { SkillItem, OrganizationItem, TechnologyItem } from "@/components/modules/about-items";
