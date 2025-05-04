"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Plus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SimpleEditor } from "../tiptap/tiptap-templates/simple/simple-editor"
import Image from "next/image"

// Schema matches the Products table
const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên sản phẩm phải có ít nhất 2 kí tự.",
  }),
  description: z.string().min(10, {
    message: "Mô tả phải có ít nhất 10 kí tự.",
  }),
  base_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Giá phải là số dương.",
  }),
  sale_price: z.string().optional(),
  category_id: z.string({
    required_error: "Vui lòng chọn danh mục.",
  }),
  brand_id: z.string({
    required_error: "Vui lòng chọn thương hiệu.",
  }),
  is_active: z.boolean(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

// Sample data for categories and brands
const categories = [
  { id: "1", name: "T-Shirts" },
  { id: "2", name: "Jeans" },
  { id: "3", name: "Dresses" },
  { id: "4", name: "Jackets" },
  { id: "5", name: "Shoes" },
]

const brands = [
  { id: "1", name: "Fashion Brand A" },
  { id: "2", name: "Fashion Brand B" },
  { id: "3", name: "Fashion Brand C" },
  { id: "4", name: "Fashion Brand D" },
]

// Sample data for colors
const sampleColors = [
  { id: "1", name: "Black", hex: "#000000" },
  { id: "2", name: "White", hex: "#FFFFFF" },
  { id: "3", name: "Navy Blue", hex: "#000080" },
  { id: "4", name: "Red", hex: "#FF0000" },
  { id: "5", name: "Green", hex: "#008000" },
  { id: "6", name: "Yellow", hex: "#FFFF00" },
  { id: "7", name: "Purple", hex: "#800080" },
  { id: "8", name: "Pink", hex: "#FFC0CB" },
  { id: "9", name: "Gray", hex: "#808080" },
  { id: "10", name: "Brown", hex: "#A52A2A" },
  { id: "11", name: "Orange", hex: "#FFA500" },
  { id: "12", name: "Teal", hex: "#008080" },
]

// Sample data for sizes
const sampleSizes = [
  { id: "1", name: "XS", code: "XS" },
  { id: "2", name: "S", code: "S" },
  { id: "3", name: "M", code: "M" },
  { id: "4", name: "L", code: "L" },
  { id: "5", name: "XL", code: "XL" },
  { id: "6", name: "XXL", code: "XXL" },
  { id: "7", name: "28", code: "W28" },
  { id: "8", name: "30", code: "W30" },
  { id: "9", name: "32", code: "W32" },
  { id: "10", name: "34", code: "W34" },
  { id: "11", name: "36", code: "W36" },
  { id: "12", name: "38", code: "W38" },
]

// Interface for ProductColors
interface ProductColor {
  color_id: string
  color_name: string
  color_hex: string
  is_available: boolean
  images: ProductImage[]
}

// Interface for ProductImages
interface ProductImage {
  image_id: string
  image_url: string
  is_primary: boolean
  sort_order: number
}

// Interface for ProductSizes
interface ProductSize {
  size_id: string
  size_name: string
  size_code: string
  stock_quantity: number
}

// Interface for ProductColorSizes (inventory matrix)
interface ProductColorSize {
  color_id: string
  size_id: string
  sku: string
  price: string
  stock_quantity: number
}

export default function ProductForm() {
  // State for ProductColors
  const [colors, setColors] = useState<ProductColor[]>([])

  // State for ProductSizes
  const [sizes, setSizes] = useState<ProductSize[]>([])

  // State for ProductColorSizes (inventory matrix)
  const [inventory, setInventory] = useState<ProductColorSize[]>([])

  // State for color selection dialog
  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>([])

  // State for size selection dialog
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false)
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      base_price: "",
      sale_price: "",
      category_id: "",
      brand_id: "",
      is_active: true,
    },
  })

  function onSubmit(data: ProductFormValues) {
    // In a real application, you would send this data to your API
    console.log("Form submitted:", data)
    console.log("Colors:", colors)
    console.log("Sizes:", sizes)
    console.log("Inventory:", inventory)

    // Show success message
    alert("Product created successfully!")
  }

  // Function to add selected colors
  const addSelectedColors = () => {
    const newColors = selectedColorIds
      .filter((id) => !colors.some((color) => color.color_id === id))
      .map((id) => {
        const sampleColor = sampleColors.find((color) => color.id === id)!
        return {
          color_id: sampleColor.id,
          color_name: sampleColor.name,
          color_hex: sampleColor.hex,
          is_available: true,
          images: [],
        }
      })

    if (newColors.length > 0) {
      const updatedColors = [...colors, ...newColors]
      setColors(updatedColors)

      // Update inventory for new colors
      const newInventoryItems = newColors.flatMap((color) =>
        sizes.map((size) => ({
          color_id: color.color_id,
          size_id: size.size_id,
          sku: `${color.color_name.substring(0, 3).toUpperCase()}-${size.size_name}-${Math.floor(Math.random() * 1000)}`,
          price: "",
          stock_quantity: 0,
        })),
      )

      setInventory([...inventory, ...newInventoryItems])
    }

    setColorDialogOpen(false)
  }

  // Function to add selected sizes
  const addSelectedSizes = () => {
    const newSizes = selectedSizeIds
      .filter((id) => !sizes.some((size) => size.size_id === id))
      .map((id) => {
        const sampleSize = sampleSizes.find((size) => size.id === id)!
        return {
          size_id: sampleSize.id,
          size_name: sampleSize.name,
          size_code: sampleSize.code,
          stock_quantity: 0,
        }
      })

    if (newSizes.length > 0) {
      const updatedSizes = [...sizes, ...newSizes]
      setSizes(updatedSizes)

      // Update inventory for new sizes
      const newInventoryItems = newSizes.flatMap((size) =>
        colors.map((color) => ({
          color_id: color.color_id,
          size_id: size.size_id,
          sku: `${color.color_name.substring(0, 3).toUpperCase()}-${size.size_name}-${Math.floor(Math.random() * 1000)}`,
          price: "",
          stock_quantity: 0,
        })),
      )

      setInventory([...inventory, ...newInventoryItems])
    }

    setSizeDialogOpen(false)
  }

  // Function to remove a color
  const removeColor = (colorId: string) => {
    setColors(colors.filter((color) => color.color_id !== colorId))
    // Also remove from inventory
    setInventory(inventory.filter((item) => item.color_id !== colorId))
  }

  // Function to remove a size
  const removeSize = (sizeId: string) => {
    setSizes(sizes.filter((size) => size.size_id !== sizeId))
    // Also remove from inventory
    setInventory(inventory.filter((item) => item.size_id !== sizeId))
  }

  // Functions for managing images
  const addImage = (colorId: string, imageUrl: string) => {
    setColors(
      colors.map((color) => {
        if (color.color_id === colorId) {
          const newImages = [...color.images]
          const newImageId = (newImages.length + 1).toString()
          newImages.push({
            image_id: newImageId,
            image_url: imageUrl,
            is_primary: newImages.length === 0, // First image is primary
            sort_order: newImages.length,
          })
          return { ...color, images: newImages }
        }
        return color
      }),
    )
  }

  const removeImage = (colorId: string, imageId: string) => {
    setColors(
      colors.map((color) => {
        if (color.color_id === colorId) {
          const newImages = color.images.filter((img) => img.image_id !== imageId)
          // If we removed the primary image, make the first one primary
          if (newImages.length > 0 && !color.images.find((img) => img.image_id === imageId)?.is_primary) {
            newImages[0].is_primary = true
          }
          return { ...color, images: newImages }
        }
        return color
      }),
    )
  }

  const setPrimaryImage = (colorId: string, imageId: string) => {
    setColors(
      colors.map((color) => {
        if (color.color_id === colorId) {
          const newImages = color.images.map((img) => ({
            ...img,
            is_primary: img.image_id === imageId,
          }))
          return { ...color, images: newImages }
        }
        return color
      }),
    )
  }

  // Function for updating color availability
//   const updateColorAvailability = (colorId: string, isAvailable: boolean) => {
//     setColors(colors.map((color) => (color.color_id === colorId ? { ...color, is_available: isAvailable } : color)))
//   }

  // Function for updating size stock quantity
//   const updateSizeStock = (sizeId: string, stockQuantity: number) => {
//     setSizes(sizes.map((size) => (size.size_id === sizeId ? { ...size, stock_quantity: stockQuantity } : size)))
//   }

  // Function for managing inventory
  const updateInventoryItem = (colorId: string, sizeId: string, data: Partial<ProductColorSize>) => {
    setInventory((prev) =>
      prev.map((item) => (item.color_id === colorId && item.size_id === sizeId ? { ...item, ...data } : item)),
    )
  }

  const getInventoryItem = (colorId: string, sizeId: string) => {
    return (
      inventory.find((item) => item.color_id === colorId && item.size_id === sizeId) || {
        color_id: colorId,
        size_id: sizeId,
        sku: "",
        price: "",
        stock_quantity: 0,
      }
    )
  }

  // Image upload handling
  const handleImageUpload = (colorId: string, files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      // In a real app, you would upload these to a storage service
      // For this example, we'll just create object URLs
      const imageUrl = URL.createObjectURL(file)
      addImage(colorId, imageUrl)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Products Table Section */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Áo thun cổ điển" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (đ)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sale_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá giảm (đ)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" placeholder="0" {...field} />
                      </FormControl>
                      {/* <FormDescription>Tùy chọn</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thương hiệu</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thương hiệu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                       <div className="border">
                       <SimpleEditor onChange={field.onChange} />
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Trạng thái</FormLabel>
                      <FormDescription>Ẩn/hiện sản phẩm</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ProductColors Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Màu sắc</CardTitle>
            <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                    Thêm màu sắc
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Chọn màu sắc</DialogTitle>
                  <DialogDescription>Chọn màu sắc cho sản phẩm.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {sampleColors.map((color) => {
                    const isSelected = selectedColorIds.includes(color.id)
                    const isAlreadyAdded = colors.some((c) => c.color_id === color.id)

                    return (
                      <div
                        key={color.id}
                        className={`flex items-center space-x-2 rounded-md border p-2 ${
                          isSelected ? "border-primary bg-primary/5" : ""
                        } ${isAlreadyAdded ? "opacity-50" : ""}`}
                      >
                        <Checkbox
                          id={`color-${color.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedColorIds([...selectedColorIds, color.id])
                            } else {
                              setSelectedColorIds(selectedColorIds.filter((id) => id !== color.id))
                            }
                          }}
                          disabled={isAlreadyAdded}
                        />
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                          <Label htmlFor={`color-${color.id}`}>{color.name}</Label>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={addSelectedColors}>
                    Thêm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {colors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa chọn màu sắc nào. Vui lòng nhấn &quot;Thêm màu sắc&quot; để chọn màu cho sản phẩm.
              </div>
            ) : (
              <div className="space-y-6">
                {colors.map((color) => (
                  <div key={color.color_id} className="border rounded-lg p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: color.color_hex }}
                            ></div>
                            <span className="font-medium">{color.color_name}</span>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColor(color.color_id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </Button>
                        </div>

                        {/* <div className="flex items-center space-x-2">
                          <Switch
                            id={`available-${color.color_id}`}
                            checked={color.is_available}
                            onCheckedChange={(checked: boolean) => updateColorAvailability(color.color_id, checked)}
                          />
                          <Label htmlFor={`available-${color.color_id}`}>Available for purchase</Label>
                        </div> */}
                      </div>
                    </div>

                    {/* ProductImages Section */}
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-4">Hình ảnh cho {color.color_name}</h3>
                      <div
                        className="border-2 border-dashed rounded-lg p-4 text-center"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          handleImageUpload(color.color_id, e.dataTransfer.files)
                        }}
                      >
                        <Label htmlFor={`file-upload-${color.color_id}`} className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center py-4">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm font-medium">Drag & drop images or click to browse</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </div>
                          <Input
                            id={`file-upload-${color.color_id}`}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleImageUpload(color.color_id, e.target.files)}
                          />
                        </Label>
                      </div>

                      {color.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {color.images.map((image) => (
                            <div
                              key={image.image_id}
                              className={`relative group border rounded-md p-1 ${
                                image.is_primary ? "ring-2 ring-primary" : "hover:bg-muted/50"
                              }`}
                            >
                              <Image
                                src={image.image_url || "/placeholder.svg"}
                                alt={`Product ${color.color_name} - Image ${image.image_id}`}
                                className="h-32 w-full object-cover rounded-md"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-md">
                                {!image.is_primary && (
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => setPrimaryImage(color.color_id, image.image_id)}
                                  >
                                    Chọn làm ảnh đại diện
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeImage(color.color_id, image.image_id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              {image.is_primary && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                  Ảnh đại điẹn
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ProductSizes Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kích thước</CardTitle>
            <Dialog open={sizeDialogOpen} onOpenChange={setSizeDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm kích thước
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chọn kích thước</DialogTitle>
                  <DialogDescription>Chọn kích thước cho sản phẩm.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                  {sampleSizes.map((size) => {
                    const isSelected = selectedSizeIds.includes(size.id)
                    const isAlreadyAdded = sizes.some((s) => s.size_id === size.id)

                    return (
                      <div
                        key={size.id}
                        className={`flex items-center space-x-2 rounded-md border p-2 ${
                          isSelected ? "border-primary bg-primary/5" : ""
                        } ${isAlreadyAdded ? "opacity-50" : ""}`}
                      >
                        <Checkbox
                          id={`size-${size.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSizeIds([...selectedSizeIds, size.id])
                            } else {
                              setSelectedSizeIds(selectedSizeIds.filter((id) => id !== size.id))
                            }
                          }}
                          disabled={isAlreadyAdded}
                        />
                        <Label htmlFor={`size-${size.id}`}>{size.name}</Label>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={addSelectedSizes}>
                   Thêm kích thước đã chọn
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {sizes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
               Chưa chọn kích thước nào. Vui lòng nhấn &quot;Thêm kích thước&quot; để chọn màu cho sản phẩm.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sizes.map((size) => (
                  <Card key={size.size_id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-medium">{size.size_name}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeSize(size.size_id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">Mã: {size.size_code}</div>
                      {/* <Label htmlFor={`size-stock-${size.size_id}`} className="block mb-2">
                        Default Stock Quantity
                      </Label>
                      <Input
                        id={`size-stock-${size.size_id}`}
                        type="number"
                        min="0"
                        value={size.stock_quantity}
                        onChange={(e) => updateSizeStock(size.size_id, Number.parseInt(e.target.value) || 0)}
                        placeholder="0"
                      /> */}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ProductColorSizes Section (Inventory Matrix) */}
        {colors.length > 0 && sizes.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sô lượng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Màu sắc / kích thước</TableHead>
                      {sizes.map((size) => (
                        <TableHead key={size.size_id}>{size.size_name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colors.map((color) => (
                      <TableRow key={color.color_id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.color_hex }} />
                            {color.color_name}
                          </div>
                        </TableCell>

                        {sizes.map((size) => {
                          const item = getInventoryItem(color.color_id, size.size_id)

                          return (
                            <TableCell key={size.size_id} className="p-2">
                              <div className="space-y-2">
                                {/* <div>
                                  <Label htmlFor={`sku-${color.color_id}-${size.size_id}`} className="text-xs">
                                    SKU
                                  </Label>
                                  <Input
                                    id={`sku-${color.color_id}-${size.size_id}`}
                                    value={item.sku}
                                    onChange={(e) =>
                                      updateInventoryItem(color.color_id, size.size_id, { sku: e.target.value })
                                    }
                                    className="h-8 text-xs"
                                  />
                                </div> */}

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor={`stock-${color.color_id}-${size.size_id}`} className="text-xs">
                                      Số lượng
                                    </Label>
                                    <Input
                                      id={`stock-${color.color_id}-${size.size_id}`}
                                      type="number"
                                      min="0"
                                      value={item.stock_quantity}
                                      onChange={(e) =>
                                        updateInventoryItem(color.color_id, size.size_id, {
                                          stock_quantity: Number.parseInt(e.target.value) || 0,
                                        })
                                      }
                                      className="h-8"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor={`price-${color.color_id}-${size.size_id}`} className="text-xs">
                                      Giá (đ)
                                    </Label>
                                    <Input
                                      id={`price-${color.color_id}-${size.size_id}`}
                                      value={item.price}
                                      onChange={(e) =>
                                        updateInventoryItem(color.color_id, size.size_id, { price: e.target.value })
                                      }
                                      placeholder="Tùy chọn"
                                      className="h-8"
                                    />
                                  </div>
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
            </CardContent>
          </Card>
        ) : (
          colors.length > 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Vui lòng thêm kích thước để tạo biến thể.
              </CardContent>
            </Card>
          )
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  )
}
