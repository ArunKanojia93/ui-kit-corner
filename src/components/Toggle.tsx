"use client";

export const Toggle = () => {
  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle("dark");
      }}
      className="absolute left-0 top-0 z-[99999] rounded-full bg-foreground text-background w-3 h-3"
    ></button>
  );
};
