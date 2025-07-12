"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState("");

  const id = useParams();
  const router=useRouter();

  useEffect(() => {
    const fetchLeaseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const leaseId = id.request_id?.toString() || "";
          console.log(userId)

          const response = await fetch(`/api/payment`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'User_ID': userId,
              'Request_ID': leaseId
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPropertyName(data.maintenance_requests.building_name);
          } else {
            console.error("Error fetching lease details");
          }
        }
      } catch (error) {
        console.error("Error fetching lease details:", error);
      }
    };

    fetchLeaseDetails();
  }, [id]);

  const handlePayment = async (e: React.FormEvent) => {
    
    e.preventDefault();
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
      setStatus(null);

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'User_ID': userId,
        },
        body: JSON.stringify({
          request_id: id.request_id,
          description: 'Payment for maintenance',
          amount:amount,
          payment_mode:'credit'
        }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      setLoading(false);
      setStatus("success");
      router.push("/admin/maintenance")

    } catch (error) {
      console.error("Error fetching payment data:", error);
      setLoading(false);
      setStatus("failure");
    }
  };

  if(loading){
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-300 to-amber-100">
      <Card className="w-96 p-6 shadow-lg bg-orange-100">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Payment Details</h2>
          <div className="mb-4 relative">
            <Label>Card Number</Label>
            <div className="relative">
              <Input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                value={cardNumber || ""}
                onChange={(e) => setCardNumber(e.target.value)}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <Image src="/visa.svg" alt="Visa Logo" width={40} height={25} />
                <Image src="/mastercard.svg" alt="Mastercard Logo" width={40} height={25} />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Label>Amount</Label>
            <Input 
              type="text" 
              placeholder="₹0.00"
              value={amount || ""}
              onChange={(e)=>setAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label>Property Name</Label>
            <Input 
              type="text" 
              value={propertyName || ""}
              disabled
            />
          </div>
          <Button 
            className="w-full mt-4"
            onClick={handlePayment} 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Pay Now"}
          </Button>
          {status && (
            <p className={`mt-4 text-center ${status === "success" ? "text-green-600" : "text-red-600"}`}>
              {status === "success" ? `Your Payment of ₹${amount} was Successful!` : "Payment Failed! Try again."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

