"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PrometheusQueryFormProps {
    onSubmit: (query: string) => void
}

export default function PrometheusQueryForm({ onSubmit }: PrometheusQueryFormProps) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(query)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                    Prometheus Query
                </label>
                <Input
                    type="text"
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your Prometheus query"
                    className="mt-1"
                />
            </div>
            <Button type="submit">Submit Query</Button>
        </form>
    )
}

