"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { CheckoutProgressIndicator } from "@/components/checkout/checkout-progress-indicator"
import { BookingSummary } from "@/components/checkout/booking-summary"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage({ params }: { params: { scheduledTourId: string } }) {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { toast } = useToast()

  const handleConfirmation = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Booking processing...", description: "Please wait while we confirm your payment." })
    setTimeout(() => {
      const bookingId = `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      router.push(`/booking/confirmed/${bookingId}`)
    }, 2000)
  }

  return (
    <div className="container py-12">
      <CheckoutProgressIndicator currentStep={step} />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleConfirmation}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                  <CardDescription>Please provide your contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" required />
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Enter your payment details to complete the booking.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="•••• •••• •••• ••••" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM / YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="•••" required />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back to Details
                    </Button>
                    <Button type="submit" className="bg-brand-primary hover:bg-brand-primary/90">
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
        <div className="lg:col-span-1">
          <BookingSummary scheduledTourId={params.scheduledTourId} />
        </div>
      </div>
    </div>
  )
}
