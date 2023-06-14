import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata = {
  title: "Control de tarjetas de crédito",
  description: "",
};

const nav_links = [
  {
    href: "/",
    children: "Inicio",
    imageIconSrc: "/assets/icons/home_white_fill.svg",
    imageIconAlt: "Icono de casa",
  },
  {
    href: "/tarjetas",
    children: "Tarjetas",
    imageIconSrc: "/assets/icons/bank_card_white_fill.svg",
    imageIconAlt: "Icono de tarjetas de crédito",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen">
        <aside className="bg-slate-800 text-white p-4 flex flex-col gap-8">
          <div className="flex gap-2">
            <Image
              src="/assets/icons/bank_card_white_fill.svg"
              alt="Icono de tarjetas de crédito"
              width={48}
              height={48}
            />
            <span className="font-medium text-lg leading-5">
              Credit Card Manager
            </span>
          </div>

          <nav className="grid gap-2">
            {nav_links.map((navLink) => (
              <Link
                key={navLink.children}
                href={navLink.href}
                className="hover:bg-white/10 focus:bg-white/10 active:bg-white/30 py-3 px-4 rounded-lg flex items-center gap-4"
              >
                <span className="w-6 h-6 block">
                  <Image
                    src={navLink.imageIconSrc}
                    alt={navLink.imageIconAlt}
                    width={24}
                    height={24}
                  />
                </span>
                <span className="font-medium text-lg leading-5">
                  {navLink.children}
                </span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
