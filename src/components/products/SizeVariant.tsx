import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
interface SizeVariantProps {
  selectedSizes: { ma: number; ten: string }[]
  availableSizes: any[]
  sizeDialogOpen: boolean
  setSizeDialogOpen: (open: boolean) => void
  selectedSizeIds: number[]
  setSelectedSizeIds: (ids: number[]) => void
  onAddSizes: () => void
  onRemoveSize: (sizeId: number) => void
}

export function SizeVariant({
  selectedSizes,
  availableSizes,
  sizeDialogOpen,
  setSizeDialogOpen,
  selectedSizeIds,
  setSelectedSizeIds,
  onAddSizes,
  onRemoveSize,
}: SizeVariantProps) {
  return (
    <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Kích cỡ</CardTitle>
        <CardDescription>Chọn các kích cỡ có sẵn cho sản phẩm này</CardDescription>
      </div>
      <Dialog open={sizeDialogOpen} onOpenChange={setSizeDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm kích cỡ
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn kích cỡ</DialogTitle>
            <DialogDescription>Chọn các kích cỡ có sẵn cho sản phẩm này.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {availableSizes.map((size) => {
              const isSelected = selectedSizeIds.includes(size.ma)
              const isAlreadyAdded = selectedSizes.some((s) => s.ma === size.ma)

              return (
                <div
                  key={size.ma}
                  className={`flex items-center space-x-2 rounded-md border p-2 ${
                    isSelected ? "border-primary bg-primary/5" : ""
                  } ${isAlreadyAdded ? "opacity-50" : ""}`}
                >
                  <Checkbox
                    id={`size-${size.ma}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSizeIds([...selectedSizeIds, size.ma])
                      } else {
                        setSelectedSizeIds(selectedSizeIds.filter((id) => id !== size.ma))
                      }
                    }}
                    disabled={isAlreadyAdded}
                  />
                  <Label htmlFor={`size-${size.ma}`}>{size.ten}</Label>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={onAddSizes}>
              Thêm kích cỡ đã chọn
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </CardHeader>
    <CardContent>
      {selectedSizes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có kích cỡ nào được chọn. Nhấn &quot;Thêm kích cỡ&quot; để chọn kích cỡ cho sản phẩm này.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {selectedSizes.map((size) => (
            <Card key={size.ma} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-lg">{size.ten}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onRemoveSize(size.ma)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
  )
}