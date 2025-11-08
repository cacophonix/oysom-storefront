# Homepage Banner Slideshow Guide

## Overview

The homepage now features an automatic slideshow banner instead of a static image. The slideshow automatically cycles through images placed in the `/public/slideshow/` folder.

## Features

✨ **Auto-play**: Slides automatically transition every 5 seconds
🎯 **Manual Controls**: Previous/Next arrow buttons (appear on hover)
📱 **Touch/Swipe**: Swipe gestures on mobile devices
⌨️ **Keyboard Navigation**: Use arrow keys to navigate
🔢 **Slide Indicators**: Dots at the bottom to see and jump to any slide
📐 **Responsive**: Automatically adapts to all screen sizes
🔗 **Clickable Banners**: Automatically link to products based on filename

## How to Add Slideshow Images

### Step 1: Prepare Your Images

1. **Recommended Dimensions**: 1920x600 pixels
2. **Supported Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
3. **File Size**: Optimize images for web (recommended: under 500KB each)

### Step 2: Add Images to the Folder

1. Navigate to: `oysom-storefront/public/slideshow/`
2. Copy your banner images into this folder
3. **Name strategically for clickable links** (see naming guide below)

## 🔗 Making Banners Clickable

### Automatic Link Detection

The slideshow automatically creates clickable banners based on the filename. If you want a banner to link to a product, include the product handle in the filename.

### Naming Convention

**Format**: `[prefix]-[product-handle].[extension]`

**Examples**:

```bash
# Links to /products/ghee
banner-1-ghee.png
banner-ghee.jpg

# Links to /products/honey
banner-2-honey.png
promo-honey.jpg

# Links to /products/olive-oil
banner-olive-oil.png
slide-3-olive-oil.jpg

# Links to /products/organic-rice
banner-organic-rice.png

# No link (just displays)
banner.png
banner-1.png
slide-2.png
```

### Naming Rules

1. **Product Handle**: Everything after the first hyphen/underscore becomes the product slug
2. **Ignored Prefixes**: Common prefixes like `banner`, `slide`, `promo`, `ad`, or numbers are automatically skipped
3. **Multi-word Products**: Use hyphens to separate words (e.g., `banner-olive-oil.png` → `/products/olive-oil`)
4. **No Link**: If filename doesn't match the pattern, the banner won't be clickable (just displays)

### Folder Example
```
oysom-storefront/public/slideshow/
├── banner-1-ghee.png           ← Clickable: links to /products/ghee
├── banner-2-honey.jpg          ← Clickable: links to /products/honey
├── banner-olive-oil.png        ← Clickable: links to /products/olive-oil
├── promo-organic-rice.png      ← Clickable: links to /products/organic-rice
├── banner.png                  ← Not clickable (just displays)
└── README.md                   ← Don't delete this
```

### Step 3: Images Will Auto-Display

- The slideshow automatically detects all images in the folder
- Images display in **alphabetical order** by filename
- Clickable links are automatically created based on filename
- No code changes needed!

## Fallback Behavior

If no images are in the `/slideshow/` folder:
- The page will automatically show the default `/public/banner.png` image
- No errors or broken pages

## Customization Options

### Change Auto-Play Speed

Edit [`oysom-storefront/src/app/[countryCode]/(main)/page.tsx`](oysom-storefront/src/app/[countryCode]/(main)/page.tsx:33):

```tsx
<BannerSlideshow 
  images={slideshowImages} 
  autoPlayInterval={5000}  // Change this value (in milliseconds)
/>
```

Examples:
- `3000` = 3 seconds per slide
- `7000` = 7 seconds per slide
- `10000` = 10 seconds per slide

### Change Banner Height

Edit [`oysom-storefront/src/app/[countryCode]/(main)/page.tsx`](oysom-storefront/src/app/[countryCode]/(main)/page.tsx:33):

```tsx
<BannerSlideshow 
  images={slideshowImages} 
  height={600}  // Change this value (in pixels)
/>
```

## Ordering Images

Images are sorted **alphabetically** by filename. To control the order while maintaining clickable links:

✅ **Good naming** (ordered + clickable):
```
banner-1-ghee.png           ← First, links to /products/ghee
banner-2-honey.jpg          ← Second, links to /products/honey
banner-3-olive-oil.png      ← Third, links to /products/olive-oil
```

✅ **Also good** (numbered prefix):
```
01-ghee.jpg                 ← Links to /products/ghee
02-honey.png                ← Links to /products/honey
03-rice.jpg                 ← Links to /products/rice
```

❌ **Poor naming** (unpredictable order):
```
ghee.png
honey-banner.jpg
special-rice.png
```

### Tips for Ordering

1. Use numeric prefixes for guaranteed order: `banner-1-`, `banner-2-`, `banner-3-`
2. Keep the product handle after the number: `banner-1-ghee.png`
3. The system ignores common prefixes and numbers when creating links

## Testing Your Slideshow

1. Add 2-3 images to `/public/slideshow/` with product handles in filenames
2. Save and restart the development server if needed
3. Visit your homepage at `http://localhost:3000`
4. You should see:
   - Auto-playing slideshow
   - Navigation dots at the bottom
   - Arrow buttons on hover
   - **Clickable banners** (cursor changes to pointer on hover)
5. **Test clicking**: Click a banner and verify it navigates to the correct product page

## Technical Details

### Component Location
- **Slideshow Component**: [`oysom-storefront/src/modules/home/components/banner-slideshow/index.tsx`](oysom-storefront/src/modules/home/components/banner-slideshow/index.tsx)
- **Image Utility**: [`oysom-storefront/src/lib/util/get-slideshow-images.ts`](oysom-storefront/src/lib/util/get-slideshow-images.ts)
- **Homepage**: [`oysom-storefront/src/app/[countryCode]/(main)/page.tsx`](oysom-storefront/src/app/[countryCode]/(main)/page.tsx)

### How It Works

1. The `getSlideshowImages()` function scans `/public/slideshow/` at build time
2. It filters for image files and sorts them alphabetically
3. Returns an array of image paths
4. The `BannerSlideshow` component receives these paths
5. Renders a client-side slideshow with auto-play and controls

## Troubleshooting

### Issue: Images Not Showing

**Solution**:
1. Check image format (must be `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif`)
2. Verify files are in `/public/slideshow/` folder
3. Check filename doesn't start with `.` (hidden file)
4. Restart development server: `npm run dev`

### Issue: Slideshow Not Auto-Playing

**Solution**:
- This is intentional after user interaction (clicks or swipes)
- Auto-play resumes after 10 seconds of inactivity

### Issue: Only One Image Showing

**Solution**:
- If only one image is in the folder, no slideshow controls appear
- Add more images to enable full slideshow features

### Issue: Banner Not Clickable

**Solution**:
1. Check filename follows the naming convention: `banner-[product-handle].png`
2. Verify the product handle exists in your store
3. Example: For a product at `/products/ghee`, name the banner `banner-ghee.png` or `banner-1-ghee.png`
4. Avoid filenames like `banner.png` or `banner-1.png` (no product handle)

### Issue: Wrong Link on Banner

**Solution**:
1. Check the product handle in your filename matches the actual product URL
2. Use hyphens for multi-word products: `olive-oil` not `olive_oil`
3. The link is generated from everything after the first ignored prefix
4. Example: `banner-2-organic-honey.png` → `/products/organic-honey`

## Best Practices

1. **Image Optimization**: Compress images before uploading (aim for <500KB per image)
2. **Consistent Dimensions**: Use 1920x600 pixels for all slides
3. **Strategic Naming**: Use numbered prefixes with product handles (`banner-1-ghee.png`)
4. **Product Links**: Verify product handles exist before naming banners
5. **Mobile Testing**: Test clickability and swipe functionality on mobile devices
6. **Link Verification**: After adding banners, click each one to verify correct navigation
7. **Fallback**: Keep the original `/public/banner.png` as a fallback if slideshow fails

## Examples

### Example 1: Simple Product Banner
**Product**: Ghee (available at `/products/ghee`)
**Filename**: `banner-1-ghee.png`
**Result**: Clickable banner linking to `/products/ghee`

### Example 2: Multi-word Product
**Product**: Olive Oil (available at `/products/olive-oil`)
**Filename**: `banner-2-olive-oil.png`
**Result**: Clickable banner linking to `/products/olive-oil`

### Example 3: Non-clickable Banner
**Purpose**: General promotional image with no specific product
**Filename**: `banner-promo.png`
**Result**: Displays but isn't clickable

## Support

For issues or questions about the slideshow feature, check:
- Component code at [`oysom-storefront/src/modules/home/components/banner-slideshow/index.tsx`](oysom-storefront/src/modules/home/components/banner-slideshow/index.tsx)
- Image folder at [`oysom-storefront/public/slideshow/`](oysom-storefront/public/slideshow/)