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
        return "bg-[hsl(var(--primary-blue))] hover:bg-[hsl(var(--primary-blue))]/80 text-white lunar-shadow hover-glow";
      case "secondary":
        return "bg-[hsl(var(--lunar-mist))] hover:bg-[hsl(var(--lunar-mist))]/80 text-white lunar-shadow hover-glow";
      case "accent":
        return "bg-[hsl(var(--accent-gold))] hover:bg-[hsl(var(--accent-gold))]/80 text-black accent-shadow accent-glow";
      case "remax":
        return "bg-[hsl(var(--remax-red))] hover:bg-[hsl(var(--remax-red))]/80 text-white remax-shadow remax-glow";
      case "eclipse":
        return "bg-[hsl(var(--eclipse-glow))] hover:bg-[hsl(var(--eclipse-glow))]/80 text-black eclipse-shadow hover-glow";
      default:
        return "bg-[hsl(var(--primary-blue))] hover:bg-[hsl(var(--primary-blue))]/80 text-white lunar-shadow hover-glow";
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
        "rounded-full font-semibold transition-all duration-300",
        getVariantStyles(),
        getSizeStyles(),
        className
      )}
    >
      {children}
    </Button>
  );
}
