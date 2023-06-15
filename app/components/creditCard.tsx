import { HTMLAttributes } from "react";

interface CreditCardProps extends HTMLAttributes<HTMLDivElement> {}

export default function CreditCard({ children, ...rest }: CreditCardProps) {
  return (
    <div
      {...rest}
      className="w-[18.75rem] h-[11.8125rem] rounded-lg border shadow-lg p-4 flex flex-col justify-between items-start bg-gradient-to-br from-slate-200 to-slate-500 text-black"
    >
      {children}
    </div>
  );
}
