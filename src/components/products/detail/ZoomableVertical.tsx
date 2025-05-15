"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"

interface ZoomableVerticalProps {
  src: string
  alt: string
  zoomScale?: number
}

export function ZoomableVertical({ src, alt, zoomScale = 1.8 }: ZoomableVerticalProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const { top, height } = imageRef.current.getBoundingClientRect()

    // Calculate position as percentage (vertical only)
    const y = (e.clientY - top) / height

    setPosition({ y })
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
              transformOrigin: `center ${position.y * 100}%`,
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