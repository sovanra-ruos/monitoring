import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface TopPod {
    pod: string
    value: number
}

interface TopResourcePodsProps {
    cpuPods: TopPod[]
    memoryPods: TopPod[]
}

export function TopResourcePods({ cpuPods, memoryPods }: TopResourcePodsProps) {
    const formatCPU = (cpu: number) => `${(cpu * 100).toFixed(2)}%`
    const formatMemory = (memory: number) => {
        const sizes = ["B", "KB", "MB", "GB", "TB"]
        if (memory === 0) return "0 B"
        const i = Math.floor(Math.log(memory) / Math.log(1024))
        return `${(memory / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-500 font-semibold">Top CPU Consuming Pods</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cpuPods} layout="vertical">
                                <XAxis type="number" tickFormatter={formatCPU} />
                                <YAxis type="category" dataKey="pod" width={150} />
                                <Tooltip formatter={(value: number) => formatCPU(value)} />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pod</TableHead>
                                <TableHead>CPU Usage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cpuPods.map((pod) => (
                                <TableRow key={pod.pod}>
                                    <TableCell>{pod.pod}</TableCell>
                                    <TableCell>{formatCPU(pod.value)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-500 font-semibold">Top Memory Consuming Pods</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={memoryPods} layout="vertical">
                                <XAxis type="number" tickFormatter={formatMemory} />
                                <YAxis type="category" dataKey="pod" width={150} />
                                <Tooltip formatter={(value: number) => formatMemory(value)} />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pod</TableHead>
                                <TableHead>Memory Usage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {memoryPods.map((pod) => (
                                <TableRow key={pod.pod}>
                                    <TableCell>{pod.pod}</TableCell>
                                    <TableCell>{formatMemory(pod.value)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default TopResourcePods