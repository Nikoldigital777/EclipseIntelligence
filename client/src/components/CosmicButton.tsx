
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CosmicButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "remax" | "eclipse" | "nebula" | "quantum";
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
        return "bg-gradient-to-r from-[#2E3A59] to-[#4A4E69] hover:from-[#2E3A59]/90 hover:to-[#4A4E69]/90 text-[#E8E9F3] border border-[#B8BCC8]/30 shadow-lg shadow-[#2E3A59]/20";
      case "secondary":
        return "bg-gradient-to-r from-[#4A4E69] to-[#B8BCC8] hover:from-[#4A4E69]/90 hover:to-[#B8BCC8]/90 text-[#E8E9F3] border border-[#E8E9F3]/20 shadow-lg shadow-[#4A4E69]/20";
      case "accent":
        return "bg-gradient-to-r from-[#D4AF37] to-[#f4d03f] hover:from-[#D4AF37]/90 hover:to-[#f4d03f]/90 text-[#1A1B26] border border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/25 font-semibold";
      case "remax":
        return "bg-gradient-to-r from-[hsl(var(--remax-red))] to-[#c73650] hover:from-[hsl(var(--remax-red))]/90 hover:to-[#c73650]/90 text-white border border-[hsl(var(--remax-red))]/30 shadow-lg shadow-[hsl(var(--remax-red))]/20";
      case "eclipse":
        return "bg-gradient-to-r from-[#00D9FF] to-[#4dd8ff] hover:from-[#00D9FF]/90 hover:to-[#4dd8ff]/90 text-[#1A1B26] border border-[#00D9FF]/40 shadow-lg shadow-[#00D9FF]/25 font-semibold";
      case "nebula":
        return "bg-gradient-to-r from-[#6C63FF] to-[#8b7aff] hover:from-[#6C63FF]/90 hover:to-[#8b7aff]/90 text-white border border-[#6C63FF]/40 shadow-lg shadow-[#6C63FF]/25";
      case "quantum":
        return "bg-gradient-to-r from-[#2E3A59] to-[#1A1B26] hover:from-[#2E3A59]/80 hover:to-[#1A1B26]/80 text-[#E8E9F3] border border-[#E8E9F3]/20 shadow-lg shadow-[#2E3A59]/20";
      default:
        return "bg-gradient-to-r from-[#2E3A59] to-[#4A4E69] hover:from-[#2E3A59]/90 hover:to-[#4A4E69]/90 text-[#E8E9F3] border border-[#B8BCC8]/30 shadow-lg shadow-[#2E3A59]/20";
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
        "rounded-full font-medium smooth-transition relative overflow-hidden group",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#E8E9F3]/20 before:via-[#E8E9F3]/10 before:to-[#E8E9F3]/20 before:opacity-0 group-hover:before:opacity-100",
        "after:absolute after:inset-0 after:rounded-full after:border after:border-[#E8E9F3]/10",
        "active:scale-95 hover:scale-[1.02] hover:shadow-xl",
        "backdrop-blur-sm",
        getVariantStyles(),
        getSizeStyles(),
        className
      )}
    >
      <span className="relative z-10 font-medium">{children}</span>
    </Button>
  );
}
