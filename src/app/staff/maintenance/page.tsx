"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import Header from '../../../../layout/staffHeader';

export default function YourRequestsPage() {
  interface MaintenanceRequest {
    request_id: string;
    building_name: string;
    status: string;
    created_at: string;
    ownername: string;
    ownernumber: string;
    tenant_name: string;
    tenant_number: string;
    service: string;
    description: string;
  }

  const [currentRequests, setCurrentRequests] = useState<MaintenanceRequest[]>([]);
  const [pastRequests, setPastRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          const response = await fetch("/api/staff", {
            method: "GET",
            headers: {
              "User_ID": userId,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch maintenance requests');
          }
  
          const data = await response.json();
          setCurrentRequests(data.currentStaffRequests || []);
          setPastRequests(data.pastStaffRequests || []);
        } catch (error) {
          console.error("Error fetching requests:", error);
          setError("Failed to load requests");
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    }, []);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const response = await fetch("/api/staff", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "User_ID": userId,
        },
        body: JSON.stringify({ requestId, newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedRequest = await response.json();

      setCurrentRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.request_id === updatedRequest.request_id
            ? { ...request, status: updatedRequest.status }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Header>
    <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">
      
      <h1 className="text-3xl font-bold text-blue-900 text-center p-6">
        Your Maintenance Requests
      </h1>

      <h2 className="text-2xl font-semibold text-white p-4 bg-blue-900">
        Current Maintenance Requests
      </h2>
      <div className="flex flex-col gap-6">
        {currentRequests.map((request) => (
          <Card key={request.request_id} className="p-4 shadow-md rounded-lg">
            <CardContent>
              <CardTitle className="text-lg">Address: {request.building_name}</CardTitle>
              <p className="text-black-950">Service: {request.service}</p>
              <p className="text-black-950">Description: {request.description}</p>
              <p className="text-black-950">Request created at: {request.created_at}</p>
              <p className="text-green-950 font-semibold bg-green-50">Status: {request.Status}</p>
              <p className="text-black-950">Staff Member: {request.tenant_name}</p>
              <p className="text-black-950">Staff Member Phone Number: {request.tenant_number}</p>
              <p className="text-black-950">Owner Name: {request.ownername}</p>
              <p className="text-black-950">Owner Phone Number: {request.ownernumber}</p>
              <p className="text-black-950">Status: {request.status}</p>

              {
                request.status==='Assigned' && <Button className="w-fit px-4 py-2 text-sm" onClick={()=>{handleStatusUpdate('In progress', request.request_id)}}>Mark as Ongoing</Button>
              }
              {
                request.status==='In progress' && <Button className="w-fit px-4 py-2 text-sm" onClick={()=>{handleStatusUpdate('Resolved', request.request_id)}}>Mark as Resolved</Button>
              }
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-white p-4 bg-blue-900 mt-4">
        Past Maintenance Requests
      </h2>
      <div className="flex flex-col gap-6">
        {pastRequests.map((request) => (
          <Card key={request.request_id} className="p-4 shadow-md rounded-lg">
            <CardContent>
              <CardTitle className="text-lg">Address: {request.building_name}</CardTitle>
              <p className="text-black-950">Service: {request.service}</p>
              <p className="text-black-950">Description: {request.description}</p>
              <p className="text-black-950">Request created at: {request.created_at}</p>
              <p className="text-green-950 font-semibold bg-green-50">Status: {request.status}</p>
              <p className="text-black-950">Staff Member: {request.tenant_name}</p>
              <p className="text-black-950">Staff Member Phone Number: {request.tenant_number}</p>
              <p className="text-black-950">Owner Name: {request.ownername}</p>
              <p className="text-black-950">Owner Phone Number: {request.ownernumber}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </Header>
  );
}
