"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "../../../../layout/adminHeader";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function AddProp() {
  const [property, setProperty] = useState({
    Door_no: "",
    Date_of_construction: "",
    Building_name: "",
    Street_name: "",
    Area: "",
    Area_in_sqft: "",
    Facing: "",
    Type: "",
    Description: "",
    Zip_code: "",
    Country: "",
    City: "",
    State: "",
    images: [] as File[],
    Sale_type: "",
    Boundary_wall: "",
    Price_per_sqft: "",
    Negotiability: "",
    BHK_Type: "",
    Furnishing: "",
    Two_wheeler_parking: "",
    Four_wheeler_parking: "",
    Bathrooms: "",
    Floor: "",
    Lift_service: "",
    Start_floor: "",
    End_floor: "",
    Parking: "",
    Advance_amount: "",
    Price: "",
    Advance: "",
    Usage: "",
    House_Type: ""
  });

  const [propertyType, setPropertyType] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { value: string; name: string }
  ) => {
    if (e && 'value' in e) {
      setProperty({ ...property, [e.name]: e.value });
    } else {
      setProperty({ ...property, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProperty({
        ...property,
        images: Array.from(e.target.files),
      });
    }
  };

  const validateForm = () => {
    if (!property.Type) {
      setError("Property Type is required.");
      return false;
    }
    if (property.Type === "Land") {
      if (!property.Sale_type || !property.Price_per_sqft || !property.Negotiability) {
        setError("Sale type, Price per sqft, and Negotiability are required for Land.");
        return false;
      }
    } else if (property.Type === "Residential Building") {
      console.log(property.BHK_Type, property.Furnishing, property.Price_per_sqft, property.Negotiability)
      if (!property.BHK_Type || !property.Furnishing || !property.Price_per_sqft || !property.Negotiability) {
        setError("BHK Type, Furnishing, Price per sqft, and Negotiability are required for Residential Building.");
        return false;
      }
    } else if (property.Type === "Commercial Building") {
      if (!property.Parking || !property.Furnishing || !property.Price_per_sqft || !property.Negotiability) {
        setError("Parking, Furnishing, Price per sqft, and Negotiability are required for Commercial Building.");
        return false;
      }
    }

    if (!property.Door_no || !property.Date_of_construction || !property.Area || !property.Street_name) {
      setError("Please fill in all the basic property information.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("hi")
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const decodedToken = jwtDecode<any>(token);
      const userId = decodedToken.userId;
      const formData = new FormData();

      formData.append("Door_no", property.Door_no);
      formData.append("Date_of_construction", property.Date_of_construction);
      formData.append("Building_name", property.Building_name);
      formData.append("Street_name", property.Street_name);
      formData.append("Area", property.Area);
      formData.append("Area_in_sqft", property.Area_in_sqft);
      formData.append("Facing", property.Facing);
      formData.append("Type", property.Type);
      formData.append("Description", property.Description);
      formData.append("Zip_code", property.Zip_code);
      formData.append("Country", property.Country);
      formData.append("City", property.City);
      formData.append("State", property.State);

      property.images.forEach((file) => {
        formData.append("images", file);
      });

      if (property.Type === "Land") {
        formData.append("Usage", property.Usage);
        formData.append("Sale_type", property.Sale_type);
        formData.append("Boundary_wall", property.Boundary_wall);
        formData.append("Price_per_sqft", property.Price_per_sqft);
        formData.append("Negotiability", property.Negotiability);
        formData.append("Advance", property.Advance);
      } else if (property.Type === "Residential Building") {
        formData.append("Sale_type", property.Sale_type);
        formData.append("BHK_Type", property.BHK_Type);
        formData.append("Furnishing", property.Furnishing);
        formData.append("Price", property.Price_per_sqft);
        formData.append("Negotiability", property.Negotiability);
        formData.append("Two_wheeler_parking", property.Two_wheeler_parking);
        formData.append("Four_wheeler_parking", property.Four_wheeler_parking);
        formData.append("Bathrooms", property.Bathrooms);
        formData.append("Floor", property.Floor);
        formData.append("Lift_service", property.Lift_service);
        formData.append("Advance", property.Advance);
        formData.append("House_Type", property.House_Type);
      } else if (property.Type === "Commercial Building") {
        formData.append("Sale_type", property.Sale_type);
        formData.append("Parking", property.Parking);
        formData.append("Furnishing", property.Furnishing);
        formData.append("Price", property.Price_per_sqft);
        formData.append("Negotiability", property.Negotiability);
        formData.append("Start_floor", property.Start_floor);
        formData.append("End_floor", property.End_floor);
        formData.append("Lift_service", property.Lift_service);
        formData.append("Advance", property.Advance);
        formData.append("House_Type", property.House_Type);
      }

      console.log("hiiiiiiii")

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "User_ID": userId,
        },
        body: formData,
      });

      console.log(res)

      if (!res.ok) {
        console.error("Error adding property");
      }
      router.push("/admin/properties");
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  return (
    <Header>
            <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-300 min-h-screen">

        <h1 className="text-3xl text-center font-semibold my-3">Add property details</h1>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>

              <div className="mb-4">
                <label className="font-semibold">Type</label>
                <Select name="Type" value={property.Type} onValueChange={(value) => {
                  setProperty({ ...property, Type: value });
                  setPropertyType(value);
                }}>
                  <SelectTrigger className="border p-2 w-full md:w-auto">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commercial Building">Commercial Building</SelectItem>
                    <SelectItem value="Residential Building">Residential Building</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <label className="font-semibold">Door Number</label>
                <Input
                  type="text"
                  name="Door_no"
                  value={property.Door_no}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Date of Construction</label>
                <Input
                  type="date"
                  name="Date_of_construction"
                  value={property.Date_of_construction}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Building Name</label>
                <Input
                  type="text"
                  name="Building_name"
                  value={property.Building_name}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Street Name</label>
                <Input
                  type="text"
                  name="Street_name"
                  value={property.Street_name}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Area</label>
                <Input
                  type="text"
                  name="Area"
                  value={property.Area}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Area in Sqft</label>
                <Input
                  type="number"
                  name="Area_in_sqft"
                  value={property.Area_in_sqft}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Facing</label>
                <Select name="Facing" value={property.Facing} onValueChange={(value) => handleChange({ name: "Facing", value })}>
                  <SelectTrigger className="border p-2 w-full md:w-auto">
                    <SelectValue placeholder="Facing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                    <SelectItem value="North-East">North-East</SelectItem>
                    <SelectItem value="North-West">North-West</SelectItem>
                    <SelectItem value="South-East">South-East</SelectItem>
                    <SelectItem value="South-West">South-West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label className="font-semibold">Description</label>
                <Textarea
                  name="Description"
                  value={property.Description}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Zip Code</label>
                <Input
                  type="text"
                  name="Zip_code"
                  value={property.Zip_code}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Country</label>
                <Input
                  type="text"
                  name="Country"
                  value={property.Country}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">City</label>
                <Input
                  type="text"
                  name="City"
                  value={property.City}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">State</label>
                <Input
                  type="text"
                  name="State"
                  value={property.State}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>


              {error && <div className="text-red-500 mb-4">{error}</div>}

              {propertyType === "Land" && (
                <>
                  <div className="mb-4">
                    <label className="font-semibold">Sale Type</label>
                    <Select name="Sale_type" value={property.Sale_type} onValueChange={(value) => handleChange({ name: "Sale_type", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Sale Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Buy">Buy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Usage</label>
                    <Select name="Usage" value={property.Usage} onValueChange={(value) => handleChange({ name: "Usage", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='commercial'>Commercial</SelectItem>
                        <SelectItem value='Residential'>Residential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Boundary Wall</label>
                    <Select name="Boundary_wall" value={property.Boundary_wall} onValueChange={(value) => handleChange({ name: "Boundary_wall", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Boundary Wall" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Price per Sqft</label>
                    <Input
                      type="number"
                      name="Price_per_sqft"
                      value={property.Price_per_sqft}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Advance Amount</label>
                    <Input
                      type="number"
                      name="Advance"
                      value={property.Advance}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Negotiability</label>
                    <Select name="Negotiability" value={property.Negotiability} onValueChange={(value) => handleChange({ name: "Negotiability", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Negotiability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}


              {propertyType === "Residential Building" && (
                <>
                  <div className="mb-4">
                    <label className="font-semibold">BHK Type</label>
                    <Select name="BHK_Type" value={property.BHK_Type} onValueChange={(value) => handleChange({ name: "BHK_Type", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="BHK Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="5">5 BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Sale Type</label>
                    <Select name="Sale_type" value={property.Sale_type} onValueChange={(value) => handleChange({ name: "Sale_type", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Sale Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Buy">Buy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Building Type</label>
                    <Select name="House_Type" value={property.House_Type} onValueChange={(value) => handleChange({ name: "House_Type", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="House Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Apartment/flat'>Apartment/flat</SelectItem>
                        <SelectItem value='Independent house/Villa'>Independent house/Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Advance Amount</label>
                    <Input
                      type="number"
                      name="Advance"
                      value={property.Advance}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Furnishing</label>
                    <Select name="Furnishing" value={property.Furnishing} onValueChange={(value) => handleChange({ name: "Furnishing", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Furnishing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fully furnished">Fully furnished</SelectItem>
                        <SelectItem value="Semi furnished">Semi furnished</SelectItem>
                        <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Two-Wheeler Parking</label>
                    <Select name="Two_wheeler_parking" value={property.Two_wheeler_parking} onValueChange={(value) => handleChange({ name: "Two_wheeler_parking", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Two-Wheeler Parking" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Four-Wheeler Parking</label>
                    <Select name="Four_wheeler_parking" value={property.Four_wheeler_parking} onValueChange={(value) => handleChange({ name: "Four_wheeler_parking", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Four-Wheeler Parking" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Bathrooms</label>
                    <Input
                      type="number"
                      name="Bathrooms"
                      value={property.Bathrooms}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Floor</label>
                    <Input
                      type="number"
                      name="Floor"
                      value={property.Floor}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Lift Service</label>
                    <Select name="Lift_service" value={property.Lift_service} onValueChange={(value) => handleChange({ name: "Lift_service", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Lift Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Price</label>
                    <Input
                      type="number"
                      name="Price_per_sqft"
                      value={property.Price_per_sqft}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Advance Amount</label>
                    <Input
                      type="number"
                      name="Advance_amount"
                      value={property.Advance_amount}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Negotiability</label>
                    <Select name="Negotiability" value={property.Negotiability} onValueChange={(value) => handleChange({ name: "Negotiability", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Negotiability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {propertyType === "Commercial Building" && (
                <>
                  <div className="mb-4">
                    <label className="font-semibold">Parking</label>
                    <Select name="Parking" value={property.Parking} onValueChange={(value) => handleChange({ name: "Parking", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Parking" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Start Floor</label>
                    <Input
                      type="number"
                      name="Start_floor"
                      value={property.Start_floor}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">End Floor</label>
                    <Input
                      type="number"
                      name="End_floor"
                      value={property.End_floor}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Building Type</label>
                    <Select name="House_Type" value={property.House_Type} onValueChange={(value) => handleChange({ name: "House_Type", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="House Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Office space'>Office space</SelectItem>
                        <SelectItem value='Warehouse'>Warehouse</SelectItem>
                        <SelectItem value='Retail shop'>Retail shop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Furnishing</label>
                    <Select name="Furnishing" value={property.Furnishing} onValueChange={(value) => handleChange({ name: "Furnishing", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Furnishing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fully furnished">Fully furnished</SelectItem>
                        <SelectItem value="Semi furnished">Semi furnished</SelectItem>
                        <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Lift Service</label>
                    <Select name="Lift_service" value={property.Lift_service} onValueChange={(value) => handleChange({ name: "Lift_service", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Lift Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Price per Sqft</label>
                    <Input
                      type="number"
                      name="Price_per_sqft"
                      value={property.Price_per_sqft}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Advance Amount</label>
                    <Input
                      type="number"
                      name="Advance"
                      value={property.Advance}
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Negotiability</label>
                    <Select name="Negotiability" value={property.Negotiability} onValueChange={(value) => handleChange({ name: "Negotiability", value })}>
                      <SelectTrigger className="border p-2 w-full md:w-auto">
                        <SelectValue placeholder="Negotiability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}


              {/* Basic Information Continued */}
              <div className="mb-4">
                <label className="font-semibold">Description</label>
                <Input
                  type="text"
                  name="Description"
                  value={property.Description}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Upload Property Images</label>
                <Input
                  type="file"
                  name="images"
                  onChange={handleFileChange}
                  multiple
                  className="border p-2 w-full"
                />
              </div>

              <Button type="submit" className="bg-blue-600 text-2xl text-white my-3 rounded"> Save</Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </Header>
  );
}
