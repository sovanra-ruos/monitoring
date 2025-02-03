"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ClusterHealthIndicatorProps {
    health: number
}

export function ClusterHealthIndicator({ health }: ClusterHealthIndicatorProps) {
    const [color, setColor] = useState("#22c55e")

    useEffect(() => {
        if (health < 0.5) {
            setColor("#ef4444")
        } else if (health < 0.8) {
            setColor("#f59e0b")
        } else {
            setColor("#22c55e")
        }
    }, [health])

    return (
        <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${health * 283} 283` }}
                    transition={{ duration: 1 }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className={`text-2xl font-bold ${health * 100 < 50 ? "text-red-400" : "text-green-400"
                        }`}
                >
                    {`${(health * 100).toFixed(0)}%`}
                </span>
            </div>
        </div>
    )
}

