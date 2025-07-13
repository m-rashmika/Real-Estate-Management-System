"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPlug, FaWrench, FaHammer, FaBug } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const services = [
  { name: "Electrical Repairs", icon: <FaPlug />, description: "Safe and reliable electrical solutions." },
  { name: "Plumbing Services", icon: <FaWrench />, description: "Fix leaks and plumbing issues efficiently." },
  { name: "Carpentry Work", icon: <FaHammer />, description: "Expert woodwork and repairs." },
  { name: "Pest Control", icon: <FaBug />, description: "Keep your home pest-free and healthy." },
];

export default function ServicesPage() {
    const router = useRouter();

  return (
      <div className="p-8 bg-blue-100 min-h-screen">
        <header className="flex items-center justify-between px-20 py-10 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="RentRight Logo" width={40} height={40} />
            <div className="text-xl font-bold">RentRight</div>
          </div>
          <nav className="flex items-center gap-10 px-7">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/properties" className="hover:text-blue-600">
              Properties
            </Link>
            <Link href="/services" className="hover:text-blue-600">
              Service
            </Link>
          </nav>
          <nav className="flex items-center gap-10">
            <Link href="/auth/login" className="hover:text-blue-600">
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Sign up
            </Link>
          </nav>
        </header>

        <h1 className="text-3xl font-bold text-blue-900 text-center p-10">Our Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 px-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="p-6 shadow-lg rounded-lg bg-white transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <CardContent className="flex flex-col items-center text-center">
                <div className="text-5xl text-blue-700 mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800">{service.name}</CardTitle>
                <p className="text-blue-900 mt-2">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-blue-900 p-10">
          At RentRight, we are committed to making your rental experience as seamless and stress-free as possible.<br />
          We connect you with skilled professionals—whether you need a plumber, electrician, carpenter, or pest control expert.<br />
          Say goodbye to the frustration of waiting weeks for unresolved issues.<br />
          With RentRight, help is just a request away!<br />
          Your comfort is our priority. Let us take care of the details while you enjoy a hassle-free living experience.
        </p>

        <p className="text-center text-blue-700 mb-10">
          Reliable home maintenance solutions at your service.
        </p>

        <div className="text-center mt-8">
          <Button
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-500 transition-all"
            onClick={() => router.push("/auth/login")}
          >
            Book a Service
          </Button>
        </div>
      </div>
  );
}
