import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-20 py-10 bg-white shadow-sm" style={{ backgroundColor: '#80D6FF' }}>
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
      <section className="relative overflow-hidden min-h-[70vh]" style={{ backgroundColor: '#80D6FF' }}>
        <div className="mx-auto px-40 py-40 flex flex-col items-center text-center md:text-left md:flex-row md:justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 z-50">
            <h1 className="text-4xl font-bold mb-4">
              Discover your <span className="text-blue-600">dream property</span>
            </h1>
            <p className="text-gray-700 mb-6">
              Rent or buy properties easily with RentRight.
            </p>
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Select>
                  <SelectTrigger className="w-full md:w-auto">
                    <SelectValue placeholder="BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                  </SelectContent>
                </Select>

                <Input placeholder="City" />

                <Select>
                  <SelectTrigger className="w-full md:w-auto">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full md:w-auto" variant="default">
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-7/10 h-[60vh]">
            <Image
              src="/house.svg"
              alt="House Illustration"
              fill
              className="md:object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto px-6 py-16 text-white w-full" style={{ backgroundColor: '#002F63' }}>
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="rounded-lg shadow-md p-6 text-center m-6"  style={{ backgroundColor: '#BFEAFF' }}>
            <div className="text-blue-600 mb-4 ">
              <Image className="mx-auto" src="/search.svg" alt="Homes" width={60} height={60} />
            </div>
            <h3 className="font-semibold mb-2 text-blue-600">Find your future home</h3>
            <p className="text-gray-600">
              We help you find a new home by offering a smart real estate experience.
            </p>
          </div>

          <div className="rounded-lg shadow-md p-6 text-center m-6"  style={{ backgroundColor: '#BFEAFF' }}>
            <div className="text-blue-600 mb-4">
              <Image className="mx-auto" src="/repair.svg" alt="Homes" width={60} height={60} />
            </div>
            <h3 className="font-semibold mb-2 text-blue-600">Experienced staff</h3>
            <p className="text-gray-600">
              Find experienced staff to resolve your maintenance woes.
            </p>
          </div>

          <div className="rounded-lg shadow-md p-6 text-center m-6" style={{ backgroundColor: '#BFEAFF' }}>
            <div className="text-blue-600 mb-4">
              <Image className="mx-auto" src="/property.svg" alt="Homes" width={60} height={60} />
            </div>
            <h3 className="font-semibold mb-2 text-blue-600">Buy or rent homes</h3>
            <p className="text-gray-600">
              Millions of houses and apartments from the industry’s leading marketplace.
            </p>
          </div>

          <div className="rounded-lg shadow-md p-6 text-center m-6" style={{ backgroundColor: '#BFEAFF' }}>
            <div className="text-blue-600 mb-4">
              <Image className="mx-auto" src="/listing.svg" alt="Homes" width={60} height={60} />
            </div>
            <h3 className="font-semibold mb-2 text-blue-600">List your own property</h3>
            <p className="text-gray-600">
              Generate more leads by listing your property on our website.
            </p>
          </div>
        </div>
      </section>
      <footer className="px-6 py-4 text-center bg-white shadow-inner">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} RentRight. All rights reserved.
        </p>
      </footer>
    </div>
  );
}