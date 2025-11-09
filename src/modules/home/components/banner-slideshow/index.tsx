"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

interface SlideshowImage {
  src: string
  link?: string
  alt: string
}

interface BannerSlideshowProps {
  images: SlideshowImage[]
  autoPlayInterval?: number
}

export default function BannerSlideshow({
  images,
  autoPlayInterval = 5000,
}: BannerSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }, [images.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return

    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isAutoPlaying, autoPlayInterval, goToNext, images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
        setIsAutoPlaying(false)
      } else if (e.key === "ArrowRight") {
        goToNext()
        setIsAutoPlaying(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrevious])

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
      setIsAutoPlaying(false)
    } else if (isRightSwipe) {
      goToPrevious()
      setIsAutoPlaying(false)
    }
  }

  if (images.length === 0) {
    return (
      <div className="w-full bg-gray-200 flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg">
        <p className="text-gray-500">No slideshow images found. Add images to /public/slideshow/</p>
      </div>
    )
  }

  if (images.length === 1) {
    const singleImage = images[0]
    const imageElement = (
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]">
        <Image
          src={singleImage.src}
          alt={singleImage.alt}
          fill
          className="object-cover rounded-lg"
          priority
          sizes="100vw"
        />
      </div>
    )

    return singleImage.link ? (
      <Link href={singleImage.link} className="block">
        {imageElement}
      </Link>
    ) : (
      imageElement
    )
  }

  return (
    <div
      className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Images */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {images.map((image, index) => {
          const isVisible = index === currentIndex
          const baseClasses = `absolute inset-0 transition-opacity duration-700 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`

          return image.link ? (
            <Link
              key={image.src}
              href={image.link}
              className={baseClasses}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </Link>
          ) : (
            <div key={image.src} className={baseClasses}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          )
        })}
      </div>

      {/* Previous Button */}
      <button
        onClick={() => {
          goToPrevious()
          setIsAutoPlaying(false)
        }}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
      </button>

      {/* Next Button */}
      <button
        onClick={() => {
          goToNext()
          setIsAutoPlaying(false)
        }}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-6 sm:w-8"
                : "bg-white/60 hover:bg-white/80 w-2 sm:w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  )
}