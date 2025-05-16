"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { VerticalStep } from "@/components/steps/vertical-step"
import { FunnelStep } from "@/components/steps/funnel-step"
import { LanguageStep } from "@/components/steps/language-step"
import { TrafficSourceStep } from "@/components/steps/traffic-source-step"
import { Results } from "@/components/results"
import { AnimatePresence, motion } from "framer-motion"

export type FormData = {
  vertical: string | null
  funnelType: string | null
  language: string | null
  trafficSource: string | null
}

export function FilterForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    vertical: null,
    funnelType: null,
    language: null,
    trafficSource: null,
  })
  // Add editing mode state
  const [isEditing, setIsEditing] = useState(false)

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    // Exit editing mode when moving to next step
    setIsEditing(false)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const goToStep = (targetStep: number) => {
    setStep(targetStep)
    // Enter editing mode when going to a specific step
    setIsEditing(true)
  }

  const saveAndContinue = () => {
    // Exit editing mode and go to results
    setIsEditing(false)
    setStep(5) // Go directly to results
  }

  const renderStep = () => {
    const content = (() => {
      switch (step) {
        case 1:
          return (
            <VerticalStep
              value={formData.vertical}
              onChange={(value) => updateFormData("vertical", value)}
              onNext={nextStep}
              isEditing={isEditing}
              onSave={saveAndContinue}
            />
          )
        case 2:
          return (
            <FunnelStep
              value={formData.funnelType}
              onChange={(value) => updateFormData("funnelType", value)}
              onNext={nextStep}
              onBack={prevStep}
              isEditing={isEditing}
              onSave={saveAndContinue}
            />
          )
        case 3:
          return (
            <LanguageStep
              value={formData.language}
              onChange={(value) => updateFormData("language", value)}
              onNext={nextStep}
              onBack={prevStep}
              isEditing={isEditing}
              onSave={saveAndContinue}
            />
          )
        case 4:
          return (
            <TrafficSourceStep
              value={formData.trafficSource}
              onChange={(value) => updateFormData("trafficSource", value)}
              onNext={nextStep}
              onBack={prevStep}
              isEditing={isEditing}
              onSave={saveAndContinue}
            />
          )
        case 5:
          return (
            <Results
              formData={formData}
              onReset={() => {
                setFormData({
                  vertical: null,
                  funnelType: null,
                  language: null,
                  trafficSource: null,
                })
                setStep(1)
                setIsEditing(false)
              }}
              onEditField={(fieldStep) => goToStep(fieldStep)}
            />
          )
        default:
          return null
      }
    })()

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-1/5 h-2 rounded-full mx-1 ${i <= step ? "bg-green-500" : "bg-gray-200"}`} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Vertical</span>
          <span>Funnel</span>
          <span>Language</span>
          <span>Traffic</span>
          <span>Results</span>
        </div>
      </div>

      <Card className="p-6 overflow-hidden">{renderStep()}</Card>
    </div>
  )
}
