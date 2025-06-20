'use client'

import { useEffect, useState } from 'react'
// Removed StarIcon import as it wasn't used
import { Radio, RadioGroup } from '@headlessui/react' // Keep Radio for Headless UI v2
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, Grid } from '@mui/material';
import ProductReviewCard from './ProductReviewCard'; // Assuming this component exists
import HomesectionCrad from '../HomeSectionCard/HomesectionCrad'; // Assuming this component exists
import { mens_kurta } from '../../../Data/mens_kurta'; // Static data for similar products
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProductsBYID } from '../../../State/product/Action.js';
// No longer need to import store directly when using useSelector
// import store from '../../../State/store.js';
import { addItemToCart } from '../../../State/Cart/Action.js'; // Action for adding to cart

// --- Renamed static object to avoid conflict with Redux state ---
const staticProductData = {
  
  price: '$192',
  href: '#',
  breadcrumbs: [
    { id: 1, name: 'Men', href: '#' },
    { id: 2, name: 'Clothing', href: '#' },
  ],
  images: [
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
      alt: 'Model wearing plain black basic tee.',
    },
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
      alt: 'Model wearing plain gray basic tee.',
    },
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
      alt: 'Model wearing plain white basic tee.',
    },
  ],
  colors: [ // Defined but not used in the provided template
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [ // Static sizes used for the radio buttons
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    // Assuming XL was intended to be here based on previous versions
    // { name: 'XL', inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with our proprietary colors',
    'Pre-washed & pre-shrunk',
    'Ultra-soft 100% cotton',
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}

// Static reviews object
const reviews = { href: '#reviews', average: 4, totalCount: 117 } // Added id to href

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {

  // --- State for the selected size NAME (e.g., "S", "M") ---
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  
  const { product: productState } = useSelector(store => store); // Renamed to avoid conflict
  const fetchedProductData = productState?.product; // The actual fetched product data
  const isLoading = productState?.loading;
  const error = productState?.error;

  // --- Fetch product data ---
  useEffect(() => {
    if (params.productId) {
        const data = { productId: params.productId };
        dispatch(findProductsBYID(data));
    }
  }, [dispatch, params.productId]);

  // --- Handle Add to Cart ---
  const handleAddtoCart = () => {
    // Ensure a size is selected and we have the product ID
    if (!selectedSize) {
        alert("Please select a size."); // Or show a more user-friendly message
        return;
    }
    if (!fetchedProductData?._id) {
        alert("Product data is not loaded yet."); // Handle missing product ID
        return;
    }

    // --- Data for the cart action ---
    const data = { productId: params.productId, size: selectedSize }; // selectedSize is the name string ("S", "M", etc.)
    console.log("Adding to cart:", data); // For debugging
    dispatch(addItemToCart(data));
    navigate('/cart'); // Navigate after dispatching
  };

  // --- Loading and Error States ---
  if (isLoading) {
      // Optional: Show a loading indicator, potentially overlayed or integrated
      // For now, rendering the static parts while loading dynamic ones
  }
  if (error) {
      return <div className="text-center py-10 text-red-600">Error loading product details.</div>;
  }

  return (
    <div className="bg-white">
      <div className="pt-6 lg:px-20">
        <nav aria-label="Breadcrumb">
          {/* Using static breadcrumbs */}
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {staticProductData.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </a>
                  <svg fill="currentColor" width={16} height={20} viewBox="0 0 16 20" aria-hidden="true" className="h-5 w-4 text-gray-300">
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              {/* Using fetched title if available, else static name */}
              <a href={fetchedProductData?.href || staticProductData.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {fetchedProductData?.title || staticProductData.name}
              </a>
            </li>
          </ol>
        </nav>

        <section className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10'>
          {/* Image gallery */}
          <div className="flex flex-col items-center">
            <div className='overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]'>
              {/* Using fetched image URL if available, else static */}
              <img
                src={fetchedProductData?.imageUrl || staticProductData.images[0]?.src || ''} // Add fallback src
                alt={fetchedProductData?.title || staticProductData.images[0]?.alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-wrap space-x-5 justify-center mt-4">
              {/* Using static images for thumbnails */}
              {staticProductData.images.map((image, index) => (
                <div key={index} className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[5rem] max-h-[5rem]">
                  <img
                    alt={image.alt}
                    src={image.src}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 max-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
            <div className="lg:col-span-2 ">
              {/* Using fetched brand/title */}
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                {fetchedProductData?.brand || 'Brand Name'} {/* Fallback text */}
              </h1>
              <h1 className='text-lg lg:text-xl text-gray-900 opacity-60 pt-1'>
                {fetchedProductData?.title || 'Product Title'} {/* Fallback text */}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              {/* Using fetched pricing */}
              <div className='flex space-x-5 items-center text-lg lg:text-xl mt-6 text-gray-900'>
                <p className='font-semibold'>${fetchedProductData?.discountedPrice ?? 'N/A'}</p>
                <p className='opacity-50 line-through'>${fetchedProductData?.price ?? 'N/A'}</p>
                {/* Corrected typo: discountPercent */}
                {fetchedProductData?.discountPercent != null && ( // Check if discountPercent exists and is not null
                   <p className='text-green-600 font-semibold'>{fetchedProductData.discountPercent}% OFF</p>
                )}
              </div>

              {/* Reviews - Using static data/placeholders */}
              <div className="mt-6">
                 <h3 className="sr-only">Reviews</h3>
                <div className='flex items-center space-x-3'>
                  <Rating name="read-only" value={reviews.average} precision={0.5} readOnly />
                  <p className='opacity-50 text-sm'>{reviews.totalCount} Ratings</p>
                  <a href={reviews.href} className='ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500'>{reviews.totalCount} Reviews</a>
                </div>
              </div>

              <form className="mt-10">
                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  </div>

                  {/* --- CORRECTED RadioGroup --- */}
                  <fieldset aria-label="Choose a size" className="mt-4">
                    <RadioGroup
                      value={selectedSize} // Bound to the state holding the size NAME ("S", "M", etc.)
                      onChange={setSelectedSize} // Updates the state with the selected size NAME
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    >
                      {/* Mapping over STATIC sizes */}
                      {staticProductData.sizes.map((size) => (
                        <Radio
                          key={size.name}
                          value={size.name} // The value associated with this radio IS the size NAME
                          disabled={!size.inStock}
                          // --- Headless UI v2 Styling Approach ---
                          className={({ focus, checked, disabled }) => classNames(
                            disabled ? 'cursor-not-allowed bg-gray-50 text-gray-200 opacity-50' : 'cursor-pointer bg-white text-gray-900 shadow-sm hover:bg-gray-50',
                            // Apply ring only when focused, not just active
                            focus ? 'ring-2 ring-indigo-500 ring-offset-2' : '',
                            // Apply border/ring when checked
                            checked ? 'ring-2 ring-indigo-500 ring-offset-2 border-transparent' : 'border-gray-300',
                            'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase focus:outline-none sm:flex-1 sm:py-6'
                          )}
                        >
                           {/* Render prop provides state if needed, simpler content here */}
                           <span>{size.name}</span>
                            {/* Visual indicator for checked state (optional, handled by className) */}
                            {/* {checked && <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-md border-2 border-indigo-500" />} */}

                            {/* Visual indicator for disabled state */}
                            {!size.inStock ? (
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                    <svg
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor"
                                    >
                                        <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                    </svg>
                                </span>
                            ) : null }
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                {/* --- Add to Cart Button --- */}
                <Button
                  onClick={handleAddtoCart}
                  variant="contained"
                  sx={{ px: "2rem", py: "1rem", marginTop: "1.5rem", bgcolor: "#9155fd" }}
                  disabled={isLoading || !selectedSize} // Disable if loading or no size selected
                >
                  Add to Cart
                </Button>
              </form>
            </div>

            {/* Description and details - Using static data */}
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6">
                  <p className="text-base text-gray-900">{staticProductData.description}</p>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {staticProductData.highlights.map((highlight) => (
                      <li key={highlight} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>
                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{staticProductData.details}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rating and reviews - Using static data/placeholders */}
        <section id="reviews" className='px-4 py-10 sm:px-6 lg:px-8'>
            <h1 className='font-semibold text-lg pb-4'>Recent Review & Rating</h1>
            <div className='border p-5 rounded-lg'>
                <Grid container spacing={7}>
                <Grid item xs={12} md={7}>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h2>
                    <div className='space-y-5'>
                        {[1, 1, 1].map((_, index) => <ProductReviewCard key={index} />)}
                    </div>
                </Grid>
                <Grid item xs={12} md={5}>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Product Ratings</h2>
                    <div className='flex items-center space-x-3 mb-5'>
                        {/* Example rating value */}
                        <Rating value={4.6} precision={0.5} readOnly />
                        <p className="opacity-60 text-sm">59867 Ratings</p> {/* Example count */}
                    </div>
                    <Box>
                        {/* Static Rating Breakdown */}
                        {[
                            { label: "Excellent", value: 40, stars: 5 },
                            { label: "Very Good", value: 30, stars: 4 },
                            { label: "Good", value: 15, stars: 3 },
                            { label: "Fair", value: 10, stars: 2 },
                            { label: "Bad", value: 5, stars: 1 }
                        ].map(rating => (
                            <Grid container key={rating.label} alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                <Grid item xs={3} sm={3} md={4} className="text-sm text-gray-600">
                                    {rating.stars} star
                                </Grid>
                                <Grid item xs={7} sm={7} md={6}>
                                    <LinearProgress
                                        sx={{ bgcolor: "#e0e0e0", borderRadius: 4, height: 8 }}
                                        color="secondary"
                                        variant='determinate'
                                        value={rating.value}
                                    />
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} className="text-sm text-right text-gray-600">
                                    {rating.value}%
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                </Grid>
                </Grid>
            </div>
        </section>

        {/* similar products - Using static data */}
        <section className='px-4 py-10 sm:px-6 lg:px-8'>
          <h1 className='py-5 text-xl font-bold'>Similar Products</h1>
          <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
            {mens_kurta.slice(0, 4).map((item, index) => (
              <HomesectionCrad key={item.id || index} product={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}