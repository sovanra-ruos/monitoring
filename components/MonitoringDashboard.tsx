"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts"
import { ClusterHealthIndicator } from "./ClusterHealthIndicator"
import { TopResourcePods } from "./TopResourcePods"
import { motion } from "framer-motion"
import {PrometheusQueryResult, PrometheusValue} from "@/lib/prometheus";

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
                                    timestamp: Number(item.value[0]),
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

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Cluster Health</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ClusterHealthIndicator health={data.clusterHealth} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pods</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <motion.p
                            className="text-3xl font-bold"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {data.podCount}
                        </motion.p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <motion.p
                            className="text-3xl font-bold"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {data.serviceCount}
                        </motion.p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Network Traffic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={100}>
                            <AreaChart data={data.networkTraffic}>
                                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>CPU Usage</CardTitle>
                        <CardDescription>Average CPU usage across all nodes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data.cpuUsage}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleTimeString()}
                                />
                                <YAxis tickFormatter={(value) => `${(value * 100).toFixed(2)}%`} />
                                <Tooltip
                                    labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
                                    formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "CPU Usage"]}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" name="CPU Usage" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Memory Usage</CardTitle>
                        <CardDescription>Total memory used across all nodes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data.memoryUsage}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleTimeString()}
                                />
                                <YAxis tickFormatter={(value) => formatBytes(value)} />
                                <Tooltip
                                    labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
                                    formatter={(value: number) => [formatBytes(value), "Memory Usage"]}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Memory Usage" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Disk I/O</CardTitle>
                        <CardDescription>Disk I/O operations per second across all nodes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data.diskIO}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleTimeString()}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
                                    formatter={(value: number) => [`${value.toFixed(2)} ops/s`, "Disk I/O"]}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#ffc658" name="Disk I/O" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <TopResourcePods cpuPods={data.topPodsCPU} memoryPods={data.topPodsMemory} />
        </div>
    )
}

export default MonitoringDashboard