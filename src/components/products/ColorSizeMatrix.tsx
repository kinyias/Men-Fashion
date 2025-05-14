import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { BienThe, MauSacWithImages } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
interface ColorSizeMatrixProps {
  selectedColors: MauSacWithImages[]
  selectedSizes: { ma: number; ten: string }[]
  variants: BienThe[]
  onUpdateVariant: (colorId: number, sizeId: number, data: { gia?: string; soluong?: number }) => void
}

export function ColorSizeMatrix({
  selectedColors,
  selectedSizes,
  variants,
  onUpdateVariant,
}: ColorSizeMatrixProps) {
  const getVariant = (colorId: number, sizeId: number) => {
    return variants.find(
      (variant) => variant.mamausac === colorId && variant.makichco === sizeId
    ) || {
      ma: 0,
      gia: null,
      soluong: 0,
      masp: 0,
      mamausac: colorId,
      makichco: sizeId,
    }
  }

  return (
    <Card>
            <CardHeader>
              <CardTitle>Quản lý tồn kho</CardTitle>
              <CardDescription>Thiết lập giá và số lượng cho từng biến thể màu sắc/kích cỡ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Màu / Kích cỡ</TableHead>
                      {selectedSizes.map((size) => (
                        <TableHead key={size.ma}>{size.ten}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedColors.map((color) => (
                      <TableRow key={color.ma}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.ma_mau }} />
                            {color.ten}
                          </div>
                        </TableCell>

                        {selectedSizes.map((size) => {
                          const variant = getVariant(color.ma, size.ma)

                          return (
                            <TableCell key={size.ma} className="p-2">
                              <div className="space-y-2">
                                <div>
                                  <Label htmlFor={`gia-${color.ma}-${size.ma}`} className="text-xs">
                                    Giá (VNĐ)
                                  </Label>
                                  <Input
                                    id={`gia-${color.ma}-${size.ma}`}
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={variant.gia || undefined}
                                    onChange={(e) => onUpdateVariant(color.ma, size.ma, { gia: e.target.value })}
                                    className="h-8"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`soluong-${color.ma}-${size.ma}`} className="text-xs">
                                    Số lượng
                                  </Label>
                                  <Input
                                    id={`soluong-${color.ma}-${size.ma}`}
                                    type="number"
                                    min="0"
                                    value={variant.soluong}
                                    onChange={(e) =>
                                      onUpdateVariant(color.ma, size.ma, {
                                        soluong: Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="h-8"
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
            </CardContent>
          </Card>
  )
}