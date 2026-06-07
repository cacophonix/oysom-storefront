import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categoryId,
  title = "আমাদের পণ্যসমূহ",
  emptyMessage,
  showPagination = true,
  productLimit,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryId?: string
  title?: string
  emptyMessage?: string
  showPagination?: boolean
  productLimit?: number
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="py-6">
      <div className="content-container">
        <div className="mb-8 text-2xl-semi text-center">
          <h2 data-testid="store-page-title">{title}</h2>
        </div>
        <div data-testid="category-container">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              categoryId={categoryId}
              emptyMessage={emptyMessage}
              showPagination={showPagination}
              productLimit={productLimit}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
