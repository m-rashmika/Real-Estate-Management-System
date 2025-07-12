"use client"

import "../src/app/globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata:Metadata = {
  title: "RentRight",
  description: "Discover your dream property",
};

export default function tenantHeader({ children }: { children: React.ReactNode }){
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="RentRight Logo" width={40} height={40} />
          <div className="text-xl font-bold">RentRight</div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/tenant" className="hover:text-blue-600">Home</Link>
          <Link href="/tenant/properties" className="hover:text-blue-600">Properties</Link>
          <Link href="/tenant/maintenance" className="hover:text-blue-600">Service</Link>
          <Link href="/tenant/rentals" className="hover:text-blue-600">Rentals</Link>
          <Link href="/tenant/enquiries" className="hover:text-blue-600">Enquiries</Link>
          <Link href="/tenant/profile" className="hover:text-blue-600">Profile</Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            Log out
          </button>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="px-6 py-4 text-center bg-white shadow-inner">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} RentRight. All rights reserved.
        </p>
      </footer>
    </>
  );
}