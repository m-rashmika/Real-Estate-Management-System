"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, {useState, useEffect} from "react";
import { Button } from "@/components/ui/button";
import Header from "../../../../layout/tenantHeader";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

export default function TenantEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const router=useRouter();

  useEffect(() => {
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
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('/api/enquiry', {
          method: "GET",
          headers: {
              "User_ID": userId,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch enquiries");
        }
        const data = await response.json();
        setEnquiries(data.enquiries);
        } catch (error) {
          console.error("Error fetching enquiries:", error);
        }
    };
    fetchEnquiries();
  }, []);

  return (
    <Header>
<div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">
<h1 className="text-3xl font-bold text-blue-900 text-center p-6">
        Enquiry Requests
      </h1>
      <div className="flex flex-col gap-6">
        {enquiries.length === 0 ? (
          <p className="text-center">No enquiries found.</p>
        ) : (
          enquiries.map((enquiry, index) => (
            <Card key={index} className="p-4 shadow-md rounded-lg">
              <CardTitle>
                Building name: {enquiry.building_name}
              </CardTitle>
              <CardContent>
                <Button className="w-fit px-4 py-2 text-sm my-4 bg-green-700" onClick={() => router.push(`/tenant/properties/${enquiry.property_id}`)}>
                  View Property
                </Button>
                <p>Approval status: {enquiry.approval}</p>
                {enquiry.approval === "Approved" && (
                  <div>
                    <p>Owner Name: {enquiry.ownername}</p>
                    <p>Owner Phone Number: {enquiry.ownerphone}</p>
                    <p>Owner Email ID: {enquiry.owneremail}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
    </Header>
  );
}