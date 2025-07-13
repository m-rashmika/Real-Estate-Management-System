"use client"
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../../../../layout/tenantHeader";
import { useParams } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

export default function ViewPropTenant() {
    const id = useParams();
    const [property, setProperty] = useState<any>(null);
    const [description, setDescription] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [contactRequested, setContactRequested] = useState<boolean>(false);

    useEffect(() => {
        const fetchPropertyDetails = async () => {
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
                const response = await fetch(`/api/property?id=${id.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'User_ID': userId,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setProperty(data);
                    setSubmitted(data.enquiries.approval?true:false);
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
    }, [id.id]);

    useEffect(() => {
        console.log("Updated Property:", property);
        console.log("Updated Property:", property?.enquiries?.approval);
      }, [property]);

      useEffect(() => {
        console.log("Updated Contact Request:", contactRequested);
      }, [contactRequested]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
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
            const response = await fetch("/api/enquiry", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'User_ID': userId,
                'Property_ID': id.id?.toString() || ""
              },
              body: JSON.stringify({ description })
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
              console.log("Enquiry created successfully");
            }
          } catch (error) {
            console.error("Error creating enquiry:", error);
          }
        setDescription("");
    };

    const handleContactRequest = async () => {
        setContactRequested(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <Header>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-blue-850 text-center p-6">
                    Property Details
                </h1>
                <div className="flex flex-col gap-6">
                    <Card key={property.property_id} className="p-4 shadow-md rounded-lg">
                        <CardContent>
                            <p className="text-blue-950">Sale Type: {property.sale_type}</p>
                            <p className="text-blue-950">Type: {property.type}</p>
                            <p className="text-blue-950">BHK Type: {property.bhk_type}</p>
                            <p className="text-blue-950">Furnishing: {property.furnishing}</p>
                            <p className="text-blue-950">Price: {property.price}</p>
                            <p className="text-blue-950">Area: {property.area}</p>
                            <p className="text-blue-950">Area: {property.area_in_sqft}</p>
                            <p className="text-blue-950">Advance Amount: {property.advance_amount}</p>
                            <p className="text-blue-950">Negotiability: {property.negotiability}</p>
                            <p className="text-blue-950">Two-Wheeler Parking: {property.two_wheeler_parking}</p>
                            <p className="text-blue-950">Four-Wheeler Parking: {property.four_wheeler_parking}</p>
                            <p className="text-blue-950">Bathrooms: {property.bathrooms}</p>
                            <p className="text-blue-950">Floor: {property.floor}</p>
                            <p className="text-blue-950">Lift Service: {property.lift_service}</p>

                            {!submitted && !contactRequested ? (
                                <div className="flex flex-col items-start gap-2 mt-4">
                                    <Button
                                        className="w-fit px-4 py-2 text-sm bg-green-700 hover:bg-green-700 text-white"
                                        onClick={handleContactRequest}
                                    >
                                        Request to contact the owner
                                    </Button>
                                </div>
                            ) : submitted && (
                                <p className="text-blue-950 mt-4">Owner Approval Status: {property?.enquiries?.approval}</p>
                            )}

                            {contactRequested && !submitted && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-4 p-4 border rounded-lg bg-gray-100"
                                >
                                    <label className="block text-gray-700 mb-2">
                                        Send the owner a message:
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Write your message here"
                                        className="w-full p-2 border rounded-md"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                    >
                                        Submit
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Header>
    );
}
