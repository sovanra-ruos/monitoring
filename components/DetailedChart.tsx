import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AreaChart,
    Area,
    ScatterChart,
    Scatter,
    Line,
    Bar,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"

interface DetailedChartProps {
    title: string
    description: string
    data: { timestamp: number; value: number }[]
    valueFormatter: (value: number) => string
    color: string
    chartType?: "area" | "scatter" | "composed"
}

export function DetailedChart({
    title,
    description,
    data,
    valueFormatter,
    color,
    chartType = "area",
}: DetailedChartProps) {
    const [timeRange, setTimeRange] = useState("1h")
    const filteredData = data.filter((item) => {
        const now = Date.now()
        switch (timeRange) {
            case "1h":
                return item.timestamp > now - 3600000
            case "6h":
                return item.timestamp > now - 21600000
            case "24h":
                return item.timestamp > now - 86400000
            default:
                return true
        }
    })

    const renderChart = () => {
        switch (chartType) {
            case "area":
                return (
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
                        <YAxis tickFormatter={valueFormatter} />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => [valueFormatter(value), title]}
                        />
                        <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#color${title})`} />
                    </AreaChart>
                )
            case "scatter":
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            name="Time"
                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                        />
                        <YAxis dataKey="value" name="Value" tickFormatter={valueFormatter} />
                        <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => [valueFormatter(value), title]}
                        />
                        <Scatter name={title} data={filteredData} fill={color} />
                    </ScatterChart>
                )
            case "composed":
                return (
                    <ComposedChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
                        <YAxis tickFormatter={valueFormatter} />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => [valueFormatter(value), title]}
                        />
                        <Legend />
                        <Bar dataKey="value" fill={color} name={`${title} (Bar)`} />
                        <Line type="monotone" dataKey="value" stroke={`${color}88`} name={`${title} (Line)`} />
                    </ComposedChart>
                )
            default:
                // Fallback to an empty AreaChart if chartType is invalid
                return (
                    <AreaChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
                        <YAxis tickFormatter={valueFormatter} />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => [valueFormatter(value), title]}
                        />
                        <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#color${title})`} />
                    </AreaChart>
                )
        }
    }

    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row text-purple-500 items-center font-semibold justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Select defaultValue="1h" onValueChange={(value) => setTimeRange(value)}>
                    <SelectTrigger className="w-[180px] bg-purple-500 text-white">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-500 text-white">
                        <SelectItem value="1h" className="hover:bg-purple-700">Last 1 hour</SelectItem>
                        <SelectItem value="6h" className="hover:bg-purple-700">Last 6 hours</SelectItem>
                        <SelectItem value="24h" className="hover:bg-purple-700">Last 24 hours</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailedChart