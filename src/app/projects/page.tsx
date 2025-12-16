import React from "react";
import FontDraggableText from "@/components/ui/font-draggable-text";
import TextToggle from "@/components/ui/text-toggle";
import Safari from "@/components/ui/safari";
import Link from "next/link";
import { getProjects } from "@/services/portfolio";
import { Project } from "@/types";

export const revalidate = 3600;

export default async function Projects() {
    const projects: Project[] = await getProjects();

    return (
        <div className="projects w-screen overflow-x-hidden">
            <div className="content py-20 w-full min-h-[100vh]">
                <div className="heading w-full flex items-center flex-col justify-center py-3 md:py-5">
                    <div className="about-me flex gap-5">
                        <FontDraggableText
                            words={["My", "Projects?"]}
                            size={"text-3xl md:text-5xl"}
                        />
                    </div>
                    <div className="more-text mt-3 flex-col flex items-center justify-center text-center text-black/40 text-md md:text-lg">
                        <p className="tracking-tighter">
                            {" "}
                            Really? Who are{" "}
                            <span className="underline bg-red-400 px-1 text-white">You?</span>
                            Bruhh
                        </p>
                    </div>
                </div>

                <div className="text-content h-[60vh] flex flex-col items-center justify-center text-center font-bold tracking-tighter py-10 px-10 md:px-36 md:py-20">
                    <TextToggle
                        className={"text-4xl lg:text-6xl"}
                        textTrue={
                            "An elite gallery of code experiments that occasionally work, fueled by caffeine, stack overflow, chatGPT, and a whole lot of 'trial and error.'"
                        }
                        textFalse={
                            "A showcase of thoughtfully designed and technically robust projects, reflecting dedication, creativity, and innovation."
                        }
                    />
                </div>

                <h1 className="w-screen flex items-center justify-center mt-36 mb-10 md:mt-36 text-4xl md:text-6xl font-bold">
                    The List
                </h1>
                <div className="text-content text-center flex flex-col gap-32 items-center justify-center font-bold tracking-tighter py-8 px-10 md:px-16 md:py-20">

                    <div className="projects w-full flex flex-col gap-36">
                        {projects.map((project, index) => (
                            <div
                                key={project.id || project.title}
                                className={`project flex flex-col gap-3 md:flex-row ${index % 2 ? "md:flex-row-reverse" : ""} p-1`}
                            >
                                <div className="mockups w-full md:w-1/2">
                                    <div className="browser w-full">
                                        <Link
                                            href={project.liveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Safari
                                                src={project.desktopImage}
                                                url={project.liveLink}
                                                className="size-full drop-shadow-2xl hover:scale-105 transition-all"
                                            /></Link>
                                    </div>
                                </div>
                                <div className="text w-full md:w-1/2 flex items-center justify-center flex-col">
                                    <div className="heading text-xl md:text-5xl">
                                        <h4>{project.title}</h4>
                                    </div>
                                    <p className="font-normal text-lg md:text-2xl text-gray-500">
                                        {project.description}
                                    </p>
                                    <div className="links flex gap-5 font-normal underline mt-5">
                                        <Link
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            GitHub
                                        </Link>
                                        <Link
                                            href={project.liveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Live
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="more-project">
                        These are nothing <br /> in front of my <br /> <Link href="https://github.com/satendra03" className="underline font-normal">Github</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
