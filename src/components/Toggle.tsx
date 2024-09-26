"use client";

export const Toggle = () => {
  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle("dark");
      }}
      className="absolute left-0 top-0 z-auto rounded-full bg-foreground text-background w-10 h-10"
    >
      T
    </button>
  );
};
