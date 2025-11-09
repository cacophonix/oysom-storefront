import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Oysom - ঐতিহ্যের সম্ভার",
    template: "%s | Oysom",
  },
  description: "Traditional Bengali products - ঐতিহ্যবাহী বাংলাদেশী পণ্য",
  openGraph: {
    title: "Oysom - ঐতিহ্যের সম্ভার",
    description: "Traditional Bengali products - ঐতিহ্যবাহী বাংলাদেশী পণ্য",
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
    description: "Traditional Bengali products - ঐতিহ্যবাহী বাংলাদেশী পণ্য",
    images: ["https://www.oysom.com/logo.jpg"],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
