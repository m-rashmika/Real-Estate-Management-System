"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import Header from "../../../../layout/adminHeader";

export default function AdminEnquiriesPage() {
  interface Enquiry {
    enquiry_id: string;
    building_name: string;
    description: string;
    property_id: string;
    approval: string;
  }

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<{ [enquiryIndex: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        try {
            const decodedToken = jwtDecode(token);
            var userId = decodedToken.userId;
            console.log("User ID:", userId);
        } catch (error) {
            console.error("Invalid token", error);
        }
        const response = await fetch("/api/enquiry", {
          method: "GET",
          headers: {
            "User_ID": userId,
          },
        });
        const data = await response.json();
        setEnquiries(data.enquiries);
        const initialApprovalStatus: { [key: number]: string } = {};
        data.enquiries.forEach((enquiry: Enquiry, index: number) => {
          initialApprovalStatus[index] = enquiry.approval || "Pending";
        });
        setApprovalStatus(initialApprovalStatus);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };
    fetchEnquiries();
  }, []);

  useEffect(() => {
    console.log(enquiries);
  }, [enquiries]);

  useEffect(()=>{
    console.log(approvalStatus);
  }, [approvalStatus]);

  const [finalTenant, setFinalTenant] = useState<{ [propertyIndex: number]: string }>({});

  const handleApproval = async (enquiryIndex: number, status: string) => {
    const enquiryId = enquiries[enquiryIndex].enquiry_id;
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        try {
            const decodedToken = jwtDecode(token);
            var userId = decodedToken.userId;
            console.log("User ID:", userId);
        } catch (error) {
            console.error("Invalid token", error);
        }
      const response = await fetch(`/api/enquiry`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, enquiryId, newStatus: status }),
      });

      if (response.ok) {
        setApprovalStatus((prev) => ({
          ...prev,
          [enquiryIndex]: status,
        }));
      } else {
        console.error("Failed to update approval status");
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>,propertyIndex:number) => {
    setFinalTenant((prev) => ({
        ...prev,
        [propertyIndex]: e.target.value,
      }));  };

    return (
      <Header>
              <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">
          <h1 className="text-3xl font-bold text-blue-900 text-center p-6">
            Enquiry Requests
          </h1>
          <div className="flex flex-col gap-6">
            {enquiries.map((enquiry, index) => (
              <Card key={enquiry.enquiry_id} className="p-4 shadow-md rounded-lg">
                <CardTitle>Property: {enquiry.building_name}</CardTitle>
                <CardContent>
                  <Button
                    className="w-fit px-4 py-2 text-sm my-4 bg-blue-900"
                    onClick={() => router.push(`/admin/properties/${enquiry.property_id}`)}
                  >
                    View Property
                  </Button>

                  <p>
                    <strong>Enquiry Description:</strong> {enquiry.description}
                  </p>

                  {approvalStatus[index]==='Pending' && <div className="flex gap-4 mt-2">
                    <Button
                      className="px-4 py-2 bg-green-800"
                      onClick={() => handleApproval(index, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      className="px-4 py-2 bg-red-800"
                      onClick={() => handleApproval(index, "Declined")}
                    >
                      Reject
                    </Button>
                  </div>
                  }

                  <p className="mt-2">
                    <strong>Approval Status:</strong> {approvalStatus[index] || "Pending"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Header>
    );
  }
