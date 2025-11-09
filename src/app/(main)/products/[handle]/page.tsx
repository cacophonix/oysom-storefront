import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  try {
    // Only generate for Bangladesh since that's the only region we support
    const { response } = await listProducts({
      countryCode: "bd",
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .map((product) => ({
        handle: product.handle,
      }))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion("bd")

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: "bd",
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const productTitle = `${product.title} | ঐতিহ্যের সম্ভার (Oysom)`
  const productDescription = product.description || product.title
  const productUrl = `https://www.oysom.com/products/${handle}`
  const productImage = product.thumbnail || "https://www.oysom.com/logo.jpg"

  return {
    title: productTitle,
    description: productDescription,
    openGraph: {
      title: productTitle,
      description: productDescription,
      url: productUrl,
      siteName: "Oysom - ঐতিহ্যের সম্ভার",
      type: "website",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: "bn_BD",
    },
    twitter: {
      card: "summary_large_image",
      title: productTitle,
      description: productDescription,
      images: [productImage],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion("bd")

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: "bd",
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode="bd"
    />
  )
}
