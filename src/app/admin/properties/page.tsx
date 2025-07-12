"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../../../../layout/adminHeader";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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

export default function YourRentalsPage() {
  const [editStatus, setEditStatus] = useState<number | null>(null);
  const [propdetails, setpropdetails] = useState<PropertyDetails[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (token) {
          try {
            const decodedToken = jwtDecode<any>(token);
            const userId = decodedToken.userId;
            console.log("User ID:", userId);

            const response = await fetch("/api/properties", {
              method: "GET",
              headers: {
                "User_ID": userId,
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
        } else {
          console.error("Token not found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updated_details: PropertyDetails[] = [...propdetails];
    updated_details[index][e.target.name as keyof PropertyDetails] = e.target.value;
    setpropdetails(updated_details);
  };

  const updateProperty = async (property_id: number, updated_details: PropertyDetails) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage.");
      }
  
      const decodedToken = jwtDecode<any>(token);
      const userId = decodedToken.userId;
      console.log("User ID:", userId);
  
      const response = await fetch("/api/properties", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "User_ID": userId || "",
        },
        body: JSON.stringify({ property_id, updated_details }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update property");
      }
  
      const data = await response.json();
  
      console.log("Property updated successfully:", data);
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };
  

  const handleAddProperty = () => {
    router.push("/admin/addproperty");
  };

  return (

    <Header>
      <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 text-center p-6">
          YOUR PROPERTIES
        </h1>
        <div className="flex flex-col gap-6">
          {propdetails.map((prop, index) => (
            <Card key={prop.property_id} className="p-4 shadow-md rounded-lg">
              <CardContent>
                <CardTitle className="text-lg">Address: {prop.door_no}, {prop.building_name}, {prop.street_name}, {prop.area}</CardTitle>

                <p className="text-blue-950">
                  <strong>Type: </strong>
                  {editStatus === index ? (
                    <Input
                      type="text"
                      name="type"
                      value={prop.type}
                      onChange={(e) => handleEdit(e, index)}
                    />
                  ) : (
                    prop.type
                  )}
                </p>

                <p className="text-blue-950">
                  <strong>Availability: </strong>
                  {editStatus === index ? (
                    <Input
                      type="text"
                      name="availability"
                      value={prop.availability}
                      onChange={(e) => handleEdit(e, index)}
                    />
                  ) : (
                    prop.availability
                  )}
                </p>

                <p className="text-blue-950">
                  <strong>Description: </strong>
                  {editStatus === index ? (
                    <Input
                      type="text"
                      name="description"
                      value={prop.description}
                      onChange={(e) => handleEdit(e, index)}
                    />
                  ) : (
                    prop.description
                  )}
                </p>

                <p className="text-blue-950">
                  <strong>Area (sqft): </strong>
                  {prop.area_in_sqft}
                </p>

                <div className="flex flex-col items-start gap-2 mt-4">
                  <Button
                    onClick={() => {
                      setEditStatus(editStatus === index ? null : index);
                      if(editStatus === index) {
                        updateProperty(prop.property_id, prop);
                      }
                    }}
                  >
                    {editStatus === index ? "Save" : "Edit Property"}
                  </Button>
                  <Button className="w-fit px-4 py-2 text-sm my-4 bg-green-700" onClick={() => router.push(`/admin/properties/${prop.property_id}`)}>
                    View Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="fixed bottom-8 right-8">
          <Button
            className="bg-blue-600 text-white rounded-md p-8"
            onClick={handleAddProperty}
          >
            + Add Property
          </Button>
        </div>
      </div>
    </Header>
  );
}
