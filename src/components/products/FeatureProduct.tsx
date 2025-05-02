"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ProductCard from "./ProductCard"

const products = [
    {
      name: "Sản phẩm 1",
      category: "Danh mục",
      price: 500000,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.8,
      isNew: true,
      colors: [
        { id: "blue", name: "Blue", hex: "#1e40af" },
        { id: "white", name: "White", hex: "#ffffff" },
        { id: "black", name: "Black", hex: "#171717" },
        { id: "gray", name: "Gray", hex: "#6b7280" },
      ],
    },
    {
      name: "Sản phẩm 2",
      category: "Danh mục",
      price: 700000,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.6,
      isNew: false,
      colors: [
        { id: "khaki", name: "Khaki", hex: "#d4b996" },
        { id: "navy", name: "Navy", hex: "#0f172a" },
        { id: "olive", name: "Olive", hex: "#4b5320" },
        { id: "gray", name: "Gray", hex: "#6b7280" },
      ],
    },
    {
      name: "Sản phẩm 3",
      category: "Danh mục",
      price: 800000,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.9,
      isNew: true,
      colors: [
        { id: "brown", name: "Brown", hex: "#7c4a3a" },
        { id: "black", name: "Black", hex: "#171717" },
        { id: "tan", name: "Tan", hex: "#d2b48c" },
      ],
    },
    {
      name: "Sản phẩm 4",
      category: "Danh mục",
      price: 900000,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.7,
      isNew: false,
      colors: [
        { id: "charcoal", name: "Charcoal", hex: "#36454f" },
        { id: "camel", name: "Camel", hex: "#c19a6b" },
        { id: "navy", name: "Navy", hex: "#0f172a" },
      ],
    },
    {
      name: "Sản phẩm 5",
      category: "Danh mục",
      price: 500000,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.5,
      isNew: true,
      colors: [
        { id: "white", name: "White", hex: "#ffffff" },
        { id: "beige", name: "Beige", hex: "#f5f5dc" },
        { id: "lightblue", name: "Light Blue", hex: "#add8e6" },
      ],
    },
    {
      name: "Sản phẩm 6",
      category: "Danh mục",
      price: 1500000,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.9,
      isNew: false,
      colors: [
        { id: "silver", name: "Silver", hex: "#c0c0c0" },
        { id: "gold", name: "Gold", hex: "#ffd700" },
        { id: "black", name: "Black", hex: "#171717" },
      ],
    },
  ]

export function FeatureProduct() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <ProductCard product={product} />
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
