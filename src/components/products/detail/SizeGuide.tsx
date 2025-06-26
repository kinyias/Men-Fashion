import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface SizeGuideProps {
  onClose: () => void;
}

export const topSizeChart = [
  { size: "XS", chest: "86-91", waist: "71-76", hips: "86-91", height: "150-155", weight: "40-45" },
  { size: "S", chest: "91-97", waist: "76-81", hips: "91-97", height: "155-160", weight: "45-50" },
  { size: "M", chest: "97-102", waist: "81-86", hips: "97-102", height: "160-165", weight: "50-60" },
  { size: "L", chest: "102-107", waist: "86-91", hips: "102-107", height: "165-170", weight: "60-70" },
  { size: "XL", chest: "107-112", waist: "91-97", hips: "107-112", height: "170-175", weight: "70-80" },
  { size: "XXL", chest: "112-117", waist: "97-102", hips: "112-117", height: "175-180", weight: "80-90" },
];

export const pantsSizeChart = [
  { size: "28", waist: "71-73", hips: "84-86", height: "160-165", weight: "50-55" },
  { size: "29", waist: "73-75", hips: "86-88", height: "162-167", weight: "55-58" },
  { size: "30", waist: "75-77", hips: "88-90", height: "165-170", weight: "58-62" },
  { size: "31", waist: "77-79", hips: "90-92", height: "167-172", weight: "62-65" },
  { size: "32", waist: "79-81", hips: "92-94", height: "170-175", weight: "65-70" },
  { size: "33", waist: "81-83", hips: "94-96", height: "172-177", weight: "70-75" },
  { size: "34", waist: "83-85", hips: "96-98", height: "175-180", weight: "75-80" },
  { size: "35", waist: "85-88", hips: "98-100", height: "177-182", weight: "80-85" },
];

export function SizeGuide({ onClose }: SizeGuideProps) {

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl w-[95vw] overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bảng kích thước</DialogTitle>
          <DialogDescription>
            Tìm kích thước phù hợp với bạn qua bảng kích thước chi tiết bên dưới.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tops">
          <TabsList className="w-full grid grid-cols-2 gap-2">
            <TabsTrigger value="tops">Áo</TabsTrigger>
            <TabsTrigger value="pants">Quần</TabsTrigger>
          </TabsList>

          {/* Áo */}
          <TabsContent value="tops" className="mt-4">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Cỡ</TableHead>
                  <TableHead>Ngực</TableHead>
                  <TableHead>Eo</TableHead>
                  <TableHead>Mông</TableHead>
                  <TableHead>Chiều cao</TableHead>
                  <TableHead>Cân nặng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSizeChart.map((item) => (
                  <TableRow key={item.size}>
                    <TableCell className="font-medium">{item.size}</TableCell>
                    <TableCell>{item.chest}</TableCell>
                    <TableCell>{item.waist}</TableCell>
                    <TableCell>{item.hips}</TableCell>
                    <TableCell>{item.height}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Quần */}
          <TabsContent value="pants" className="mt-4">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Cỡ</TableHead>
                  <TableHead>Eo</TableHead>
                  <TableHead>Mông</TableHead>
                  <TableHead>Chiều cao</TableHead>
                  <TableHead>Cân nặng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pantsSizeChart.map((item) => (
                  <TableRow key={item.size}>
                    <TableCell className="font-medium">{item.size}</TableCell>
                    <TableCell>{item.waist}</TableCell>
                    <TableCell>{item.hips}</TableCell>
                    <TableCell>{item.height}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

        </Tabs>
        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Cách đo kích thước</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Áo - Ngực:</strong> Đo quanh phần đầy nhất của ngực, giữ thước đo ngang.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Áo - Eo:</strong> Đo quanh vòng eo tự nhiên, giữ thước đo hơi lỏng một chút.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Quần - Vòng eo:</strong> Đo quanh vòng eo nơi bạn thường đeo quần.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Quần - Vòng mông:</strong> Đo quanh phần đầy nhất của mông.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Quần - Độ dài ống:</strong> Đo từ đáy quần đến gót chân hoặc vị trí mong muốn.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
