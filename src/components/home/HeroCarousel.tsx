"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

interface HeroSlide {
  image: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  badge?: string
}

const heroSlides: HeroSlide[] = [
  {
    image: "/assets/banner/banner1.png",
    title: "Summer Collection 2025",
    subtitle:
      "Discover our latest styles designed for the modern man. Elevate your wardrobe with premium quality essentials.",
    primaryCta: "Shop Now",
    secondaryCta: "Explore Collection",
    badge: "New Collection",
  },
  {
    image: "/assets/banner/banner2.png",
    title: "Premium Essentials",
    subtitle:
      "Timeless pieces crafted with the finest materials. Build your wardrobe with versatile staples that never go out of style.",
    primaryCta: "Shop Essentials",
    secondaryCta: "Learn More",
    badge: "Best Sellers",
  },
]

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

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

  // Auto-rotate slides
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [api])

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="h-[80vh]">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-full">
              <div className="absolute inset-0">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" /> */}
              </div>

              {/* <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-6 lg:px-8">
                <div className="container mx-auto">
                  <div className="max-w-xl space-y-6">
                    {slide.badge && (
                      <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                        <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span> {slide.badge}
                      </div>
                    )}
                    <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                      {slide.title.split(" ").map((word, i, arr) =>
                        i === arr.length - 1 ? (
                          <span key={i} className="text-primary">
                            {word}
                          </span>
                        ) : (
                          <span key={i}>{word} </span>
                        ),
                      )}
                    </h1>
                    <p className="text-white/90 md:text-xl">{slide.subtitle}</p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button size="lg" className="rounded-full">
                        {slide.primaryCta}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        {slide.secondaryCta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div> */}
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

        {/* Navigation Arrows */}
        <div className="absolute inset-0">
          <CarouselPrevious className="h-10 w-10  left-10 top-1/2 transform -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 border-none" />
          <CarouselNext className="h-10 w-10  right-10 top-1/2 transform -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 border-none" />
        </div>
      </Carousel>
    </section>
  )
}
