import Phone from "@modules/common/icons/phone"

export default function TopInfoBanner() {
  return (
    <div className="py-2 px-4" style={{ backgroundColor: '#FFBB55' }}>
      <div className="content-container flex items-center justify-center gap-2 text-sm md:text-base text-gray-900">
        <Phone className="w-5 h-5 animate-pulse" />
        <span className="font-medium">
          আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন:{" "}
          <a
            href="tel:+8801977834583"
            className="font-bold hover:underline ml-1"
          >
            +880 1977-834583
          </a>
        </span>
      </div>
    </div>
  )
}