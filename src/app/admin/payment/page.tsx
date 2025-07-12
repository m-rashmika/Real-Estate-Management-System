
"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handlePayment = () => {
    setLoading(true);
    setStatus(null);
    setTimeout(() => {
      setLoading(false);
      const success = Math.random() > 0.05;
      setStatus(success ? "success" : "failure");
    }, 2000);
  };

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
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <Image src="/visa.svg" alt="Visa Logo" width={40} height={25} />
                <Image src="/mastercard.svg" alt="Mastercard Logo" width={40} height={25} />
              </div>
            </div>
          </div>
          <div className="mb-4 flex gap-2">
            <div className="w-1/2">
              <Label>Expiry</Label>
              <Input 
                type="text" 
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <Label>CVV</Label>
              <Input 
                type="text" 
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <Label>Amount</Label>
            <Input 
              type="text" 
              placeholder="₹0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
