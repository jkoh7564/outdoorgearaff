import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5ef] px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-5 block text-xl font-bold">
          OutdoorGearAff
        </Link>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
