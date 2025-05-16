"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TrafficSourceStepProps = {
  value: string | null
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isEditing?: boolean
  onSave?: () => void
}

const TRAFFIC_SOURCES = [
  "Revcontent",
  "Applovin",
  "Newsbreak",
  "MGID",
  "Rumble",
  "YT",
  "SEO",
  "URL",
  "Mail",
  "QV",
  "Propeller Ads",
  "Quinstreet",
  "Snapchat",
  "Kayzen",
  "COMCAST",
  "Twitter",
  "Spotify",
  "ReadersDigest",
  "Pushnami",
  "Liveintent",
  "Incubeta",
  "Media Alpha",
  "QV Radio",
  "IW Media",
  "Jeeng",
  "Zemanta",
  "Bing", // Split from "Bing Search"
  "Search", // Split from "Bing Search"
  "Tiktok",
  "Google",
  "Facebook",
  "Taboola",
  "Outbrain",
]

export function TrafficSourceStep({
  value,
  onChange,
  onNext,
  onBack,
  isEditing = false,
  onSave,
}: TrafficSourceStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSources, setFilteredSources] = useState(TRAFFIC_SOURCES)

  useEffect(() => {
    if (searchTerm) {
      const filtered = TRAFFIC_SOURCES.filter((source) => source.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredSources(filtered)
    } else {
      setFilteredSources(TRAFFIC_SOURCES)
    }
  }, [searchTerm])

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
        {isEditing ? "Edit traffic source selection" : "Select traffic source"}
      </h3>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Start typing to search traffic sources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="max-h-60 overflow-y-auto mb-6 border rounded-md">
        {filteredSources.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 p-2">
            {filteredSources.map((source) => (
              <Button
                key={source}
                variant={value === source ? "default" : "ghost"}
                className={`justify-start h-10 ${value === source ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => onChange(source)}
              >
                {source}
              </Button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">No traffic sources found</div>
        )}
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
