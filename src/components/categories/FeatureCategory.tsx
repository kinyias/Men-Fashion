"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
const categories = [
  {
    name: "Quần âu",
    image: "/placeholder.svg?height=400&width=400",
    itemCount: 42,
  },
  {
    name: "Áo sơ mi",
    image: "/placeholder.svg?height=400&width=400",
    itemCount: 36,
  },
  {
    name: "Áo Polo",
    image: "/placeholder.svg?height=400&width=400",
    itemCount: 28,
  },
  {
    name: "Túi",
    image: "/placeholder.svg?height=400&width=400",
    itemCount: 24,
  },
  {
    name: "Giày tây",
    image: "/placeholder.svg?height=400&width=400",
    itemCount: 18,
  },
  {
    name: "Quần jeans",
    image: "/placeholder.svg?height=400&width=400",
    itemCount: 32,
  },
]

export default function FeatureCategory() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {categories.map((category, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <Link href="#" className="group relative overflow-hidden rounded-xl block">
              <div className="aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  <span className="mt-3 inline-flex items-center text-sm font-medium text-white">
                    Xem ngay
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation controls - styled differently for mobile and desktop */}
      <div className="hidden md:block">
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </div>

      <div className="flex justify-center gap-2 mt-4 md:hidden">
        <CarouselPrevious className="static translate-x-0 transform-none mx-1" />
        <CarouselNext className="static translate-x-0 transform-none mx-1" />
      </div>
    </Carousel>
  )
}
