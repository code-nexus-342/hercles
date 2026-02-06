"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   MINIMALIST UI PRIMITIVES
   Clean, elegant, purposeful components
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "flat" | "outline";
    hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>((
    { className, variant = "default", hover = true, children, ...props }, ref
) => {
    const variants = {
        default: "bg-white border border-[#E5E5E5] rounded-xl",
        elevated: "bg-white rounded-xl shadow-sm",
        flat: "bg-[#F5F5F5] rounded-xl",
        outline: "bg-transparent border border-[#E5E5E5] rounded-xl",
    };

    return (
        <div
            ref={ref}
            className={cn(
                variants[variant],
                hover && "transition-all duration-250 hover:shadow-md hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
Card.displayName = "Card";

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "accent";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
    { className, variant = "primary", size = "md", children, ...props }, ref
) => {
    const variants = {
        primary: "bg-[#171717] text-white hover:bg-[#404040]",
        secondary: "bg-transparent text-[#171717] border border-[#E5E5E5] hover:bg-[#F5F5F5] hover:border-[#D4D4D4]",
        ghost: "bg-transparent text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5]",
        accent: "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});
Button.displayName = "Button";

// ─────────────────────────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────────────────────────

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "accent" | "success" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>((
    { className, variant = "default", children, ...props }, ref
) => {
    const variants = {
        default: "bg-[#F5F5F5] text-[#525252]",
        accent: "bg-[#DBEAFE] text-[#2563EB]",
        success: "bg-[#DCFCE7] text-[#15803D]",
        outline: "bg-transparent border border-[#E5E5E5] text-[#525252]",
    };

    return (
        <span
            ref={ref}
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
});
Badge.displayName = "Badge";

// ─────────────────────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────────────────────

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>((
    { className, ...props }, ref
) => {
    return (
        <input
            ref={ref}
            className={cn(
                "w-full px-4 py-3 text-[15px] bg-white text-[#171717] border border-[#E5E5E5] rounded-lg",
                "transition-all duration-150",
                "hover:border-[#D4D4D4]",
                "focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#DBEAFE]",
                "placeholder:text-[#A3A3A3]",
                className
            )}
            {...props}
        />
    );
});
Input.displayName = "Input";

// ─────────────────────────────────────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────────────────────────────────────

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((
    { className, ...props }, ref
) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                "w-full px-4 py-3 text-[15px] bg-white text-[#171717] border border-[#E5E5E5] rounded-lg resize-none",
                "transition-all duration-150",
                "hover:border-[#D4D4D4]",
                "focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#DBEAFE]",
                "placeholder:text-[#A3A3A3]",
                className
            )}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────────────────────────────────────

type DividerProps = React.HTMLAttributes<HTMLHRElement>;

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>((
    { className, ...props }, ref
) => {
    return (
        <hr
            ref={ref}
            className={cn("h-px bg-[#E5E5E5] border-none", className)}
            {...props}
        />
    );
});
Divider.displayName = "Divider";

// ═══════════════════════════════════════════════════════════════════════════
// LEGACY COMPATIBILITY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Map old Neo Brutalist / Glass components to new minimalist ones
export const BrutalCard = Card;
export const BrutalButton = Button;
export const BrutalBadge = Badge;
export const BrutalInput = Input;

type GlassIntensity = "low" | "medium" | "high";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    intensity?: GlassIntensity;
}

export const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
    ({ className, intensity = "low", children, ...props }, ref) => {
        const intensityClasses: Record<GlassIntensity, string> = {
            low: "bg-white/5 border border-white/10 backdrop-blur-md",
            medium: "bg-white/10 border border-white/15 backdrop-blur-md",
            high: "bg-white/15 border border-white/20 backdrop-blur-lg",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl",
                    intensityClasses[intensity],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
GlassContainer.displayName = "GlassContainer";

// AccentBlock becomes a subtle decorative element
export const AccentBlock = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
    { className, ...props }, ref
) => {
    return (
        <div
            ref={ref}
            className={cn(
                "absolute w-64 h-64 bg-gradient-to-br from-[#DBEAFE] to-transparent rounded-full blur-3xl opacity-50 -z-10",
                className
            )}
            {...props}
        />
    );
});
AccentBlock.displayName = "AccentBlock";

export const LiquidOrb = AccentBlock;
