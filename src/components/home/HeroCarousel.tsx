"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import { useMediaQuery } from "@/hooks/use-media-query" // You'll need to implement or import this

const slides = [
  {
    image: "/assets/banner/banner1.png",
  },
  {
    image: "/assets/banner/banner2.png"
  },
]

const slidesMobile = [
  {
    image: "/assets/banner/banner1_mobile.png",
  },
  {
    image: "/assets/banner/banner2_mobile.png"
  },
]

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)") // Detect mobile screens

  // Use mobile slides if on mobile device
  const activeSlides = isMobile ? slidesMobile : slides

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Reset carousel when switching between mobile/desktop
  useEffect(() => {
    if (api) {
      api.reInit()
    }
  }, [isMobile, api])

  // Auto-rotate slides
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [api])

  return (
    <section className="h-full relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="h-full">
          {activeSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-full">
              <div className="relative w-full h-auto">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={`Slide ${index + 1}`}
                  width={isMobile ? 768 : 1920}
                  height={isMobile ? 1024 : 1080}
                  quality={100}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Controls */}
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 transition-all ${index === current ? "w-6 bg-white" : "w-2 bg-white/50"} rounded-full`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows - Hide on mobile if desired */}
        {!isMobile && (
          <div className="absolute inset-0">
            <CarouselPrevious className="h-10 w-10 left-10 top-1/2 transform -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 border-none" />
            <CarouselNext className="h-10 w-10 right-10 top-1/2 transform -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 border-none" />
          </div>
        )}
      </Carousel>
    </section>
  )
}