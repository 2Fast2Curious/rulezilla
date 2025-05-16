"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

type VerticalStepProps = {
  value: string | null
  onChange: (value: string) => void
  onNext: () => void
  isEditing?: boolean
  onSave?: () => void
}

const VERTICALS = [
  { id: "Auto", label: "Auto" },
  { id: "Medicare", label: "Medicare" },
  { id: "Health", label: "Health" },
  { id: "OPTB Child", label: "OPTB Child" },
  { id: "MidMarket", label: "MidMarket" },
]

export function VerticalStep({ value, onChange, onNext, isEditing = false, onSave }: VerticalStepProps) {
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
        {isEditing ? "Edit vertical selection" : "Select your required vertical"}
      </h3>

      <div className="flex flex-col space-y-3 mb-6">
        {VERTICALS.map((vertical) => (
          <Button
            key={vertical.id}
            variant={value === vertical.id ? "default" : "outline"}
            className={`w-full justify-start h-12 text-left px-4 ${
              value === vertical.id ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            onClick={() => onChange(vertical.id)}
          >
            {vertical.label}
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
