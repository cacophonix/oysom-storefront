import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import TopInfoBanner from "@modules/layout/components/top-info-banner"
import User from "@modules/common/icons/user"
import ShoppingCart from "@modules/common/icons/shopping-cart"
import Home from "@modules/common/icons/home"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const categories = await listCategories({ limit: 6 })

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <TopInfoBanner />
      <header className="relative mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="small:hidden">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo.jpg"
                alt="ঐতিহ্যের সম্ভার"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-4 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex items-center gap-2"
                href="/account"
                data-testid="nav-account-link"
              >
                <User size="20" />
                <span className="text-sm">Account</span>
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex items-center gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <ShoppingCart size="20" />
                  <span className="text-sm">Cart (0)</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
        
        {/* Categories Navigation */}
        <nav className="border-b border-ui-border-base bg-white">
          <div className="content-container">
            <ul className="flex items-center gap-x-6 h-12 overflow-x-auto no-scrollbar">
              {/* Home Link */}
              <li className="flex-shrink-0">
                <LocalizedClientLink
                  href="/"
                  className="hover:text-ui-fg-base text-ui-fg-subtle text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <Home size="18" />
                  <span>Home</span>
                </LocalizedClientLink>
              </li>
              
              {/* Separator */}
              <li className="flex-shrink-0 text-ui-fg-muted">|</li>
              
              {/* Category Links */}
              {categories && categories.length > 0 && categories.filter(cat => !cat.parent_category).slice(0, 6).map((category) => (
                <li key={category.id} className="flex-shrink-0">
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="hover:text-ui-fg-base text-ui-fg-subtle text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    {category.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    </div>
  )
}
