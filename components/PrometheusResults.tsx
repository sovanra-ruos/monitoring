interface PrometheusResultsProps {
    data: {
        status: "success" | "error"
        data: {
            resultType: "vector" | "matrix" | "scalar" | "string"
            result: Array<{
                metric: { [key: string]: string }
                value: [number, string]
            }>
        }
    } | null
}

export default function PrometheusResults({ data }: PrometheusResultsProps) {
    if (!data) return null

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Query Results</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

