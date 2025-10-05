import { Text } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex justify-center py-20">
          <LocalizedClientLink
            href="/"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.jpg"
              alt="ঐতিহ্যের সম্ভার"
              width={150}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </LocalizedClientLink>
        </div>
        <div className="flex w-full mb-16 justify-between text-ui-fg-muted items-center">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} ঐতিহ্যের সম্ভার. All rights reserved.
          </Text>
          <div className="flex items-center gap-4">
            <Text className="txt-compact-small">Follow us:</Text>
            <a
              href="https://www.facebook.com/oitijhyershombhar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ui-fg-base transition-colors"
              aria-label="Visit our Facebook page"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
