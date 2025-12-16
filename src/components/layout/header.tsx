"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import useMobile from "@/hooks/use-mobile";
import Image from "next/image";

function Header() {
    const pathname = usePathname();
    const isMobile = useMobile();
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const linksData = [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Projects", path: "/projects" },
        { label: "Contact", path: "/contact" },
    ];

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollTop]);

    // bg-white-100 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10
    return (
        <div
            className={`header  md:border-none w-screen h-16 md:h-16 fixed top-0 left-0
      flex items-center justify-between p-1 md:p-2 transition-transform duration-300 z-50 
      ${isVisible ? "translate-y-0" : "-translate-y-full"}
      bg-white/10 bg-clip-padding backdrop-filter backdrop-blur-xl`}
        // Changed bg-white-100 to bg-white/10 for Tailwind 
        >
            <Link href={"/"} className="logo flex items-center justify-center flex-col gap-1">
                <div className={`relative ${isMobile ? 'w-32 h-6' : 'w-36 h-7'}`}>
                    <Image src="/SATENDRA.svg" alt="Satendra" fill className="object-contain" />
                </div>
                <div className={`relative ${isMobile ? 'w-32 h-6' : 'w-36 h-7'}`}>
                    <Image src="/PARTETI.svg" alt="Parteti" fill className="object-contain" />
                </div>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-center cursor-pointer">
                <Menu size={40} onClick={() => setMenuOpen(true)} />
            </div>

            {/* Mobile Links */}
            <div
                className={`mobile-links fixed top-0 left-0 w-screen overflow-hidden h-screen bg-white z-50 flex flex-col items-center justify-center space-y-6
        transition-all duration-500 ease-in-out transform ${menuOpen ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    transform: menuOpen ? "translateX(0)" : "translateX(100%)",
                }}
            // Using visible/invisible classes or pointer-events might be better for accessibility but transform is fine
            >
                <div className="cross-btn fixed top-2 right-2 cursor-pointer">
                    <X size={40} onClick={() => setMenuOpen(false)} />
                </div>
                {linksData.map((link) => (
                    <Link
                        key={link.label}
                        href={link.path}
                        className={`link text-2xl px-3 border-b-2 border-black/50 text-black hover:text-black/50 ${link.path == pathname && "text-red-400"}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Desktop Links */}
            <div className="links h-full hidden md:flex justify-between items-center gap-4">
                {linksData.map((link) => (
                    <Link
                        key={link.label}
                        href={link.path}
                        className={`link text-black hover:text-black/50 ${link.path == pathname && "text-red-400"}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Header;
