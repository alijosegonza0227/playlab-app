import { cn } from "@/lib/utils";

const LETTERS: { char: string; className: string }[] = [
  { char: "P", className: "text-rainbow-purple" },
  { char: "l", className: "text-foreground" },
  { char: "a", className: "text-rainbow-green" },
  { char: "y", className: "text-rainbow-yellow" },
  { char: "L", className: "text-rainbow-orange" },
  { char: "a", className: "text-rainbow-coral" },
  { char: "b", className: "text-rainbow-purple" },
];

/**
 * Recreación tipográfica del logo de Play Lab (letras burbuja multicolor) mientras
 * no tengamos el archivo de logo real (PNG/SVG) para usarlo tal cual.
 */
export function PlayLabLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "text-5xl sm:text-6xl" : size === "sm" ? "text-xl" : "text-2xl";

  return (
    <span className={cn("font-display inline-flex font-extrabold tracking-tight", sizeClass, className)}>
      {LETTERS.map((letter, i) => (
        <span key={i} className={letter.className} style={{ WebkitTextStroke: "0.5px rgba(0,0,0,0.08)" }}>
          {letter.char}
        </span>
      ))}
    </span>
  );
}
