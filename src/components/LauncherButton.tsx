import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function LauncherButton({ children, icon, variant = "secondary", className = "", ...props }: Props) {
  const styles = {
    primary: "bg-white text-black hover:bg-white/88",
    secondary: "bg-white text-black hover:bg-white/88",
    ghost: "bg-white text-black hover:bg-white/88"
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-white/25 ${styles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
