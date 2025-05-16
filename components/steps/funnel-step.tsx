"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

type FunnelStepProps = {
  value: string | null
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isEditing?: boolean
  onSave?: () => void
}

const FUNNEL_TYPES = [
  { id: "Content", label: "Content" },
  { id: "Offer", label: "Offer" },
  { id: "Chat", label: "Chat" },
]

export function FunnelStep({ value, onChange, onNext, onBack, isEditing = false, onSave }: FunnelStepProps) {
  // Only auto-advance when not in editing mode
  useEffect(() => {
    if (value && !isEditing) {
      const timer = setTimeout(() => {
        onNext()
      }, 300) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [value, onNext, isEditing])

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        {isEditing ? "Edit funnel type selection" : "Select the desired campaign funnel"}
      </h3>

      <div className="flex flex-col space-y-3 mb-6">
        {FUNNEL_TYPES.map((funnel) => (
          <Button
            key={funnel.id}
            variant={value === funnel.id ? "default" : "outline"}
            className={`w-full justify-start h-12 text-left px-4 ${
              value === funnel.id ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            onClick={() => onChange(funnel.id)}
          >
            {funnel.label}
          </Button>
        ))}
      </div>

      {/* Show Save button when in editing mode */}
      {isEditing && value && (
        <div className="flex justify-end">
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            Save & Continue
          </Button>
        </div>
      )}
    </div>
  )
}
