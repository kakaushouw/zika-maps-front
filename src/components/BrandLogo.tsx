import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "h-7 w-auto max-w-[88px]",
  sm: "h-9 w-auto max-w-[110px]",
  md: "h-12 w-auto max-w-[140px]",
  lg: "w-48 h-48",
  xl: "w-56 h-56",
} as const;

export type BrandLogoSize = keyof typeof sizeClasses;

type BrandLogoProps = {
  size?: BrandLogoSize;
  className?: string;
};

/** Logo oficial do ZikaMaps (src/assets/logo.png) */
export function BrandLogo({ size = "md", className }: BrandLogoProps) {
  return (
    <img
      src={logo}
      alt="ZikaMaps — monitoramento de arbovírus"
      className={cn("object-contain shrink-0", sizeClasses[size], className)}
    />
  );
}

export default BrandLogo;
