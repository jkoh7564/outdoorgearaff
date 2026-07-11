"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

const groups = [
  {
    label: "Content",
    links: [
      { href: "/admin/posts", label: "Posts" },
      { href: "/admin/calendar", label: "Calendar" },
      { href: "/admin/posts/new", label: "New post", emphasis: true },
    ],
  },
  {
    label: "Performance",
    links: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/revenue", label: "Revenue" },
    ],
  },
  {
    label: "Audience",
    links: [
      { href: "/admin/subscribers", label: "Newsletter" },
      { href: "/", label: "Public site" },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-6 text-sm font-bold">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#7b857d]">
            {group.label}
          </p>
          <div className="grid gap-2">
            {group.links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : link.href === "/admin/posts"
                    ? pathname === "/admin/posts" ||
                      (pathname.startsWith("/admin/posts/") && pathname !== "/admin/posts/new")
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={[
                    "flex min-h-11 items-center justify-between border px-4 py-3 transition",
                    active
                      ? "border-[#176b4d] bg-[#176b4d] text-white"
                      : link.emphasis
                        ? "border-[#176b4d] bg-[#edf7f1] text-[#176b4d] hover:bg-[#dff0e7]"
                        : "border-transparent text-[#425047] hover:border-[#d9d4c7] hover:bg-[#f7f5ef]",
                  ].join(" ")}
                >
                  {link.label}
                  {link.emphasis ? <span className="text-lg leading-none">+</span> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminNav({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-[#d9d4c7] bg-[#fffdf7] px-5 py-6 lg:block">
        <Link href="/" className="block text-xl font-bold">
          OutdoorGearAff
        </Link>
        <p className="mt-2 text-sm leading-6 text-[#66736a]">
          Editorial studio for gear content, analytics, and growth.
        </p>
        <div className="mt-8">
          <NavLinks />
        </div>
        <button
          type="button"
          onClick={signOut}
          className="mt-8 flex min-h-11 w-full items-center border border-[#c9c2b4] px-4 py-3 text-sm font-bold text-[#425047] hover:bg-[#f7f5ef]"
        >
          Sign out
        </button>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-[#d9d4c7] bg-[#fffdf7] lg:hidden">
          <div className="flex min-h-16 items-center justify-between px-4">
            <Link href="/" className="text-lg font-bold">
              OutdoorGearAff
            </Link>
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center border border-[#c9c2b4] bg-white"
            >
              <span className="grid w-5 gap-1">
                <span className="h-0.5 bg-[#1d2520]" />
                <span className="h-0.5 bg-[#1d2520]" />
                <span className="h-0.5 bg-[#1d2520]" />
              </span>
            </button>
          </div>
        </header>

        {menuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation menu"
              className="absolute inset-0 bg-black/35"
              onClick={() => setMenuOpen(false)}
            />
            <aside className="relative h-full w-[min(20rem,85vw)] border-r border-[#d9d4c7] bg-[#fffdf7] p-5 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="text-lg font-bold" onClick={() => setMenuOpen(false)}>
                  OutdoorGearAff
                </Link>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMenuOpen(false)}
                  className="grid h-10 w-10 place-items-center border border-[#c9c2b4] bg-white text-xl leading-none"
                >
                  x
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#66736a]">
                Editorial studio for gear content, analytics, and growth.
              </p>
              <div className="mt-8">
                <NavLinks onNavigate={() => setMenuOpen(false)} />
              </div>
              <button
                type="button"
                onClick={signOut}
                className="mt-8 flex min-h-11 w-full items-center border border-[#c9c2b4] px-4 py-3 text-sm font-bold text-[#425047]"
              >
                Sign out
              </button>
            </aside>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
