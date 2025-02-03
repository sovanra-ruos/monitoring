import MonitoringDashboard from "@/components/MonitoringDashboard";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600 drop-shadow-lg">
                    Kubernetes Cluster Monitor
                </h1>
                <MonitoringDashboard />
            </div>
        </div>
    )
}



