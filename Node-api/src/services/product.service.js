const Category = require("../model/category.model");
const Product = require("../model/product.model");

async function createProduct(reqData) {
    // Find or create top-level category
    let topLevel = await Category.findOne({ name: { $regex: new RegExp(`^${reqData.topLavelCategory}$`, 'i') } }); // Case-insensitive find

    if (!topLevel) {
        topLevel = new Category({
            name: reqData.topLavelCategory, // Use correct field name from reqData
            level: 1
        });
        await topLevel.save();
    }

    // Find or create second-level category
    let secondLevel = await Category.findOne({
        name: { $regex: new RegExp(`^${reqData.secondLavelCategory}$`, 'i') }, // Case-insensitive find
        parentCategory: topLevel._id
    });

    if (!secondLevel) {
        secondLevel = new Category({
            name: reqData.secondLavelCategory, // Use correct field name
            parentCategory: topLevel._id,
            level: 2
        });
        await secondLevel.save();
    }

    // Find or create third-level category
    let thirdLevel = await Category.findOne({
        name: { $regex: new RegExp(`^${reqData.thirdLavelCategory}$`, 'i') }, // Case-insensitive find
        parentCategory: secondLevel._id
    });

    if (!thirdLevel) {
        thirdLevel = new Category({
            name: reqData.thirdLavelCategory, // Use correct field name
            parentCategory: secondLevel._id,
            level: 3
        });
        await thirdLevel.save();
    }

    // Create the product
    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrice: reqData.discountedPrice,
        discountPersent: reqData.discountPersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: reqData.price,
        sizes: reqData.size, // Ensure reqData.size matches the expected structure [{ name: 'S', quantity: 10 }, ...]
        quantity: reqData.quantity,
        category: thirdLevel._id, // Assign the ObjectId
    });

    return await product.save();
}

async function deleteProduct(productId) {
    // Optional: Check if product exists first
    const product = await findProductById(productId); // Uses the existing function which throws if not found
    await Product.findByIdAndDelete(productId);
    return { message: "Product deleted successfully" }; // Return an object for consistency
}

async function updateProduct(productId, reqData) {
    // Optional: Add logic here if category needs updating based on reqData similar to createProduct
    return await Product.findByIdAndUpdate(productId, reqData, { new: true }); // {new: true} returns the updated document
}

async function findProductById(id) {
    const product = await Product.findById(id)
                                 .populate({ path: 'category', populate: { path: 'parentCategory', populate: { path: 'parentCategory' } } }) // Populate nested categories
                                 .exec();

    if (!product) {
        throw new Error("Product not found with id: " + id); // Corrected error message
    }
    return product;
}

async function getAllProducts(reqQuery) {
    let { category, color, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize } = reqQuery;

    // --- Input Sanitization and Defaults ---
    pageSize = parseInt(pageSize?.trim()) || 10;
    pageNumber = parseInt(pageNumber?.trim()) || 1;
    minPrice = parseFloat(minPrice?.trim()); // Use parseFloat for prices
    maxPrice = parseFloat(maxPrice?.trim());
    minDiscount = parseInt(minDiscount?.trim());

    // Ensure pageNumber is at least 1
    if (pageNumber < 1) pageNumber = 1;

    // --- Build Filter Object ---
    let filter = {};

    if (category) {
        // Find category case-insensitively
        const existCategory = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (existCategory) {
            // Find all child categories if needed (optional, depends on requirements)
            // For now, just filter by the exact category found
            filter.category = existCategory._id;
        } else {
            // If category specified but not found, return no results
            return { content: [], currentPage: 1, totalPages: 0 };
        }
    }

    if (color) {
        // Handle multiple colors, trim whitespace, case-insensitive
        const colorSet = color.split(",").map(c => c.trim()).filter(c => c); // Filter out empty strings
        if (colorSet.length > 0) {
            filter.color = { $in: colorSet.map(c => new RegExp(c, "i")) }; // Case-insensitive match for any color in the list
        }
    }

    if (sizes) {
        // Handle multiple sizes, trim whitespace
        const sizesSet = sizes.split(",").map(s => s.trim()).filter(s => s);
        if (sizesSet.length > 0) {
            filter['sizes.name'] = { $in: sizesSet }; // Check if the 'name' in the sizes array is in the provided set
        }
    }

    // Add price filter only if both minPrice and maxPrice are valid numbers
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
         if(minPrice >= 0 && maxPrice >= 0) { // Ensure prices are not negative
             filter.discountedPrice = { $gte: minPrice, $lte: maxPrice };
         }
    } else if (!isNaN(minPrice) && minPrice >= 0) { // Only minPrice provided
         filter.discountedPrice = { $gte: minPrice };
    } else if (!isNaN(maxPrice) && maxPrice >= 0) { // Only maxPrice provided
         filter.discountedPrice = { $lte: maxPrice };
    }


    // Add discount filter only if minDiscount is a valid number
    if (!isNaN(minDiscount) && minDiscount >= 0) {
        filter.discountPersent = { $gte: minDiscount }; // Use gte (greater than or equal to)
    }

    if (stock) {
        const stockStatus = stock.trim().toLowerCase();
        if (stockStatus === 'in_stock') {
            filter.quantity = { $gt: 0 }; // Quantity greater than 0
        } else if (stockStatus === 'out_of_stock') { // Corrected key
            filter.quantity = { $lte: 0 }; // Quantity less than or equal to 0
        }
        // Ignore if stock is "null" or any other value
    }

    // --- Build Sort Object ---
    let sortOptions = {};
    if (sort) {
        const sortKey = sort.trim().toLowerCase();
        if (sortKey === 'price_high') { // Corrected key name
            sortOptions = { discountedPrice: -1 }; // Descending
        } else if (sortKey === 'price_low') {
            sortOptions = { discountedPrice: 1 }; // Ascending
        }
        // Add other sort options if needed (e.g., newest, popularity)
    }

    // --- Execute Query ---
    try {
        // Use the filter object for counting total documents matching criteria
        const totalProducts = await Product.countDocuments(filter);

        // Apply filter, sort, skip, and limit to the find query
        const products = await Product.find(filter)
            .populate('category') // Populate category as before
            .sort(sortOptions)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        const totalPages = Math.ceil(totalProducts / pageSize);

        return { content: products, currentPage: pageNumber, totalPages: totalPages };

    } catch (error) {
        // Log the error for debugging on the server
        console.error("Error in getAllProducts:", error);
        // Re-throw or handle as appropriate for your error handling strategy
        throw new Error("Failed to fetch products: " + error.message);
    }
}

async function createMultipleProduct(products) {
    // Consider using Promise.all for potentially faster parallel creation if order doesn't matter
    // and if category creation logic is idempotent or handled carefully.
    // For simplicity and safety with category creation, sequential loop is okay.
    const createdProducts = [];
    for (let productData of products) {
        const created = await createProduct(productData);
        createdProducts.push(created); // Optionally collect created products
    }
    return createdProducts; // Return the array of created products
}

module.exports = {
    createProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    deleteProduct,
    createMultipleProduct,
};