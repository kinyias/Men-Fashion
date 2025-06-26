'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Ruler,
  Shirt,
  User,
  Calculator,
  Info,
  Weight,
  RotateCcw,
} from 'lucide-react';
import { analyzeSizeWithGemini, SizeAnalysisResult } from '@/lib/gemini';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const sizeCharts = {
  shirts: {
    title: 'Áo',
    headers: [
      'Cỡ',
      'Ngực (cm)',
      'Eo (cm)',
      'Mông (cm)',
      'Chiều cao (cm)',
      'Cân nặng (kg)',
    ],
    data: [
      ['XS', '86-91', '71-76', '86-91', '150-155', '40-45'],
      ['S', '91-97', '76-81', '91-97', '155-160', '45-50'],
      ['M', '97-102', '81-86', '97-102', '160-165', '50-60'],
      ['L', '102-107', '86-91', '102-107', '165-170', '60-70'],
      ['XL', '107-112', '91-97', '107-112', '170-175', '70-80'],
      ['XXL', '112-117', '97-102', '112-117', '175-180', '80-90'],
    ],
  },
  pants: {
    title: 'Quần',
    headers: ['Cỡ', 'Eo (cm)', 'Mông (cm)', 'Chiều cao (cm)', 'Cân nặng (kg)'],
    data: [
      ['28', '71-73', '84-86', '160-165', '50-55'],
      ['29', '73-75', '86-88', '162-167', '55-58'],
      ['30', '75-77', '88-90', '165-170', '58-62'],
      ['31', '77-79', '90-92', '167-172', '62-65'],
      ['32', '79-81', '92-94', '170-175', '65-70'],
      ['33', '81-83', '94-96', '172-177', '70-75'],
      ['34', '83-85', '96-98', '175-180', '75-80'],
      ['35', '85-88', '98-100', '177-182', '80-85'],
    ],
  },
  suits: {
    title: 'Vest & Áo khoác',
    headers: ['Kích cỡ', 'Ngực (inch)', 'Eo (inch)', 'Chiều dài', 'Vai (inch)'],
    data: [
      ['36R', '36', '30', 'Thường', '17.5'],
      ['38R', '38', '32', 'Thường', '18'],
      ['40R', '40', '34', 'Thường', '18.5'],
      ['42R', '42', '36', 'Thường', '19'],
      ['44R', '44', '38', 'Thường', '19.5'],
      ['46R', '46', '40', 'Thường', '20'],
      ['48R', '48', '42', 'Thường', '20.5'],
    ],
  },
};

const measurementTips = [
  {
    title: 'Đo vòng ngực',
    description:
      'Đo quanh phần đầy nhất của ngực, giữ thước dây song song với mặt đất.',
    icon: '📏',
  },
  {
    title: 'Đo vòng eo',
    description: 'Đo quanh vòng eo tự nhiên, thường nằm ngay trên xương hông.',
    icon: '📐',
  },
  {
    title: 'Đo vòng cổ',
    description: 'Đo quanh gốc cổ nơi cổ áo sẽ nằm.',
    icon: '📏',
  },
  {
    title: 'Đo chiều dài tay áo',
    description: 'Đo từ giữa cổ sau gáy đến cổ tay khi tay hơi cong.',
    icon: '📐',
  },
  {
    title: 'Đo chiều dài ống quần',
    description: 'Đo từ đũng quần xuống đến vị trí bạn muốn quần kết thúc.',
    icon: '📏',
  },
  {
    title: 'Đo chiều rộng vai',
    description: 'Đo từ điểm vai này sang vai kia phía sau lưng.',
    icon: '📐',
  },
];

export default function SizeGuidePage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyType, setBodyType] = useState('regular');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SizeAnalysisResult | null>(null);

  const handleSubmit = async () => {
    if (!height || !weight || !bodyType) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeSizeWithGemini(
        Number(height),
        Number(weight),
        bodyType
      );
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing size:', error);
      alert('Failed to analyze size. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setBodyType('');
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Ruler className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-4xl font-bold mb-4">Bảng hướng dẫn kích cỡ</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tìm kích cỡ phù hợp với bạn qua bảng số đo và hướng dẫn chi tiết
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* How to Measure Section */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-black text-white p-2 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl">Cách đo số đo cơ thể</CardTitle>
                <CardDescription>
                  Làm theo các bước sau để có số đo chính xác nhất
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {measurementTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl">{tip.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="mt-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Lưu ý:</strong> Để có số đo chính xác nhất, hãy nhờ
                người khác hỗ trợ đo, mặc đồ lót vừa vặn và giữ thước dây vừa
                phải, không quá chặt.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
 {/* Size Charts */}
 <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-black text-white p-2 rounded-lg">
                <Shirt className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl">Bảng kích cỡ</CardTitle>
                <CardDescription>
                  Thông số chi tiết cho tất cả các loại trang phục
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="shirts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shirts">Áo</TabsTrigger>
                <TabsTrigger value="pants">Quần</TabsTrigger>
              </TabsList>

              {Object.entries(sizeCharts).map(([key, chart]) => (
                <TabsContent key={key} value={key} className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{chart.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            {chart.headers.map((header, index) => (
                              <th
                                key={index}
                                className="border border-gray-300 px-4 py-2 text-left font-semibold"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {chart.data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="border border-gray-300 px-4 py-2"
                                >
                                  {cellIndex === 0 ? (
                                    <Badge
                                      variant="outline"
                                      className="font-semibold"
                                    >
                                      {cell}
                                    </Badge>
                                  ) : (
                                    cell
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        {/* Size Calculator */}
        <Card className="mt-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-black text-white p-2 rounded-lg">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl">Tính toán kích cỡ</CardTitle>
                <CardDescription>
                  Nhập số đo của bạn để nhận gợi ý kích cỡ phù hợp
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* Description */}
              <div className="text-sm text-muted-foreground">
                Chúng tôi sẽ đề xuất kích cỡ phù hợp dựa trên chiều cao, cân
                nặng và kiểu thân hình của bạn.
              </div>

              {/* Height and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Chiều cao (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="50 - 260"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="50"
                    max="260"
                  />
                  {height &&
                    (Number.parseInt(height) < 100 ||
                      Number.parseInt(height) > 260) && (
                      <p className="text-xs text-red-600">
                        Vui lòng nhập chiều cao từ 100-260 cm
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    Cân nặng (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="10 - 200"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="10"
                    max="200"
                  />
                  {weight &&
                    (Number.parseInt(weight) < 10 ||
                      Number.parseInt(weight) > 200) && (
                      <p className="text-xs text-red-600">
                        Vui lòng nhập cân nặng từ 10-200 kg
                      </p>
                    )}
                </div>
              </div>

              {/* Validation Messages */}
              {height && weight && (
                <div className="text-xs text-muted-foreground">
                  <p>Vui lòng nhập chiều cao từ 100-260 cm</p>
                  <p>Vui lòng nhập cân nặng từ 10-200 kg</p>
                </div>
              )}

              <Separator />

              {/* Body Type Selection */}
              <div className="space-y-4">
                <Label>Kiểu thân hình và sở thích</Label>
                <RadioGroup value={bodyType} onValueChange={setBodyType}>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slim" id="slim" />
                      </div>
                      <div className="text-center">
                        <Label
                          htmlFor="slim"
                          className="text-xs cursor-pointer"
                        >
                          Bó sát
                        </Label>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="regular" />
                      </div>
                      <div className="text-center">
                        <Label
                          htmlFor="regular"
                          className="text-xs cursor-pointer"
                        >
                          Tiêu chuẩn
                        </Label>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wide" id="wide" />
                      </div>
                      <div className="text-center">
                        <Label
                          htmlFor="wide"
                          className="text-xs cursor-pointer"
                        >
                          Rộng
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Analysis Result */}
              {analysisResult && (
                <div className="space-y-4">
                  {/* Tops */}
                  <div className="rounded-lg border p-4 space-y-2">
                    <h3 className="font-semibold">Áo</h3>
                    <p className="text-sm">
                      <span className="font-medium">Kích cỡ đề xuất:</span>{' '}
                      {analysisResult.tops.recommendedSize}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Kiểu fit:</span>{' '}
                      {analysisResult.tops.fitType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.tops.explanation}
                    </p>
                  </div>

                  {/* Pants */}
                  <div className="rounded-lg border p-4 space-y-2">
                    <h3 className="font-semibold">Quần</h3>
                    <p className="text-sm">
                      <span className="font-medium">Kích cỡ đề xuất:</span>{' '}
                      {analysisResult.pants.recommendedSize}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Kiểu fit:</span>{' '}
                      {analysisResult.pants.fitType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.pants.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!height || !weight || !bodyType || isLoading}
            >
              {isLoading ? 'Đang phân tích...' : 'KIỂM TRA KÍCH CỠ'}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              ĐẶT LẠI
            </Button>
          </div>
        </div>
          </CardContent>
        </Card>

       


    

    
      </div>
    </div>
  );
}
