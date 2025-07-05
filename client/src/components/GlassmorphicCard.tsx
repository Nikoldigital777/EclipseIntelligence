import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  borderColor?: "blue" | "red" | "gold" | "green" | "eclipse";
}

export default function GlassmorphicCard({
  children,
  className,
  hover = true,
  borderColor,
}: GlassmorphicCardProps) {
  const getBorderStyles = () => {
    switch (borderColor) {
      case "blue":
        return "border-l-4 border-l-[hsl(var(--manifest-blue))]";
      case "red":
        return "border-l-4 border-l-[hsl(var(--remax-red))]";
      case "gold":
        return "border-l-4 border-l-[hsl(var(--gold-manifest))]";
      case "green":
        return "border-l-4 border-l-[hsl(var(--success-green))]";
      case "eclipse":
        return "border-l-4 border-l-[hsl(var(--eclipse-glow))]";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "glassmorphism rounded-xl p-6",
        hover && "hover-glow",
        getBorderStyles(),
        className
      )}
    >
      {children}
    </div>
  );
}
