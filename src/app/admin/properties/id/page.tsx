"use client"

import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ViewPropAdmin() {
  const id = useParams();
  const [editStatus, setEditStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [property, setProperty] = useState<any>(null);
  const [finalTenant, setFinalTenant] = useState<{ [propertyIndex: number]: string }>({});
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        let userId: string = "";
        try {
          const decodedToken = jwtDecode(token);
          userId = decodedToken.userId;
          console.log("User ID:", userId);
        } catch (error) {
          console.error("Invalid token", error);
        }
        const response = await fetch(`/api/property?id=${id.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "User_ID": userId,
          },
        });
    
        const data = await response.json();
        if (response.ok) {
          setProperty(data);
          console.log("Fetched Property:", data);
          setLoading(false);
        } else {
          console.error("Property not found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        setLoading(false);
      }
    };
    

    if (id.id) {
      fetchPropertyDetails();
    }
  }, []);

  useEffect(()=>{
    console.log(property)
  }, [property])

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>, propertyKey: string) => {
    const updatedProperty = { ...property, [propertyKey]: e.target.value };
    setProperty(updatedProperty);
  };

  const handleTenantChange = (value: string) => {
    setFinalTenant((prev) => ({
      ...prev,
      [property.property_id]: value,
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  useEffect(() => {
    if (property && !finalTenant[property.property_id]) {
      setFinalTenant((prev) => ({
        ...prev,
        [property.property_id]: property.defaultTenantId || "",
      }));
    }
  }, [property]);

  const handleAllotTenant = async () => {
    const tenantId = finalTenant[property.property_id];
    if (!tenantId || tenantId === "none") {
      alert("Please select a tenant.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select start and end dates for the lease.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await fetch(`/api/allotment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User_ID": userId,
        },
        body: JSON.stringify({
          property_id: property.property_id,
          tenant_id:tenantId,
          start_date:startDate,
          end_date:endDate,
          price: 100
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Tenant allotted successfully!");
        setProperty((prev: { [propertyIndex: number]: string }) => ({ ...prev, tenantId }));
      } else {
        alert("Failed to allot tenant. Please try again.");
      }
    } catch (error) {
      console.error("Error allotting tenant:", error);
      alert("Error allotting tenant.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-850 text-center p-6">Property Details</h1>
      <div className="flex flex-col gap-6">
        <Card className="p-4 shadow-md rounded-lg">
          <CardContent>
            <p className="text-blue-950">
              <strong>Sale Type: </strong>
              {editStatus ? (
                <input
                  type="text"
                  name="Sale_type"
                  value={property.Sale_type}
                  onChange={(e) => handleEdit(e, "Sale_type")}
                />
              ) : (
                property.Sale_type
              )}
            </p>
            <p className="text-blue-950">
              <strong>Type: </strong>
              {editStatus ? (
                <input
                  type="text"
                  name="Type"
                  value={property.Type}
                  onChange={(e) => handleEdit(e, "Type")}
                />
              ) : (
                property.Type
              )}
            </p>
            <p className="text-blue-950">
              <strong>BHK Type: </strong>
              {editStatus ? (
                <input
                  type="text"
                  name="BHK_Type"
                  value={property.BHK_Type}
                  onChange={(e) => handleEdit(e, "BHK_Type")}
                />
              ) : (
                property.BHK_Type
              )}
            </p>
            <p className="text-blue-950">
              <strong>Furnishing: </strong>
              {editStatus ? (
                <input
                  type="text"
                  name="Furnishing"
                  value={property.Furnishing}
                  onChange={(e) => handleEdit(e, "Furnishing")}
                />
              ) : (
                property.Furnishing
              )}
            </p>
            <p className="text-blue-950">
              <strong>Price: </strong>
              {editStatus ? (
                <input
                  type="text"
                  name="Price"
                  value={property.Price}
                  onChange={(e) => handleEdit(e, "Price")}
                />
              ) : (
                property.Price
              )}
            </p>
            <p className="text-blue-950">
              <strong>Advance Amount: </strong>
              {editStatus ? (
                <input
                  type="text"
                  name="Advance_amount"
                  value={property.Advance_amount}
                  onChange={(e) => handleEdit(e, "Advance_amount")}
                />
              ) : (
                property.Advance_amount
              )}
            </p>
            <p className="text-blue-950">
              <strong>Negotiability: </strong>
              {editStatus ? (
                <input
                  type="text"
                  name="Negotiability"
                  value={property.Negotiability}
                  onChange={(e) => handleEdit(e, "Negotiability")}
                />
              ) : (
                property.Negotiability
              )}
            </p>

            {(property.sale_type==='Lease' && property.availability==='Available')?
            <div>
            <div className="mt-4">
              <label className="font-semibold">Select a Tenant:</label>
              <Select
                value={finalTenant[property.property_id] || ""}
                onValueChange={handleTenantChange}
              >
                <SelectTrigger className="p-2 border rounded-md w-full mt-2">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(property.enquiries) && property.enquiries.length > 0 ? (
                    property.enquiries.map((tenant: any, index: number) => (
                      <SelectItem key={index} value={tenant.tenant_id}>
                        {tenant.tenant_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No tenants available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {finalTenant[property.property_id] && finalTenant[property.property_id] !== "none" && (
              <div className="mt-4">
                <label className="font-semibold">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="p-2 border rounded-md w-full mt-2"
                />
              </div>
            )}

            {finalTenant[property.property_id] && finalTenant[property.property_id] !== "none" && (
              <div className="mt-4">
                <label className="font-semibold">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="p-2 border rounded-md w-full mt-2"
                />
              </div>
            )}

            <div className="mt-4">
              <Button onClick={handleAllotTenant}>Allot Tenant</Button>
            </div>
            </div>
            : <p className="text-blue-950">
              <strong>Status: </strong>
              {
                property.availability
              }
            </p>}
            <div className="flex flex-col items-start gap-2 mt-4">
              <Button
                onClick={() => {
                  setEditStatus(editStatus ? null : 1);
                }}
              >
                {editStatus ? "Save" : "Edit property"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
