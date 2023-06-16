import { HTMLAttributes } from "react";

interface CreditCardProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

export default function CreditCard({
  children,
  isLoading = false,
  ...rest
}: CreditCardProps) {
  return (
    <article
      {...rest}
      className={`w-[18.75rem] h-[11.8125rem] rounded-lg border shadow-lg p-4 flex flex-col justify-between items-start text-black ${
        isLoading
          ? "animate-pulse bg-slate-400"
          : "bg-gradient-to-br from-slate-200 to-slate-500"
      }`}
    >
      {children}
    </article>
  );
}
