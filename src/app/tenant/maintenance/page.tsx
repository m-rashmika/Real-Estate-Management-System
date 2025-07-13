"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {jwtDecode} from "jwt-decode";
import Header from "../../../../layout/tenantHeader";

export default function YourRequestsPage() {

  interface MaintenanceRequest {
    request_id: string;
    building_name: string;
    status: string;
    created_at: string;
    Ownername: string;
    Ownernumber: string;
    Status: string;
    staff_name: string;
    staff_number: string;
    Service: string;
    Description: string;
  }

  const [currentRequests, setCurrentRequests] = useState<MaintenanceRequest[]>([]);
  const [pastRequests, setPastRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

        const fetchRequests = async () => {
            try {
                const response = await fetch("/api/maintenance", {
                    method: "GET",
                    headers: {
                        "User_ID": userId,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();

                setCurrentRequests(data.currentRequests || []);
                setPastRequests(data.pastRequests || []);
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

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
        Maintenance Requests
      </h1>


      <h2 className="text-2xl font-semibold text-white p-4 bg-blue-800">Current Maintenance Requests</h2>
      <div className="flex flex-col gap-6">
        {currentRequests.map((request) => (
          <Card key={request.request_id} className="p-4 shadow-md rounded-lg">
            <CardContent>
              <CardTitle className="text-lg">Address: {request.building_name}</CardTitle>
              <p className="text-black-950">Service: {request.Service}</p>
              <p className="text-black-950">Description: {request.Description}</p>
              <p className="text-black-950">Request created at: {request.created_at}</p>
              <p className="text-green-950 font-semibold bg-green-50">Status: {request.Status}</p>
              <p className="text-black-950">Staff Member : {request.staff_name}</p>
              <p className="text-black-950">Staff Member Phone Number: {request.staff_number}</p>\
              <p className="text-black-950">Owner Name: {request.Ownername}</p>
              <p className="text-black-950">Owner Phone Number: {request.Ownernumber}</p>
              <p className="text-black-950">Status: {request.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>


      <h2 className="text-2xl font-semibold text-white p-4 bg-blue-800 mt-4">Past Maintenance Requests</h2>
      <div className="flex flex-col gap-6">
        {pastRequests.map((request) => (
          <Card key={request.request_id} className="p-4 shadow-md rounded-lg">
            <CardContent>
              <CardTitle className="text-lg">Address: {request.building_name}</CardTitle>
              <p className="text-black-950">Service: {request.Service}</p>
              <p className="text-black-950">Description: {request.Description}</p>
              <p className="text-black-950">Request created at: {request.created_at}</p>
              <p className="text-green-950 font-semibold bg-green-50">Status: {request.Status}</p>
              <p className="text-black-950">Staff Member : {request.staff_name}</p>
              <p className="text-black-950">Staff Member Phone Number: {request.staff_number}</p>\
              <p className="text-black-950">Owner Name: {request.Ownername}</p>
              <p className="text-black-950">Owner Phone Number: {request.Ownernumber}</p>
              <p className="text-black-950">Status: {request.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </Header>
  );
}