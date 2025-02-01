import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ServiceResource {
    pod: string
    cpu: number
    memory: number
}

interface ServiceResourceUsageProps {
    resources: ServiceResource[]
}

export function ServiceResourceUsage({ resources }: ServiceResourceUsageProps) {
    const formatCPU = (cpu: number) => `${(cpu * 100).toFixed(2)}%`
    const formatMemory = (memory: number) => {
        const sizes = ["B", "KB", "MB", "GB", "TB"]
        if (memory === 0) return "0 B"
        const i = Math.floor(Math.log(memory) / Math.log(1024))
        return `${(memory / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Resource Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pod</TableHead>
                            <TableHead>CPU Usage</TableHead>
                            <TableHead>Memory Usage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resources.map((resource) => (
                            <TableRow key={resource.pod}>
                                <TableCell>{resource.pod}</TableCell>
                                <TableCell>{formatCPU(resource.cpu)}</TableCell>
                                <TableCell>{formatMemory(resource.memory)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ServiceResourceUsage