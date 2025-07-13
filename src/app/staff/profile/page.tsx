"use client"
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import Header from "../../../../layout/staffHeader"
import Image from "next/image";
import { LoaderCircle } from "lucide-react";

export default function sprofile() {
    const [editstatus, seteditstatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [staffdetails, setstaffdetails] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        email: "",
        account_no: "",
        service: "",
        ifsc_code: "",
        bank_name: "",
        bank_branch: "",
        account_holder_name: "",
        upi_id: ""
    });

    const fetchProfile = async () => {
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
            setLoading(true);
            const response = await fetch('/api/profile', { method: 'GET', headers: { 'User_ID': userId } });
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setstaffdetails({
                first_name: data.user.first_name,
                middle_name: data.user.middle_name,
                last_name: data.user.last_name,
                phone: data.user.phone,
                email: data.user.email,
                service: data.staffDetails.service,
                account_no: data.staffDetails.account_no,
                ifsc_code: data.staffDetails.ifsc_code,
                bank_name: data.staffDetails.bank_name,
                bank_branch: data.staffDetails.bank_branch,
                account_holder_name: data.staffDetails.account_holder_name,
                upi_id: data.staffDetails.upi_id
            });
            setLoading(false);

        } catch (error) {
            console.error('Error fetching profile:', error);
            alert("Error: " + error);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async () => {
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
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'User_ID': userId
                },
                body: JSON.stringify(staffdetails)
            });
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert("Error: " + error);
        }
    };

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstaffdetails({ ...staffdetails, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <LoaderCircle className="text-muted-foreground size-24 animate-spin" />
                <p className="text-lg text-gray-600">Booking in progress...</p>
            </div>
        );
    }


    return (
        <Header>
            <div
                className="flex flex-col items-center justify-center w-full min-h-screen py-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/profilebg.svg')" }}
            >
                <div className="w-full max-w-md p-6">
                    <Card className="w-full shadow-lg">
                        <CardContent className="text-center space-y-4">
                            <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>

                            <div className="flex justify-center">
                                <Image src="/profilepic.svg" alt="Profile Pic" width={80} height={80} className="rounded-full" />
                            </div>

                            <p className="text-gray-600">
                                <strong>First Name:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="first_name"
                                        value={staffdetails.first_name}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.first_name
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>Middle Name:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="middle_name"
                                        value={staffdetails.middle_name}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.middle_name
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>Last Name:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="last_name"
                                        value={staffdetails.last_name}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.last_name
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>Phone:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="phone"
                                        value={staffdetails.phone}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.phone
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>Email:</strong> {staffdetails.email}
                            </p>

                            <p className="text-gray-600">
                                <strong>Service: </strong> {staffdetails.service}
                            </p>

                            <p className="text-gray-600">
                                <strong>Account Number:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="account_no"
                                        value={staffdetails.account_no}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.account_no
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>IFSC Code:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="ifsc_code"
                                        value={staffdetails.ifsc_code}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.ifsc_code
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>Bank Name:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="bank_name"
                                        value={staffdetails.bank_name}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.bank_name
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>Bank Branch:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="bank_branch"
                                        value={staffdetails.bank_branch}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.bank_branch
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>Account Holder Name:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="account_holder_name"
                                        value={staffdetails.account_holder_name}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.account_holder_name
                                )}
                            </p>

                            <p className="text-gray-600">
                                <strong>UPI ID:</strong>
                                {editstatus ? (
                                    <Input
                                        type="text"
                                        name="upi_id"
                                        value={staffdetails.upi_id}
                                        onChange={handleEdit}
                                    />
                                ) : (
                                    staffdetails.upi_id
                                )}
                            </p>

                            <Button onClick={() => {
                                seteditstatus(!editstatus);
                                if (editstatus) {
                                    updateProfile();
                                }
                            }}>
                                {editstatus ? "Save" : "Edit"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Header>
    );
}
