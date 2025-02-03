import { NextResponse } from "next/server"

interface PrometheusResponse {
    status: "success" | "error"
    data: {
        resultType: "vector" | "matrix" | "scalar" | "string"
        result: Array<{
            metric: { [key: string]: string }
            values?: [number, string][]
            value?: [number, string]
        }>
    }
}

async function queryPrometheus(query: string): Promise<PrometheusResponse> {
    const baseUrl = "http://34.87.59.148:32325" // Replace with your actual Prometheus URL
    const url = `${baseUrl}/api/v1/query?query=${encodeURIComponent(query)}`

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: PrometheusResponse = await response.json()
    return data
}

export async function GET() {
    const queries = {
        cpuUsage: 'sum(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (instance)',
        memoryUsage: "sum(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) by (instance)",
        diskIO: "sum(rate(node_disk_io_time_seconds_total[5m])) by (instance)",
        networkTraffic:
            "sum(rate(node_network_receive_bytes_total[5m]) + rate(node_network_transmit_bytes_total[5m])) by (instance)",
        podCount: "count(kube_pod_info) by (node)",
        serviceCount: "count(kube_service_info)",
        topPodsCPU: "topk(5, sum(rate(container_cpu_usage_seconds_total[5m])) by (pod))",
        topPodsMemory: "topk(5, sum(container_memory_usage_bytes) by (pod))",
        clusterHealth:
            'sum(kube_node_status_condition{condition="Ready", status="true"}) / count(kube_node_status_condition{condition="Ready"})',
    }

    try {
        const results = await Promise.all(
            Object.entries(queries).map(async ([key, query]) => {
                const data = await queryPrometheus(query)
                return { [key]: data }
            }),
        )

        const combinedResults = Object.assign({}, ...results)
        return NextResponse.json(combinedResults)
    } catch (error) {
        console.error("Error querying Prometheus:", error)
        return NextResponse.json({ error: "Failed to query Prometheus" }, { status: 500 })
    }
}

