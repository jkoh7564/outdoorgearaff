import Link from "next/link";

export function AdminNav() {
  return (
    <header className="border-b border-[#d9d4c7] bg-[#fffdf7]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-xl font-bold">OutdoorGearAff</Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-[#425047]">
          <Link href="/">Site</Link>
          <Link href="/admin/posts">Posts</Link>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/posts/new" className="bg-[#176b4d] px-4 py-2 text-white">New</Link>
        </nav>
      </div>
    </header>
  );
}
