"use client"

import { formatCurrency } from "@/utils/currency"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Tháng 3", total: 1500 },
  { name: "Tháng 4", total: 2300 },
  { name: "Tháng 5", total: 3200 },

]

export function SalesChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Đang tải...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} tickFormatter={(value) => `${formatCurrency(Number(value))}`} />
        <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} formatter={(value) => [`${formatCurrency(Number(value))}`, "Bán"]} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  )
}
