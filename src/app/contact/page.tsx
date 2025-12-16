import React from "react";
import FontDraggableText from "@/components/ui/font-draggable-text";
import TextToggle from "@/components/ui/text-toggle";
import { ContactLinkItem } from "@/components/modules/contact-item";
import { getContacts } from "@/services/portfolio";

export const revalidate = 60; // Revalidate every minute

export default async function Contact() {
    const contactLinks = await getContacts();

    return (
        <div className="projects w-screen overflow-x-hidden">
            <div className="content py-20 w-full min-h-[100vh]">
                <div className="heading w-full mt-20 flex items-center flex-col justify-center py-3 md:py-5">
                    <div className="about-me flex gap-5">
                        <FontDraggableText
                            words={["Contact", "Me?"]}
                            size={"text-3xl md:text-5xl"}
                        />
                    </div>
                    <div className="more-text mt-3 flex-col flex items-center justify-center text-center text-black/40 text-md md:text-lg">
                        <p className="tracking-tighter">
                            {" "}
                            Prepare Your{" "}
                            <span className="underline bg-red-400 px-1 text-white">
                                Cheque
                            </span>
                            <br />
                            we&apos;ll start a project soon!
                        </p>
                    </div>
                </div>

                <div className="text-content flex flex-col gap-12 items-center justify-center text-center font-bold tracking-tighter py-24 px-10 md:px-36 md:py-20">
                    <TextToggle
                        className="text-3xl md:text-4xl text-center"
                        textTrue={
                            "Need a coding wizard or just someone to chat about tech over coffee? Let's connect and create something extraordinary!"
                        }
                        textFalse={
                            "Reach out for collaboration, queries, or opportunities. I'm just a message away from bringing your ideas to life."
                        }
                    />

                    <div className="links h-full my-10 flex flex-col gap-5 w-full">
                        <div className="head">
                            <div className="heading text-3xl md:text-5xl">
                                <h4>My Presence!</h4>
                            </div>
                            <div className="more-text md:mt-2 flex-col flex items-center justify-center text-center text-black/40 font-normal">
                                <p className="tracking-tighter">
                                    {" "}
                                    not{" "}
                                    <span className="underline text-white bg-red-400 px-1">
                                        omnipresent
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="skills-list p-3 my-10">
                            <div className="skill w-full h-full flex flex-col gap-10">
                                {contactLinks.map((contact, index) => (
                                    <ContactLinkItem key={index} contact={contact} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="font-normal">I cant be everywhere!</p>
                </div>
            </div>
        </div>
    );
}
