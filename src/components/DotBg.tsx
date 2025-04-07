import { cn } from "@/lib/utils";
import React from "react";
import ContactPage from "./Contact";

export function DotBackgroundDemo() {
  return (
    <div className="relative flex w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <ContactPage></ContactPage>
    </div>
  );
}
