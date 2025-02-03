"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"
import { ClusterHealthIndicator } from "./ClusterHealthIndicator"
import { TopResourcePods } from "./TopResourcePods"
import { DetailedChart } from "./DetailedChart"
import { MetricsRadarChart } from "./MetricsRadarChart"
import { motion } from "framer-motion"

import { Activity, Server, HardDrive } from "lucide-react"
import { PrometheusQueryResult, PrometheusValue } from "@/lib/prometheus";
import ResourceDistributionChart from "@/components/ResourceDistributionChart";

interface MetricData {
    timestamp: number
    value: number
}

interface DashboardData {
    cpuUsage: MetricData[]
    memoryUsage: MetricData[]
    diskIO: MetricData[]
    networkTraffic: MetricData[]
    podCount: number
    serviceCount: number
    topPodsCPU: { pod: string; value: number }[]
    topPodsMemory: { pod: string; value: number }[]
    clusterHealth: number
}

export function MonitoringDashboard() {
    const [data, setData] = useState<DashboardData>({
        cpuUsage: [],
        memoryUsage: [],
        diskIO: [],
        networkTraffic: [],
        podCount: 0,
        serviceCount: 0,
        topPodsCPU: [],
        topPodsMemory: [],
        clusterHealth: 1,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/prometheus")
                const result: PrometheusQueryResult = await response.json()

                const newData: DashboardData = {
                    cpuUsage: [],
                    memoryUsage: [],
                    diskIO: [],
                    networkTraffic: [],
                    podCount: 0,
                    serviceCount: 0,
                    topPodsCPU: [],
                    topPodsMemory: [],
                    clusterHealth: 1,
                }

                Object.entries(result).forEach(([key, value]) => {
                    if (value.data && value.data.result) {
                        if (["cpuUsage", "memoryUsage", "diskIO", "networkTraffic"].includes(key)) {
                            newData[key as keyof Pick<DashboardData, "cpuUsage" | "memoryUsage" | "diskIO" | "networkTraffic">] =
                                value.data.result.map((item: PrometheusValue) => ({
                                    timestamp: Number(item.value[0]) * 1000, // Convert to milliseconds
                                    value: Number(item.value[1]),
                                }))
                        } else if (key === "podCount") {
                            newData.podCount = value.data.result.reduce(
                                (sum: number, item: PrometheusValue) => sum + Number(item.value[1]),
                                0,
                            )
                        } else if (key === "serviceCount") {
                            newData.serviceCount = Number(value.data.result[0].value[1])
                        } else if (key === "topPodsCPU" || key === "topPodsMemory") {
                            newData[key] = value.data.result.map((item: PrometheusValue) => ({
                                pod: item.metric.pod,
                                value: Number(item.value[1]),
                            }))
                        } else if (key === "clusterHealth") {
                            newData.clusterHealth = Number(value.data.result[0].value[1])
                        }
                    }
                })

                setData(newData)
            } catch (error) {
                console.error("Error fetching monitoring data:", error)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 60000) // Fetch data every minute

        return () => clearInterval(interval)
    }, [])

    const formatBytes = (bytes: number) => {
        const sizes = ["B", "KB", "MB", "GB", "TB"]
        if (bytes === 0) return "0 B"
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
    }

    // Sample data for ResourceDistributionChart
    const podDistribution = [
        { name: "Running", value: data.podCount * 0.8 },
        { name: "Pending", value: data.podCount * 0.15 },
        { name: "Failed", value: data.podCount * 0.05 },
    ]

    // Sample data for MetricsRadarChart
    const nodeComparison = [
        { subject: "CPU", A: 120, B: 110 },
        { subject: "Memory", A: 98, B: 130 },
        { subject: "Disk I/O", A: 86, B: 130 },
        { subject: "Network", A: 99, B: 100 },
        { subject: "Pods", A: 85, B: 90 },
    ]

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-lg border border-purple-500/20 p-6 transition-transform duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        {/* Cluster Health Title */}
                        <CardTitle className="text-sm font-semibold text-white">
                            Cluster Health
                        </CardTitle>

                        {/* Activity Icon with Glow Effect */}
                        <Activity
                            className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 relative"
                        >
                            {/* Add a glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                        </Activity>
                    </CardHeader>

                    <CardContent className="mt-4">
                        {/* Cluster Health Indicator */}
                        <ClusterHealthIndicator
                            health={data.clusterHealth}
                        />
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-lg border border-purple-500/20 p-6 transition-transform duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        {/* Pods Title */}
                        <CardTitle className="text-sm font-semibold text-white">
                            Pods
                        </CardTitle>

                        {/* Server Icon with Glow Effect */}
                        <div className="relative">
                            <Server
                                className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 transition-transform duration-300 hover:scale-110"
                            />
                            {/* Add a glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                        </div>
                    </CardHeader>

                    <CardContent className="mt-4">
                        {/* Animated Pod Count */}
                        <motion.div
                            className="text-2xl font-bold text-white"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {data.podCount}
                        </motion.div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-lg border border-purple-500/20 p-6 transition-transform duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        {/* Services Title */}
                        <CardTitle className="text-sm font-semibold text-white">
                            Services
                        </CardTitle>

                        {/* HardDrive Icon with Glow Effect */}
                        <div className="relative">
                            <HardDrive
                                className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 transition-transform duration-300 hover:scale-110"
                            />
                            {/* Add a glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                        </div>
                    </CardHeader>

                    <CardContent className="mt-4">
                        {/* Animated Service Count */}
                        <motion.div
                            className="text-2xl font-bold text-white"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {data.serviceCount}
                        </motion.div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-lg border border-purple-500/20 p-6 transition-transform duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        {/* Network Traffic Title */}
                        <CardTitle className="text-sm font-semibold text-white">
                            Network Traffic
                        </CardTitle>

                        {/* Activity Icon with Glow Effect */}
                        <div className="relative">
                            <Activity
                                className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 transition-transform duration-300 hover:scale-110"
                            />
                            {/* Add a glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                        </div>
                    </CardHeader>

                    <CardContent className="mt-4">
                        {/* Enhanced Area Chart */}
                        <div className="h-[80px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.networkTraffic}>
                                    <defs>
                                        <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="url(#colorNetwork)"
                                        fill="url(#colorNetwork)"
                                        strokeWidth={2}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#ffffff80', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff80', fontSize: 10 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DetailedChart
                    title="CPU Usage"
                    description="Average CPU usage across all nodes"
                    data={data.cpuUsage}
                    valueFormatter={(value) => `${(value * 100).toFixed(2)}%`}
                    color="#8884d8"
                    chartType="composed"
                />
                <DetailedChart
                    title="Memory Usage"
                    description="Total memory used across all nodes"
                    data={data.memoryUsage}
                    valueFormatter={formatBytes}
                    color="#82ca9d"
                    chartType="composed"
                />
                <DetailedChart
                    title="Disk I/O"
                    description="Disk I/O operations per second across all nodes"
                    data={data.diskIO}
                    valueFormatter={(value) => `${value.toFixed(2)} ops/s`}
                    color="#ffc658"
                    chartType="scatter"
                />
                <DetailedChart
                    title="Network Traffic"
                    description="Network traffic across all nodes"
                    data={data.networkTraffic}
                    valueFormatter={formatBytes}
                    color="#ff8042"
                    chartType="scatter"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <ResourceDistributionChart title="Pod Status Distribution" data={podDistribution} />
                <MetricsRadarChart title="Node Comparison" data={nodeComparison} />
            </div>

            <TopResourcePods cpuPods={data.topPodsCPU} memoryPods={data.topPodsMemory} />
        </div>
    )
}

export default MonitoringDashboard