"use client";
import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  IconBrandTabler,
  IconUserBolt,
  IconCalendarEvent,
  IconFileDollar,
  IconSettings,
  IconArrowLeft,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { AuthContext } from "@/providers/AuthProvider";

interface SidebarLinkProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}


const MobileSidebarVolunteer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logOut } = useContext(AuthContext);
  
    const handleLogOut = async () => {
      try {
        await logOut();
        console.log("User logged out successfully");
        // Redirect to home or login page if needed
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
  
    const links: SidebarLinkProps[] = [
      { label: "Dashboard", href: "/donor", icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
      { label: "Donate Now", href: "/donor/donate-now", icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
      { label: "Transaction History", href: "/donor/transaction-history", icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },,
      { label: "Settings", href: "#", icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
      { label: "Logout", href: "/login", icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, onClick: handleLogOut },
    ];
  
    return (
      <>
        <button className="fixed  z-50 p-2 md:hidden" onClick={() => setIsOpen(true)}>
          <IconMenu2 className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
        </button>
        
        <div className="hidden h-screen w-64 flex-col border-r border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 md:flex">
          <nav className="flex flex-1 flex-col gap-2">
            {links.map((link, index) => (
              <SidebarLinkItem key={index} link={link} />
            ))}
          </nav>
        </div>
  
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 z-50 h-screen w-64 bg-white p-4 shadow-lg dark:bg-neutral-800"
            >
              <nav className="mt-8 flex flex-1 flex-col gap-2">
                {links.map((link, index) => (
                  <SidebarLinkItem key={index} link={link} onClick={() => setIsOpen(false)} />
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };
  
const SidebarLinkItem = ({ 
  link, 
  onClick 
}: { 
  link: SidebarLinkProps; 
  onClick?: () => void 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={link.href}
      onClick={handleClick}
      className="flex items-center gap-3 rounded-lg p-3 text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
    >
      {link.icon}
      <span>{link.label}</span>
    </Link>
  );
};

export default MobileSidebarVolunteer;