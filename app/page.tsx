import Image from "next/image"
import { FilterForm } from "@/components/filter-form"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col items-center mb-12">
          <div className="w-48 h-48 relative mb-4">
            <Image src="/images/rulezilla-logo.png" alt="Rulezilla Logo" fill className="object-contain" priority />
          </div>
          <h1 className="text-4xl font-bold text-green-800">Rulezilla</h1>
          <p className="text-sm text-gray-600">A KD Production</p>
        </header>

        <main>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Find Your Campaign Rule Group</h2>
            <FilterForm />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
