"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

export default function UserAuthForm({title, role, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    try{
    console.log("Sign Up as " + role);
    if (!first_name || !last_name || !email || !password || !phone || !role) {
        console.error("All fields are required");
        alert("Error: " + "All fields are required");
        return;  // Don't proceed if any field is missing
    }
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ first_name, middle_name, last_name, email, phone, password, role }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await res.json();
      if (data.error) {
        console.error(data.error);
        alert("Error: " + data.error);
        window.location.reload();
      } else {
        console.log('Signup successful', data);
      }
      setLoading(false);
      setLoading(false);
      if(res.status===201){
        localStorage.setItem('token', data.token);
        router.push("/" + role.toLowerCase());
      }
    }catch(e){
      alert("Error: " + e);
    }
  };

  return (
    <Card className={"w-[400px]"} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="my-4">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Label className="my-4">First Name</Label>
        <Input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
        />
        <Label className="my-4">Middle Name</Label>
        <Input
            type="text"
            value={middle_name}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Middle Name"
        />
        <Label className="my-4">Last Name</Label>
        <Input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
        />
        <Label className="my-4">Phone Number</Label>
        <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            required
            pattern="^[0-9]{10}$"
            title="10-digit phone number"
        />
        <Label className="my-4">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button className="my-4" onClick={handleSignUp}>{loading ? "Signing Up..." : "Sign Up"}</Button>
      </CardContent>
    </Card>
  );
}
