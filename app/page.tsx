import MonitoringDashboard from "@/components/MonitoringDashboard";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center text-purple-500">Kubernetes Cluster Monitor</h1>
                <MonitoringDashboard />
            </div>
        </div>
    )
}



