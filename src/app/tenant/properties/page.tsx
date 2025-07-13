"use client";
import Header from "../../../../layout/tenantHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

type PropertyDetails = {
  property_id: number;
  owner_id: number;
  date_of_construction: string;
  create_at: string;
  update_at: string;
  door_no: string;
  building_name: string;
  street_name: string;
  area: string;
  type: string;
  area_in_sqft: number;
  facing: string;
  availability: string;
  past_tenant_count: number;
  description: string;
};

export default function TenantHome() {
  const [propdetails, setpropdetails] = useState<PropertyDetails[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
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
        const response = await fetch("/api/properties", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'User_ID': userId
            },
        });

        const data = await response.json();
        if (data.properties) {
            setpropdetails(data.properties);
        } else {
            console.error("No properties found in the response.");
        }
        } catch (error) {
        console.error("Invalid token", error);
        }
    };

    fetchProperties();
  }, []);

  return (
    <Header>
     <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">

        <h1 className="text-3xl font-bold text-blue-900 text-center p-6">
          View Properties
        </h1>
        <div className="flex flex-col gap-6">
          {propdetails.map((prop, index) => (
            <Card key={prop.property_id} className="p-4 shadow-md rounded-lg">
              <CardContent>
                <CardTitle className="text-lg">Address: {prop.door_no}, {prop.building_name}, {prop.street_name}, {prop.area}</CardTitle>

                <p className="text-blue-950">
                  <strong>Type: </strong>
                    {prop.type}
                </p>

                <p className="text-blue-950">
                  <strong>Availability: </strong>
                  { prop.availability }
                </p>

                <p className="text-blue-950">
                  <strong>Description: </strong>
                  {prop.description}
                </p>

                <p className="text-blue-950">
                  <strong>Area (sqft): </strong>
                  {prop.area_in_sqft}
                </p>

                <div className="flex flex-col items-start gap-2 mt-4">
                  <Button className="w-fit px-4 py-2 text-sm my-4 bg-green-700" onClick={() => router.push(`/tenant/properties/${prop.property_id}`)}>
                    View Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Header>
  );
}