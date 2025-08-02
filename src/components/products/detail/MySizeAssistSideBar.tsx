'use client';

import { useState } from 'react';
import { X, Ruler, Weight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { analyzeSizeWithGemini, SizeAnalysisResult } from '@/lib/gemini';

interface MySizeAssistSidebarProps {
  isOpen: boolean;
  onClose: () => void
}

export function MySizeAssistSidebar({
  isOpen,
  onClose,
}: MySizeAssistSidebarProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl transition-transform animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Hỗ trợ chọn size</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
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
      </div>
    </div>
  );
}
