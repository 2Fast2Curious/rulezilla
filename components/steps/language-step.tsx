"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

type LanguageStepProps = {
  value: string | null
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isEditing?: boolean
  onSave?: () => void
}

const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Spanish", label: "Spanish" },
]

export function LanguageStep({ value, onChange, onNext, onBack, isEditing = false, onSave }: LanguageStepProps) {
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
      <h3 className="text-xl font-medium mb-4">{isEditing ? "Edit language selection" : "Select campaign language"}</h3>

      <div className="flex flex-col space-y-3 mb-6">
        {LANGUAGES.map((language) => (
          <Button
            key={language.id}
            variant={value === language.id ? "default" : "outline"}
            className={`w-full justify-start h-12 text-left px-4 ${
              value === language.id ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            onClick={() => onChange(language.id)}
          >
            {language.label}
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
