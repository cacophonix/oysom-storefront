import { Metadata } from "next"
import Image from "next/image"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "ঐতিহ্যের সম্ভার - Premium Online Store",
  description: "Discover quality products at ঐতিহ্যের সম্ভার. Shop our complete collection with fast delivery.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function HomePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <>
      {/* Banner Hero Section */}
      <section className="py-0">
        <div className="content-container">
          <Image
            src="/banner.png"
            alt="ঐতিহ্যের সম্ভার"
            width={1920}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
            priority
          />
        </div>
      </section>

      {/* Products Section */}
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
