"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface PremiumButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "ghost" | "glass";
    size?: "sm" | "md" | "lg";
    children?: React.ReactNode;
}

export function PremiumButton({
    className,
    variant = "primary",
    size = "md",
    children,
    ...props
}: PremiumButtonProps) {
    const baseStyles =
        "relative inline-flex items-center justify-center overflow-hidden font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-app-black text-app-white border border-surface-300 hover:border-accent-silver/50 hover:bg-surface-100 shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.06)]",
        secondary:
            "bg-surface-100 text-text-primary border border-surface-200 hover:bg-surface-200 hover:border-surface-300",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-100",
        glass:
            "bg-surface-100/30 backdrop-blur-md border border-white/10 text-text-primary hover:bg-surface-100/50 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-8 py-4 text-lg font-semibold tracking-wide",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {/* Subtle Shimmer effect inside primary button */}
            {variant === "primary" && (
                <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
            )}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
}
