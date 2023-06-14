import { ButtonHTMLAttributes } from "react";

export type ButtonAppearanceType = "primary" | "flat" | "rounded";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearanceType;
}

const Appearances = {
  primary: "border shadow-lg px-4 py-2",
  flat: "px-4 py-2",
  rounded: "w-10 h-10 rounded-full flex justify-center items-center",
};

export default function Button({
  appearance = "primary",
  className,
  children,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-lg leading-5 ${Appearances[appearance]} rounded-lg hover:bg-black/5 focus:bg-black/5 active:bg-black/10 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
