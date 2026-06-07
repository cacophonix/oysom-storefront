import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { homepageConfig } from "@lib/config/homepage"
import {
  buildHomepageProductList,
  HomepageCategorySection,
} from "@lib/util/homepage-categories"
import ProductGrid from "@modules/home/components/product-grid"

type HomepageProductsProps = {
  countryCode: string
  categorySections: HomepageCategorySection[]
  allCategories: HttpTypes.StoreProductCategory[]
}

export default async function HomepageProducts({
  countryCode,
  categorySections,
  allCategories,
}: HomepageProductsProps) {
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: homepageConfig.productLimit,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,*categories",
    },
  })

  const homepageProducts = buildHomepageProductList(
    products,
    categorySections,
    allCategories
  )

  if (!homepageProducts.length) {
    return (
      <div className="py-6">
        <div className="content-container">
          <div className="mb-8 text-2xl-semi text-center">
            <h1 data-testid="store-page-title">
              {homepageConfig.productsSection.title}
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">
              {homepageConfig.productsSection.emptyMessage}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="content-container">
        <div className="mb-8 text-2xl-semi text-center">
          <h1 data-testid="store-page-title">
            {homepageConfig.productsSection.title}
          </h1>
        </div>
        <ProductGrid products={homepageProducts} countryCode={countryCode} />
      </div>
    </div>
  )
}
