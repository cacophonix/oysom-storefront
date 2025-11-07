# Homepage Banner Slideshow Guide

## Overview

The homepage now features an automatic slideshow banner instead of a static image. The slideshow automatically cycles through images placed in the `/public/slideshow/` folder.

## Features

✨ **Auto-play**: Slides automatically transition every 5 seconds
🎯 **Manual Controls**: Previous/Next arrow buttons (appear on hover)
📱 **Touch/Swipe**: Swipe gestures on mobile devices
⌨️ **Keyboard Navigation**: Use arrow keys to navigate
🔢 **Slide Indicators**: Dots at the bottom to see and jump to any slide
📊 **Slide Counter**: Shows current slide number (e.g., "2 / 5")
📐 **Responsive**: Automatically adapts to all screen sizes

## How to Add Slideshow Images

### Step 1: Prepare Your Images

1. **Recommended Dimensions**: 1920x600 pixels
2. **Supported Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
3. **File Size**: Optimize images for web (recommended: under 500KB each)

### Step 2: Add Images to the Folder

1. Navigate to: `oysom-storefront/public/slideshow/`
2. Copy your banner images into this folder
3. Name them descriptively (e.g., `banner-1.png`, `promo-summer.jpg`, etc.)

Example:
```
oysom-storefront/public/slideshow/
├── banner-1.png          ← First slide (currently the existing banner)
├── banner-2.jpg          ← Add more images here
├── banner-3.png
└── README.md             ← Don't delete this
```

### Step 3: Images Will Auto-Display

- The slideshow automatically detects all images in the folder
- Images display in **alphabetical order** by filename
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

Images are sorted **alphabetically** by filename. To control the order:

✅ **Good naming**:
```
banner-1-welcome.png
banner-2-summer-sale.png
banner-3-new-products.png
```

✅ **Also good**:
```
01-home-banner.jpg
02-promo-banner.jpg
03-special-offer.jpg
```

❌ **Poor naming** (unpredictable order):
```
banner.png
my-image.jpg
promo.png
```

## Testing Your Slideshow

1. Add 2-3 images to `/public/slideshow/`
2. Save and restart the development server if needed
3. Visit your homepage at `http://localhost:3000`
4. You should see:
   - Auto-playing slideshow
   - Navigation dots at the bottom
   - Slide counter in top-right
   - Arrow buttons on hover

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

## Best Practices

1. **Image Optimization**: Compress images before uploading
2. **Consistent Dimensions**: Use the same aspect ratio for all slides
3. **Descriptive Names**: Use clear, ordered filenames
4. **Alt Text**: Images automatically get alt text as "Slide 1", "Slide 2", etc.
5. **Mobile Testing**: Check on mobile devices for touch/swipe functionality

## Support

For issues or questions about the slideshow feature, check:
- Component code at [`oysom-storefront/src/modules/home/components/banner-slideshow/index.tsx`](oysom-storefront/src/modules/home/components/banner-slideshow/index.tsx)
- Image folder at [`oysom-storefront/public/slideshow/`](oysom-storefront/public/slideshow/)