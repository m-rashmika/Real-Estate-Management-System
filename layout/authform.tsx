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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // To store error message
  const router = useRouter();

  const handleLogin = async () => {
    try{
    console.log("Logging in as " + role);
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    if (data.error) {
      setError(data.error);
      console.error(data.error);
      alert("Error: " + data.error);
      window.location.reload();
    } else {
      localStorage.setItem('token', data.token);
      console.log('Login successful', data.token);
      router.push("/" + role?.toLowerCase());
    }
    setLoading(false);}catch(e){
      alert("Error: " + e);
    }
  };

  return (
    <Card className={"w-[400px]"} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="mb-3">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Label className="my-3">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
        
        <Button 
          className="my-3" 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </CardContent>
    </Card>
  );
}

