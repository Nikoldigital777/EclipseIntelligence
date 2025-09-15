import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CosmicButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "remax" | "eclipse";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function CosmicButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled,
}: CosmicButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(var(--manifest-blue))] hover:from-[hsl(var(--primary-blue))]/90 hover:to-[hsl(var(--manifest-blue))]/90 text-white lunar-shadow hover-glow border border-[hsl(var(--primary-blue))]/30";
      case "secondary":
        return "bg-gradient-to-r from-[hsl(var(--lunar-mist))] to-[hsl(var(--soft-gray))] hover:from-[hsl(var(--lunar-mist))]/90 hover:to-[hsl(var(--soft-gray))]/90 text-white lunar-shadow hover-glow border border-[hsl(var(--lunar-mist))]/30";
      case "accent":
        return "bg-gradient-to-r from-[hsl(var(--accent-gold))] to-[hsl(var(--gold-manifest))] hover:from-[hsl(var(--accent-gold))]/90 hover:to-[hsl(var(--gold-manifest))]/90 text-black accent-shadow accent-glow border border-[hsl(var(--accent-gold))]/40";
      case "remax":
        return "bg-gradient-to-r from-[hsl(var(--remax-red))] to-[#c73650] hover:from-[hsl(var(--remax-red))]/90 hover:to-[#c73650]/90 text-white remax-shadow remax-glow border border-[hsl(var(--remax-red))]/30";
      case "eclipse":
        return "bg-gradient-to-r from-[hsl(var(--eclipse-glow))] to-[#4dd8ff] hover:from-[hsl(var(--eclipse-glow))]/90 hover:to-[#4dd8ff]/90 text-black eclipse-shadow hover-glow border border-[hsl(var(--eclipse-glow))]/40";
      default:
        return "bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(var(--manifest-blue))] hover:from-[hsl(var(--primary-blue))]/90 hover:to-[hsl(var(--manifest-blue))]/90 text-white lunar-shadow hover-glow border border-[hsl(var(--primary-blue))]/30";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full font-semibold smooth-transition relative overflow-hidden group shadow-lg",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/25 before:via-white/15 before:to-white/25 before:opacity-0 group-hover:before:opacity-100",
        "after:absolute after:inset-0 after:rounded-full after:border after:border-white/20",
        "active:scale-95 hover:scale-[1.02] hover:shadow-xl",
        getVariantStyles(),
        getSizeStyles(),
        className
      )}
    >
      <span className="relative z-10 font-medium">{children}</span>
    </Button>
  );
}
