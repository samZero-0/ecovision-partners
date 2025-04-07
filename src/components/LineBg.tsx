import { cn } from "@/lib/utils";
import React from "react";
import AboutUsSection from "./About";

export function GridSmallBackgroundDemo() {
  return (
    <div className="relative flex  w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:60px_60px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
     <AboutUsSection></AboutUsSection>
    </div>
  );
}
