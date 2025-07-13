"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../../../../layout/tenantHeader";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

interface Rental {
  property_id: number;
  lease_id:number;
  building_name: string;
  type: string;
  start_date: string;
  end_date: string;
  ownername: string;
  ownerphone: string;
}

export default function YourRentalsPage() {

  const router=useRouter();

  const [currentRentals, setCurrentRentals] = useState<Rental[]>([]);
  const [pastRentals, setPastRentals] = useState<Rental[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const Service = ["Plumbing", "Electrical", "Carpentry", "Pest Control"];
  const [currentservice, setcurrentservice] = useState<string | null>(null);
  
  const [current_index, setcurrent_index] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchRentals() {
      try {
        const token = localStorage.getItem('token');
          if (token) {
            try {
                const decodedToken = jwtDecode(token);
                var userId = decodedToken.userId;
                console.log("User ID:", userId);
            } catch (error) {
                console.error("Invalid token", error);
                setError("Invalid token");
            }
        }
        setLoading(true);
        const response = await fetch("/api/rentals", { method: 'GET' , headers:{'User_ID': userId}});
        const data = await response.json();
        console.log(data);
        setCurrentRentals(data.currentRentals);
        setPastRentals(data.pastRentals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    }

    fetchRentals();
  }, []);

  useEffect(()=>{
    console.log(currentRentals);
  }, [currentRentals]);

  const sendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem('token');
      if (token) {
        try {
            const decodedToken = jwtDecode(token);
            var userId = decodedToken.userId;
            console.log("User ID:", userId);
        } catch (error) {
            console.error("Invalid token", error);
        }
      }
      const leaseId = current_index !== null ? currentRentals[current_index]?.lease_id : undefined;
      if(!leaseId){
        throw new Error("No lease ID provided");
      }
      setLoading(true);
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'User_ID': userId
        },
        body: JSON.stringify({
          description,
          service: currentservice,
          lease_id:leaseId
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to raise maintenance ticket");
      }
      setLoading(false);
      router.push("/tenant/maintenance");
    }
    catch(error){
      console.error("Error raising maintenance ticket:", error);
    }
  };

  if(loading){
    return <Header>Loading...</Header>;
  }

  return (
    <Header>
      <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-900 text-center p-6">
          Your Rentals
        </h1>
        <h2 className="text-2xl font-semibold text-blue-900 p-4">Current Rentals</h2>
        <div className="flex flex-col gap-6">
          {currentRentals?.length?currentRentals.map((rental, index) => (
            <Card key={rental.lease_id} className="p-4 shadow-md rounded-lg">
              <CardContent>
                <CardTitle className="text-lg">Name: {rental.building_name}</CardTitle>
                <p className="text-blue-950">Type: {rental.type}</p>
                <p className="text-blue-950">Start date of lease: {rental.start_date}</p>
                <p className="text-blue-950">End date of lease: {rental.end_date}</p>
                <p className="text-blue-950">Owner Name: {rental.ownername}</p>
                <p className="text-blue-950">Owner Phone Number: {rental.ownerphone}</p>
                <div className="flex flex-col items-start gap-2 mt-4">
                  <Button className="w-fit px-4 py-2 text-sm" onClick={()=>{router.push(`/tenant/properties/${rental.property_id}`)}}>View Property</Button>
                  <Button className="w-fit px-4 py-2 text-sm" onClick={()=>{router.push(`/tenant/payment/${rental.lease_id}`)}}>Pay Rent</Button>
                  <Button
                    className="w-fit px-4 py-2 text-sm bg-green-700 hover:bg-green-700 text-white"
                    onClick={() => setcurrent_index(index === current_index ? null : index)}
                  >
                    Raise a maintenance ticket
                  </Button>
                </div>
                {current_index === index && (
                  <form onSubmit={sendRequest} className="mt-4 p-4 border rounded-lg bg-gray-100">
                    <label className="block text-gray-700 mb-2">
                      Describe the issue (max: 300 characters):
                    </label>
                    <Input
                      type="text"
                      placeholder=""
                      className="w-full p-2 border rounded-md"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <label className="block text-gray-700 mb-2 mt-4">
                      Select type of service:
                    </label>
                    <div className="flex flex-col gap-2">
                      {Service.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <input
                            type="radio"
                            name="service"
                            value={service}
                            checked={currentservice === service}
                            onChange={(e) => setcurrentservice(e.target.value)}
                            className="w-4 h-4"
                          />
                          {service}
                        </label>
                      ))}
                    </div>

                    <Button
                      type="submit"
                      className="mt-2 bg-blue-800 text-white"
                      onClick={sendRequest}
                    >
                      Submit Request
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )):<Card>No ongoing rentals</Card>}
        </div>
        <h2 className="text-2xl font-semibold text-blue-900 p-4">Past Rentals</h2>
        <div className="flex flex-col gap-6">
          {pastRentals.length?pastRentals.map((rental) => (
            <Card key={rental.building_name} className="p-4 shadow-md rounded-lg">
              <CardContent>
                <CardTitle className="text-lg">Address: {rental.building_name}</CardTitle>
                <p className="text-blue-950">Type: {rental.type}</p>
                <p className="text-blue-950">Start date of lease: {rental.start_date}</p>
                <p className="text-blue-950">End date of lease: {rental.end_date}</p>
                <p className="text-blue-950">Owner Name: {rental.ownername}</p>
                <p className="text-blue-950">Owner Phone Number: {rental.ownerphone}</p>
                <div className="flex flex-col items-start gap-2 mt-4">
                  <Button className="w-fit px-4 py-2 text-sm">View Property</Button>
                </div>
              </CardContent>
            </Card>
          )):<Card>No past rentals</Card>}
        </div>
      </div>
    </Header>
  );
}
