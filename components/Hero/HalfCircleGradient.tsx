import { cn } from "@/lib/utils";

export default function HalfCircleGradient({ position }: { position: string }) {
  return (
    <div
      className={cn(
        "absolute left-1/2 transform -translate-x-1/2   blur-[200px] bg-no-repeat",
        {
          "-top-52 sm:-top-32 bg-gradient-to-b from-[#ffffff]/40 to-[#3672E3]/20 rounded-b-full h-[420px]":
            position === "top",
          "sm:-bottom-40 max-sm:-bottom-32 bg-gradient-to-t from-[#ffffff]/20 to-[#ffffff]/10 rounded-full size-[800px] max-sm:size-[700px] overflow-hidden":
            position === "bottom",
        }
      )}
    ></div>
  );
}
