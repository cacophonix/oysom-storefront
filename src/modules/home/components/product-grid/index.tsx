import { HttpTypes } from "@medusajs/types"

import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"

type ProductGridProps = {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}

export default async function ProductGrid({
  products,
  countryCode,
}: ProductGridProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-y-16 justify-items-stretch"
      style={{ gap: "0 1.5rem" }}
      data-testid="products-list"
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} />
        </li>
      ))}
    </ul>
  )
}
