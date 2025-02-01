import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PodServiceInfoProps {
    podCount: number
    serviceCount: number
}

export function PodServiceInfo({ podCount, serviceCount }: PodServiceInfoProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Pods</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{podCount}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{serviceCount}</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default PodServiceInfo