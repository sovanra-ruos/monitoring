import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"

interface MetricData {
    subject: string
    A: number
    B: number
}

interface MetricsRadarChartProps {
    title: string
    data: MetricData[]
}

export function MetricsRadarChart({ title, data }: MetricsRadarChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-purple-500 font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar name="Node A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Radar name="Node B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default MetricsRadarChart