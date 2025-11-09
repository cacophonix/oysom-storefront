import { Metadata } from "next"
import Image from "next/image"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import BannerSlideshow from "@modules/home/components/banner-slideshow"
import { getSlideshowImages } from "@lib/util/get-slideshow-images"

export const metadata: Metadata = {
  title: "ঐতিহ্যের সম্ভার - Premium Online Store",
  description: "Discover quality products at ঐতিহ্যের সম্ভার. Shop our complete collection with fast delivery.",
  openGraph: {
    title: "Oysom - ঐতিহ্যের সম্ভার",
    description: "Discover quality products at ঐতিহ্যের সম্ভার. Shop our complete collection with fast delivery.",
    url: "https://www.oysom.com",
    siteName: "Oysom - ঐতিহ্যের সম্ভার",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://www.oysom.com/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Oysom - ঐতিহ্যের সম্ভার",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oysom - ঐতিহ্যের সম্ভার",
    description: "Discover quality products at ঐতিহ্যের সম্ভার. Shop our complete collection with fast delivery.",
    images: ["https://www.oysom.com/logo.jpg"],
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function HomePage(props: Params) {
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  // Get slideshow images
  const slideshowImages = await getSlideshowImages()

  return (
    <>
      {/* Banner Hero Section */}
      <section className="py-0">
        <div className="content-container">
          {slideshowImages.length > 0 ? (
            <BannerSlideshow images={slideshowImages} />
          ) : (
            <Image
              src="/banner.png"
              alt="ঐতিহ্যের সম্ভার"
              width={1600}
              height={900}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
          )}
        </div>
      </section>

      {/* Products Section */}
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode="bd"
      />
    </>
  )
}
