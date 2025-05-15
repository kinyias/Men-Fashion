"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"

interface ZoomableImageProps {
  src: string
  alt: string
  zoomScale?: number
}

export function ZoomableImage({ src, alt, zoomScale = 1.8 }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const { left, top, width, height } = imageRef.current.getBoundingClientRect()

    // Calculate position as percentage
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  return (
    <div
      ref={imageRef}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Base image */}
      <div className="relative w-full h-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Zoomed image */}
      {isZoomed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            overflow: "hidden",
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: `${position.x * 100}% ${position.y * 100}%`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Zoomed ${alt}`}
              fill
              className="max-h-full max-w-full object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}