"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type RefinementListProps = {
  sortBy: SortOptions
  categories?: any[]
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ sortBy, categories = [], 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      {/* Categories Section - Moved to top navigation */}
      {/* {categories.length > 0 && (
        <div className="flex flex-col gap-y-4">
          <h3 className="txt-small-plus text-ui-fg-base">Categories</h3>
          <ul className="flex flex-col gap-y-2">
            {categories.slice(0, 8).map((category: any) => {
              if (category.parent_category) {
                return null
              }
              
              return (
                <li key={category.id}>
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="text-ui-fg-subtle hover:text-ui-fg-base txt-small transition-colors"
                  >
                    {category.name}
                  </LocalizedClientLink>
                  {category.category_children && category.category_children.length > 0 && (
                    <ul className="ml-4 mt-2 flex flex-col gap-y-1">
                      {category.category_children.slice(0, 3).map((child: any) => (
                        <li key={child.id}>
                          <LocalizedClientLink
                            href={`/categories/${child.handle}`}
                            className="text-ui-fg-muted hover:text-ui-fg-subtle txt-small transition-colors"
                          >
                            {child.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )} */}
      
      {/* Sort Products Section - Hidden for now */}
      {/* <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} /> */}
    </div>
  )
}

export default RefinementList
