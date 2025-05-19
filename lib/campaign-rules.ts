import Papa from "papaparse"

export type CampaignRule = {
  vertical: string
  funnelType: string
  language: string
  trafficSource: string
  desktopRuleId: string
  desktopRuleName: string
  mobileRuleId: string
  mobileRuleName: string
  description: string
}

export type RuleGroup = {
  description: string
  desktop: {
    id: string
    name: string
  }
  mobile: {
    id: string
    name: string
  }
}

let campaignRules: CampaignRule[] | null = null

export async function fetchCampaignRules(): Promise<CampaignRule[]> {
  if (campaignRules) {
    return campaignRules
  }

  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/For%20Chat%202%20-%20Sheet1%20%286%29-VVLsv7PQq7nIYonIIF0cE81JbNmjFv.csv",
      { cache: "no-store" } // Ensure we don't use cached data
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }
    
    const csvText = await response.text()

    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    if (result.errors && result.errors.length > 0) {
      console.error("CSV parsing errors:", result.errors)
    }

    campaignRules = (result.data as any[]).map((row) => ({
      vertical: row["Vertical"] || "",
      funnelType: row["Funnel Type"] || "",
      language: row["Language"] || "",
      trafficSource: row["Filter 4:"] || "",
      desktopRuleId: row["Desktop Rule ID"] || "",
      desktopRuleName: row["Desktop Rule Name"] || "",
      mobileRuleId: row["Mobile Rule ID"] || "",
      mobileRuleName: row["Mobile Rule Name"] || "",
      description: row["Decription"] || "",
    }))

    console.log(`Loaded ${campaignRules.length} campaign rules`)
    return campaignRules
  } catch (error) {
    console.error("Error fetching campaign rules:", error)
    return []
  }
}

function matchesFilter(ruleValue: string, selectedValue: string): boolean {
  // Handle "All" case - matches everything
  if (ruleValue.toLowerCase() === "all") {
    return true
  }
  
  // Handle "All excluding X" cases
  if (ruleValue.toLowerCase().includes("all excluding")) {
    const excluded = ruleValue.replace("All Excluding ", "").toLowerCase()
    return selectedValue.toLowerCase() !== excluded.toLowerCase()
  }
  
  // Handle comma-separated values (multiple traffic sources)
  if (ruleValue.includes(",")) {
    // Split by comma and trim whitespace
    const values = ruleValue.split(",").map((v) => v.trim().toLowerCase())
    // Check if the selected value matches any of the values in the list
    return values.includes(selectedValue.toLowerCase())
  }

  // Direct match
  return ruleValue.toLowerCase() === selectedValue.toLowerCase()
}

export async function findMatchingRuleGroups(
  vertical: string | null,
  funnelType: string | null,
  language: string | null,
  trafficSource: string | null,
): Promise<RuleGroup[]> {
  if (!vertical || !funnelType || !language || !trafficSource) {
    return []
  }

  const rules = await fetchCampaignRules()
  
  console.log(`Searching for matches with: ${vertical}, ${funnelType}, ${language}, ${trafficSource}`)

  const matchingRules = rules.filter((rule) => {
    const matches = (
      matchesFilter(rule.vertical, vertical) &&
      matchesFilter(rule.funnelType, funnelType) &&
      matchesFilter(rule.language, language) &&
      matchesFilter(rule.trafficSource, trafficSource)
    )
    
    return matches
  })
  
  console.log(`Found ${matchingRules.length} matching rules`)

  return matchingRules.map((rule) => ({
    description: rule.description,
    desktop: {
      id: rule.desktopRuleId,
      name: rule.desktopRuleName,
    },
    mobile: {
      id: rule.mobileRuleId,
      name: rule.mobileRuleName,
    },
  }))
}
