"use client"

import type React from "react"

import { useState } from "react"
import { Trash2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

interface ColorVariantProps {
  id: string
  name: string
  colorCode: string
  onUpdate: (id: string, data: { name?: string; colorCode?: string }) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

export default function ColorVariant({ id, name, colorCode, onUpdate, onRemove, canRemove }: ColorVariantProps) {
  const [images, setImages] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      // In a real app, you would upload these to a storage service
      // For this example, we'll just create object URLs
      const imageUrl = URL.createObjectURL(file)
      newImages.push(imageUrl)
    })

    setImages([...images, ...newImages])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: colorCode }} />
                <Input
                  value={name}
                  onChange={(e) => onUpdate(id, { name: e.target.value })}
                  placeholder="Color name (e.g., Navy Blue)"
                  className="max-w-xs"
                />
              </div>

              {canRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor={`color-code-${id}`}>Color Code</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id={`color-code-${id}`}
                  type="color"
                  value={colorCode}
                  onChange={(e) => onUpdate(id, { colorCode: e.target.value })}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={colorCode}
                  onChange={(e) => onUpdate(id, { colorCode: e.target.value })}
                  placeholder="#000000"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Accordion type="single" collapsible defaultValue="images">
              <AccordionItem value="images" className="border-none">
                <AccordionTrigger className="py-0">Images for this color</AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      dragActive ? "border-primary bg-primary/5" : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Label htmlFor={`file-upload-${id}`} className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium">Drag & drop images or click to browse</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <Input
                        id={`file-upload-${id}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleChange}
                      />
                    </Label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Product ${name} - Image ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
