import { ButtonHTMLAttributes } from "react";

export type ButtonAppearanceType = "primary" | "flat" | "rounded";
export type ButtonSizeType = "medium" | "large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearanceType;
  size?: ButtonSizeType;
}

const Appearances = {
  primary: "border shadow-lg rounded-lg",
  flat: "rounded-lg",
  rounded: "w-10 h-10 rounded-full flex justify-center items-center",
};

const Size = {
  medium: "text-lg leading-5 px-2 py-1.5",
  large: "text-2xl leading-6 px-3 py-3",
};

export default function Button({
  appearance = "primary",
  size = "medium",
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
      className={`font-medium ${Size[size]} ${Appearances[appearance]} disabled:text-gray-400 disabled:bg-black/5 hover:bg-black/5 focus:bg-black/5 active:bg-black/10 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
