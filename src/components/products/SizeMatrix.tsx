"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SizeMatrixProps {
  colors: Array<{ id: string; name: string; colorCode: string }>
  sizes: Array<{ id: string; name: string }>
}

interface InventoryItem {
  colorId: string
  sizeId: string
  stock: number
  price: string
  sku: string
  enabled: boolean
}

export default function SizeMatrix({ colors, sizes }: SizeMatrixProps) {
  // Initialize inventory matrix with default values
  const [inventory, setInventory] = useState<InventoryItem[]>(
    colors.flatMap((color) =>
      sizes.map((size) => ({
        colorId: color.id,
        sizeId: size.id,
        stock: 0,
        price: "",
        sku: `${color.name.substring(0, 3).toUpperCase()}-${size.name}-${Math.floor(Math.random() * 1000)}`,
        enabled: true,
      })),
    ),
  )

  const getInventoryItem = (colorId: string, sizeId: string) => {
    return (
      inventory.find((item) => item.colorId === colorId && item.sizeId === sizeId) || {
        colorId,
        sizeId,
        stock: 0,
        price: "",
        sku: "",
        enabled: true,
      }
    )
  }

  const updateInventoryItem = (colorId: string, sizeId: string, data: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) => (item.colorId === colorId && item.sizeId === sizeId ? { ...item, ...data } : item)),
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Color / Size</TableHead>
            {sizes.map((size) => (
              <TableHead key={size.id}>{size.name || "Unnamed"}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((color) => (
            <TableRow key={color.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.colorCode }} />
                  {color.name || "Unnamed"}
                </div>
              </TableCell>

              {sizes.map((size) => {
                const item = getInventoryItem(color.id, size.id)

                return (
                  <TableCell key={size.id} className="p-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`enabled-${color.id}-${size.id}`} className="text-xs">
                          Available
                        </Label>
                        <Switch
                          id={`enabled-${color.id}-${size.id}`}
                          checked={item.enabled}
                          onCheckedChange={(checked) => updateInventoryItem(color.id, size.id, { enabled: checked })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`stock-${color.id}-${size.id}`} className="text-xs">
                            Stock
                          </Label>
                          <Input
                            id={`stock-${color.id}-${size.id}`}
                            type="number"
                            min="0"
                            value={item.stock}
                            onChange={(e) =>
                              updateInventoryItem(color.id, size.id, {
                                stock: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className="h-8"
                            disabled={!item.enabled}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`price-${color.id}-${size.id}`} className="text-xs">
                            Price ($)
                          </Label>
                          <Input
                            id={`price-${color.id}-${size.id}`}
                            value={item.price}
                            onChange={(e) => updateInventoryItem(color.id, size.id, { price: e.target.value })}
                            placeholder="Optional"
                            className="h-8"
                            disabled={!item.enabled}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`sku-${color.id}-${size.id}`} className="text-xs">
                          SKU
                        </Label>
                        <Input
                          id={`sku-${color.id}-${size.id}`}
                          value={item.sku}
                          onChange={(e) => updateInventoryItem(color.id, size.id, { sku: e.target.value })}
                          className="h-8 text-xs"
                          disabled={!item.enabled}
                        />
                      </div>
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
