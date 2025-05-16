"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { FormData } from "@/components/filter-form"
import { PencilIcon, Loader2 } from "lucide-react"
import { findMatchingRuleGroups, type RuleGroup } from "@/lib/campaign-rules"
import { useToast } from "@/hooks/use-toast"

type ResultsProps = {
  formData: FormData
  onReset: () => void
  onEditField: (step: number) => void
}

export function Results({ formData, onReset, onEditField }: ResultsProps) {
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadRuleGroups() {
      setLoading(true)
      try {
        console.log("Finding matching rule groups for:", formData)
        const groups = await findMatchingRuleGroups(
          formData.vertical,
          formData.funnelType,
          formData.language,
          formData.trafficSource,
        )
        console.log("Found rule groups:", groups)
        setRuleGroups(groups)
      } catch (error) {
        console.error("Error loading rule groups:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRuleGroups()
  }, [formData])

  const handleCopyId = (id: string, type: string) => {
    navigator.clipboard.writeText(id)
    toast({
      title: "ID Copied",
      description: `${type} ID has been copied to clipboard`,
      duration: 2000,
    })
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Your Campaign Rule Groups</h3>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-medium text-lg text-green-700 mb-2">Selected Filters:</h4>
          <ul className="list-none space-y-2 mb-4">
            <li className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <span className="font-medium">Vertical:</span> {formData.vertical}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEditField(1)}
                aria-label="Edit vertical"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <span className="font-medium">Funnel Type:</span> {formData.funnelType}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEditField(2)}
                aria-label="Edit funnel type"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <span className="font-medium">Language:</span> {formData.language}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEditField(3)}
                aria-label="Edit language"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <span className="font-medium">Traffic Source:</span> {formData.trafficSource}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEditField(4)}
                aria-label="Edit traffic source"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-green-600">Finding campaign rule groups...</span>
          </div>
        ) : ruleGroups.length > 0 ? (
          <div className="space-y-6">
            {ruleGroups.map((group, index) => (
              <div key={index} className="border border-green-100 rounded-lg overflow-hidden">
                <div className="bg-green-600 text-white px-4 py-2 font-medium">{group.description}</div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-lg text-green-700 mb-2">Desktop Campaign:</h4>
                    <Card className="p-4 bg-green-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Name: {group.desktop.name}</p>
                          <p>ID: {group.desktop.id}</p>
                        </div>
                        <Button onClick={() => handleCopyId(group.desktop.id, "Desktop")} variant="outline" size="sm">
                          Copy ID
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg text-green-700 mb-2">Mobile Campaign:</h4>
                    <Card className="p-4 bg-green-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Name: {group.mobile.name}</p>
                          <p>ID: {group.mobile.id}</p>
                        </div>
                        <Button onClick={() => handleCopyId(group.mobile.id, "Mobile")} variant="outline" size="sm">
                          Copy ID
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
            <h4 className="font-medium mb-2">No matching campaign rule groups found</h4>
            <p>
              Try adjusting your filter selections to find applicable campaign rule groups. If you believe this is an
              error, please contact your administrator.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Start Over
        </Button>
      </div>
    </div>
  )
}
