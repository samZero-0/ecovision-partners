"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DirectionAwareHover } from "../../components/ui/direction-aware-hover";

export function DirectionAwareHoverDemo() {
  const imageUrl =
    "https://corporatetraining.usf.edu/hs-fs/hubfs/blogs/CTPE/blog-images/022520-office-design-tips-for-the-ideal-work-environment/office-design-tips-for-the-ideal-work-environment-inline.jpg?width=740&name=office-design-tips-for-the-ideal-work-environment-inline.jpg";
  return (
    <div className=" relative  flex items-center justify-center">
      <DirectionAwareHover imageUrl={imageUrl}>
       
      </DirectionAwareHover>
    </div>
  );
}
