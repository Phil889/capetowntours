import { cn } from "@/lib/utils"

export function CheckoutProgressIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Your Details", "Payment", "Confirmation"]
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  isActive
                    ? "border-brand-primary bg-brand-primary text-white"
                    : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-slate-300 bg-slate-100",
                )}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <p className={cn("mt-2 text-sm", isActive ? "font-bold text-brand-primary" : "text-muted-foreground")}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={cn("mx-4 h-0.5 w-16 flex-1", isCompleted ? "bg-green-500" : "bg-slate-200")} />
            )}
          </div>
        )
      })}
    </div>
  )
}
