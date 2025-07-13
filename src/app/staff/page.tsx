"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function StaffRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);  // Store the fetched staff requests
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (token) {
          try {
            const decodedToken = jwtDecode<any>(token);
            var userId = decodedToken.userId;
            console.log("User ID:", userId);

            const response = await fetch("/api/maintenance", {
              method: "GET",
              headers: {
                "User_ID": userId,
              },
            });
          }catch (error) {
            console.error("Invalid token", error);
          }
        }
        const response = await fetch("/api/maintenance", {
          method: "GET",
          headers: {
            "User_ID": userId,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch maintenance requests');
        }

        const data = await response.json();
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.request_id === data.request_id
              ? { ...request, status: data.status }
              : request
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(()=>{
    console.log(requests)
  }, [requests])

  const handleStatusChange = async (status: string, requestId: number) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
  
        const statusResponse = await fetch("/api/maintenance", {
          method: "PATCH",
          headers: {
            "User_ID": userId
          },
          body: JSON.stringify({request_id: requestId, newStatus:status})
        });
        const NewStatus = await statusResponse.json();
      } catch (error) {
        console.error("Error fetching staff members:", error);
      }
    };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Sheet>
        <SheetTrigger className="p-4">
          <Menu size={30} />
        </SheetTrigger>
        <SheetContent side="left" className="p-6 w-70 bg-gray-100">
         <SheetTitle className="text-center">Rent Right</SheetTitle>
                 <div className="flex justify-center">
                   <Image src="/logo.svg" alt="Profile Pic" width={80} height={80} className="rounded-full" />
                 </div>
          <nav className="flex flex-col gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/staff/maintenance")}
              className="text-2xl bg-blue-100 mb-4 mt-8 hover:bg-blue-700:tsx"
            >
              All Requests
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/staff/profile")}
              className="text-2xl bg-blue-100 my-4"
            >
              Profile
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/staff/profile")}
              className="text-2xl bg-blue-100 my-4"
            >
              Logout
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">

      <h1 className="text-3xl font-bold text-blue-900 text-center p-6">
        Maintenance Requests
      </h1>

      <div className="flex flex-col gap-6">
        {requests.map((request, index) => (
          <Card key={index} className="p-4 shadow-md rounded-lg">
            <CardContent>
              <CardTitle className="text-lg">Property: {request.building_name}</CardTitle>
              <p className="text-gray-900 my-2">Service: {request.service}</p>
              <p className="text-gray-900 my-2">Description: {request.description}</p>
              <p className="text-gray-900 my-2">Created at: {new Date(request.created_at).toLocaleString()}</p>
              <div className="mt-4">
                <p><strong>Tenant Name:</strong> {request.tenantname}</p>
                <p><strong>Tenant Phone:</strong> {request.tenantnumber}</p>
                <p><strong>Owner Name:</strong> {request.ownername}</p>
                <p><strong>Owner Phone:</strong> {request.ownerphone}</p>
              </div>
              <p className="text-green-700 font-semibold bg-green-100 p-2 rounded-md">
                Status: {request.status}
              </p>
              {
                request.status==='Assigned' && <Button className="w-fit px-4 py-2 text-sm" onClick={()=>{handleStatusChange('In progress', request.request_id)}}>Mark as Ongoing</Button>
              }
              {
                request.status==='In progress' && <Button className="w-fit px-4 py-2 text-sm" onClick={()=>{handleStatusChange('Resolved', request.request_id)}}>Mark as Resolved</Button>
              }
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}
