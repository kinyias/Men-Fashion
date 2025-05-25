"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { HinhAnhMauSac } from "@/types"
import { ZoomableImage } from "./ZoomableImage"
import { ZoomableVertical } from "./ZoomableVertical"


export function ImageGallery({ images}: {images: HinhAnhMauSac[]}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showZoom, setShowZoom] = useState(false)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : [
    {
    ma: 0,
    hinhAnh: "/placeholder.svg?height=800&width=600",
    anhChinh: true,
    mamausac: 0,
    masp: 0,
  }
]
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  // Scroll the thumbnail into view when currentIndex changes
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnails = thumbnailsRef.current.querySelectorAll('[role="button"]')
      if (thumbnails[currentIndex]) {
        thumbnails[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }
  }, [currentIndex])

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails - Vertical on the left */}
      <div className="relative flex flex-row md:flex-col gap-2 overflow-y-auto h-full hide-scrollbar w-full md:w-35" ref={thumbnailsRef}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            role="button"
            className={`relative flex-shrink-0 w-30 h-30 mb-2 overflow-hidden border-2 rounded-md cursor-pointer ${
              index === currentIndex ? "border-primary" : "border-transparent"
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={image.hinhAnh || "/placeholder.svg"}
              alt={`${image.masp} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image - Smaller and beside thumbnails */}
      <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-[3/4] flex-1">
      <ZoomableImage src={displayImages[currentIndex].hinhAnh || "/placeholder.svg"} alt={`Image ${currentIndex + 1}`} />
        {/* Navigation Arrows */}
       
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 rounded-full hover:bg-white absolute left-2 top-1/2 transform -translate-y-1/2"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 rounded-full hover:bg-white  absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={handleNext}
            disabled={currentIndex === displayImages.length - 1}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
       

        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-12 right-4 bg-white/80 hover:bg-white"
          onClick={() => setShowZoom(true)}
          aria-label="Zoom image"
        >
          <Maximize className="w-5 h-5" />
        </Button>
      </div>

      {/* Zoom Dialog */}
      <Dialog open={showZoom} onOpenChange={setShowZoom}>
        <DialogContent className="sm:max-w-[100vw] w-screen h-screen p-0 overflow-hidden border-none rounded-none">
            <DialogTitle className="p-5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">Xem ảnh rõ</DialogTitle>
          <div className="relative h-[calc(100vh-200px)] overflow-hidden">
            <ZoomableVertical src={displayImages[currentIndex].hinhAnh || "/placeholder.svg"} alt={`Image ${currentIndex + 1}`} />
          </div>
          <div className="flex justify-center pt-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex space-x-2 overflow-x-auto">
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  role="button"
                  className={`relative flex-shrink-0 w-20 h-20 overflow-hidden border-2 rounded-md cursor-pointer ${
                    index === currentIndex ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={image.hinhAnh || "/placeholder.svg"}
                    alt={`${image.masp} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
