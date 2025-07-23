import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BookingConfirmationPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="p-8">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="font-montserrat mt-6 text-3xl font-bold">Booking Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">A confirmation email has been sent to your address.</p>
          <p className="mt-4 rounded-md bg-slate-100 p-3 font-mono text-sm">
            Booking ID: <strong>{params.bookingId}</strong>
          </p>
          <Button asChild className="mt-8">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
