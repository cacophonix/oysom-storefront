import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listCategories } from "@lib/data/categories"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categoryId,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryId?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  
  // Fetch categories on the server side
  let categories: any[] = []
  try {
    categories = await listCategories() || []
  } catch (error) {
    console.error('Error fetching categories:', error)
  }

  return (
    <div className="py-6">
      <div className="content-container">
        <div className="mb-8 text-2xl-semi text-center">
          <h1 data-testid="store-page-title">আমাদের পণ্যসমূহ</h1>
        </div>
        <div data-testid="category-container">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              categoryId={categoryId}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
