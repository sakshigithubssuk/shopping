const productService = require('../services/product.service.js');

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        // 201 Created is correct for creating a new resource
        return res.status(201).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.deleteProduct(productId);
        // Use 200 OK for successful deletion returning data (or 204 No Content if returning nothing)
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.updateProduct(productId, req.body);
        // Use 200 OK for successful update returning data
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const findProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.findProductById(productId);
         // Use 200 OK for successful GET request by ID
        return res.status(200).send(product);
    } catch (error) {
         // Handle potential "Not Found" error specifically if needed, otherwise 500 is okay for general errors
        return res.status(500).send({ error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    // Removed: const productId=req.params.id; - Not needed for getAll
    try {
        // The actual error causing the 500 is likely inside productService.getAllProducts
        // because it receives the raw req.query with potentially bad values.
        const products = await productService.getAllProducts(req.query); // Changed variable name for clarity
        // Use 200 OK for successful GET request
        return res.status(200).send(products);
    } catch (error) {
        // This catch block handles errors thrown *from* the service layer
        return res.status(500).send({ error: error.message });
    }
}

const createMultipleProduct = async (req, res) => {
    // Removed: const productId=req.params.id; - Not needed for createMultiple
    try {
        // Assuming service handles the array in req.body
        await productService.createMultipleProduct(req.body);
        // 201 Created is correct
        return res.status(201).send({ message: "Products Created Successfully" }); // "Products" assuming multiple
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    createMultipleProduct,
    findProductById,
}