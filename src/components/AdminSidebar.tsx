"use client";
import React, { useContext, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconCalendarEvent,
  IconFileDollar
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/providers/AuthProvider";
 
export function SidebarDemo() {
  const { logOut } = useContext(AuthContext);
  const router = useRouter();

  const handleLogOut = async () => {
    await logOut();
    router.push("/");
  };

  const links = [
    { label: "Dashboard", href: "/admin", icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Manage Users", href: "/admin/manageUsers", icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Events", href: "/admin/eventManage", icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Donations", href: "/admin/donations", icon: <IconFileDollar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Settings", href: "/admin/profile", icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Logout", href: "#", icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, onClick: handleLogOut },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sticky Sidebar */}
      <div className="sticky top-0 h-screen overflow-y-auto">
        <Sidebar open={open} setOpen={setOpen} animate={true}>
          <SidebarBody className="flex flex-col justify-between ">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <Logo />
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} onClick={link.onClick ? link.onClick : undefined} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
      
    </div>
  );
}

export const Logo = () => {
  return (
    <Link href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-black dark:text-white">
        Ecovision Partners
      </motion.span>
    </Link>
  );
};

export const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((_, idx) => (
            <div key={idx} className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((_, idx) => (
            <div key={idx} className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
