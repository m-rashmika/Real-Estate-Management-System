"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import Header from "../../../../layout/adminHeader";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function ViewMaintenanceRequests() {
  const [Requests, setRequests] = useState<Request[]>([]);
  const [staffMembers, setStaffMembers] = useState<{ user_id: number; name: string; email: string; phone: string; service: string }[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<{ [key: number]: string }>({}); // Track selected staff by request_id
  const [showDropdowns, setShowDropdowns] = useState<{ [key: number]: boolean }>({}); // Track dropdown visibility by request_id

  interface Request {
    request_id: number;
    service: string;
    description: string;
    created_at: string;
    tenantname: string;
    tenantnumber: string;
    status: string;
    staffname: string;
    staffnumber:number;
    building_name:string;
  }
  const router=useRouter();

  useEffect(()=>{
    console.log(Requests)
  }, [Requests])

  useEffect(() => {
    const fetchRequestsAndStaff = async () => {
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

        const response = await fetch("/api/maintenance", {
          method: "GET",
          headers: {
            "User_ID": userId,
          },
        });
        const data = await response.json();
        setRequests(data.adminRequests);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      }
    };

    fetchRequestsAndStaff();
  }, []);

  useEffect(() => {
    console.log(staffMembers);
  }, [staffMembers]);

  const handleServiceChange = async (service: string, requestId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const staffResponse = await fetch("/api/staff", {
        method: "GET",
        headers: {
          "User_ID": userId,
          "Service": service,
        },
      });
      const staffData = await staffResponse.json();
      setStaffMembers(staffData.staffRows);
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  const handleAssignStaff = async (requestId: number) => {
    try {
      const selectedStaffId = selectedStaffIds[requestId];
      if (!selectedStaffId) {
        alert("Please select a staff member first.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await fetch(`/api/staff`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "User_ID": userId,
        },
        body: JSON.stringify({ staffId:selectedStaffId, requestId }),
      });

      const result = await response.json();
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.request_id === requestId
            ? { ...request, staffname: selectedStaffId, status: "Assigned" }
            : request
        )
      );
      setSelectedStaffIds((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
      setShowDropdowns((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    } catch (error) {
      console.error("Error assigning staff:", error);
    }
  };

  return (
    <Header>
            <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">

        <h1 className="text-3xl font-bold text-blue-900 text-center p-6">
          Your Maintenance Requests
        </h1>

        <div className="flex flex-col gap-6">
          {Requests.map((request) => (
            <Card key={request.request_id} className="p-4 shadow-md rounded-lg">
              <CardContent>
              <p className="text-black-950">Property: {request.building_name}</p>
                <p className="text-black-950">Service: {request.service}</p>
                <p className="text-black-950">
                  Description: {request.description}
                </p>
                <p className="text-black-950">
                  Request created at: {request.created_at}
                </p>

                <p className="text-black-950">
                  Tenant Name: {request.tenantname}
                </p>
                <p className="text-black-950">
                  Tenant Phone Number: {request.tenantnumber}
                </p>

                {request.status === "Pending" ? (
                  <div>
                    <p className="text-green-950 font-semibold bg-green-50">
                      Status: Pending
                    </p>
                    <div className="mt-4">
                      {!showDropdowns[request.request_id] &&(<button
                        onClick={() => {
                          setShowDropdowns((prev) => ({
                            ...prev,
                            [request.request_id]: true,
                          }));
                          handleServiceChange(request.service, request.request_id);
                        }}
                        className="p-2 bg-blue-500 text-white rounded-md w-full"
                      >
                        Select Staff Member
                      </button>)}

                      {showDropdowns[request.request_id] && (
                        <div className="mt-4">
                          <div className="w-full">
                            <Select
                              value={selectedStaffIds[request.request_id] || ""}
                              onValueChange={(value) => {
                                setSelectedStaffIds((prev) => ({
                                  ...prev,
                                  [request.request_id]: value,
                                }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Staff Member" />
                              </SelectTrigger>
                              <SelectContent>
                                {staffMembers.map((staff) => (
                                  <SelectItem key={staff.user_id} value={staff.user_id.toString()}>
                                    {staff.name} - {staff.service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedStaffIds[request.request_id] && (
                      <button
                        onClick={() => handleAssignStaff(request.request_id)}
                        className="mt-4 p-2 bg-green-500 text-white rounded-md w-full"
                      >
                        Assign Staff
                      </button>
                    )}
                  </div>
                ) : request.status === "Resolved" ? (
                  <Button className="w-fit px-4 py-2 text-sm" onClick={()=>{router.push(`/admin/payment/${request.request_id}`)}}>Make Payment</Button>
                ) : (
                  <div>
                    <p className="text-green-950 font-semibold bg-green-50">
                      Status: {request.status}
                    </p>
                    <p>Staff Member: {request.staffname}</p>
                    <p>Staff Number: {request.staffnumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Header>
  );
}
