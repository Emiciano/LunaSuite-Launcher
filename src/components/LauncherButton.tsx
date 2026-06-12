import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function LauncherButton({ children, icon, variant = "secondary", className = "", ...props }: Props) {
  const styles = {
    primary: "border-white bg-white text-black hover:bg-white/88",
    secondary: "border-white/12 bg-white/[0.055] text-white hover:bg-white/[0.09]",
    ghost: "border-transparent bg-transparent text-white/60 hover:bg-white/[0.055] hover:text-white"
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:border-white/[0.05] disabled:bg-white/[0.025] disabled:text-white/25 ${styles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
