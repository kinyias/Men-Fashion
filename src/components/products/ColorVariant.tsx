import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { MauSacWithImages } from "@/types"
import Image from "next/image"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

interface ColorVariantProps {
  selectedColors: MauSacWithImages[]
  availableColors: any[]
  colorDialogOpen: boolean
  setColorDialogOpen: (open: boolean) => void
  selectedColorIds: number[]
  setSelectedColorIds: (ids: number[]) => void
  onAddColors: () => void
  onRemoveColor: (colorId: number) => void
  onAddImageToColor: (colorId: number, imageUrl: string) => void
  onRemoveImageFromColor: (colorId: number, imageId: number) => void
  onSetPrimaryImage: (colorId: number, imageId: number) => void
  onHandleImageUpload: (colorId: number, files: FileList | null) => void
  isUploading: boolean
  uploadProgress: number
}

export function ColorVariant({
  selectedColors,
  availableColors,
  colorDialogOpen,
  setColorDialogOpen,
  selectedColorIds,
  setSelectedColorIds,
  onAddColors,
  onRemoveColor,
  onHandleImageUpload,
  onRemoveImageFromColor,
  onSetPrimaryImage,
  isUploading,
  uploadProgress
}: ColorVariantProps) {
  return (
    <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Màu sắc</CardTitle>
        <CardDescription>Chọn các màu sắc có sẵn cho sản phẩm này</CardDescription>
      </div>
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
            <DialogDescription>Chọn các màu sắc có sẵn cho sản phẩm này.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {availableColors.map((color) => {
              const isSelected = selectedColorIds.includes(color.ma)
              const isAlreadyAdded = selectedColors.some((c) => c.ma === color.ma)

              return (
                <div
                  key={color.ma}
                  className={`flex items-center space-x-2 rounded-md border p-2 ${
                    isSelected ? "border-primary bg-primary/5" : ""
                  } ${isAlreadyAdded ? "opacity-50" : ""}`}
                >
                  <Checkbox
                    id={`color-${color.ma}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedColorIds([...selectedColorIds, color.ma])
                      } else {
                        setSelectedColorIds(selectedColorIds.filter((id) => id !== color.ma))
                      }
                    }}
                    disabled={isAlreadyAdded}
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.ma_mau }}></div>
                    <Label htmlFor={`color-${color.ma}`}>{color.ten}</Label>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={onAddColors}>
              Thêm màu đã chọn
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </CardHeader>
    <CardContent>
      {selectedColors.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có màu sắc nào được chọn. Nhấn &quot;Thêm màu sắc&quot; để chọn màu cho sản phẩm này.
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {selectedColors.map((color) => (
            <AccordionItem key={color.ma} value={`color-${color.ma}`} className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.ma_mau }}></div>
                  <span className="font-medium">{color.ten}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-0">
                <div className="flex justify-end mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveColor(color.ma)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa màu này
                  </Button>
                </div>

                {/* HinhAnhMauSac Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-4">Hình ảnh cho màu {color.ten}</h3>
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      onHandleImageUpload(color.ma, e.dataTransfer.files)
                    }}
                  >
                    <Label htmlFor={`file-upload-${color.ma}`} className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium">Kéo thả hình ảnh hoặc nhấn để chọn</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF tối đa 5MB</p>
                      </div>
                      <Input
                        id={`file-upload-${color.ma}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => onHandleImageUpload(color.ma, e.target.files)}
                      />
                      {isUploading && (
<div className="flex items-center gap-2">
<Progress value={uploadProgress} className="h-2 w-24" />
<span className="text-xs text-muted-foreground">{uploadProgress}%</span>
</div>
)}
                    </Label>
                  </div>

                  {color.hinhAnhs.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {color.hinhAnhs.map((image) => (
                        <div
                          key={image.ma}
                          className={`relative group border rounded-md p-1 ${
                            image.anhChinh ? "ring-2 ring-primary" : "hover:bg-muted/50"
                          }`}
                        >
                          <Image
                            src={image.hinhAnh || "/placeholder.svg"}
                            alt={`Sản phẩm ${color.ten} - Hình ${image.ma}`}
                            className="h-64 w-full object-cover rounded-md"
                            width={500}
                            height={300}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-md">
                            {!image.anhChinh && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="mr-2"
                                onClick={() => onSetPrimaryImage(color.ma, image.ma)}
                              >
                                Đặt làm ảnh chính
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onRemoveImageFromColor(color.ma, image.ma)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {image.anhChinh && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              Ảnh chính
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </CardContent>
  </Card>
  )
}