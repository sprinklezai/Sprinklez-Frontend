import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const baseClasses =
    "rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary:
      "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}

export default Button;