/* Validation Schemas for cart requests */

const productOptionsValidationSchema = {
    type: 'object',
    required: ['color', 'size', 'quantity', 'price', 'name', 'image'],
    properties: {
        color: { type: 'string' },
        size: { type: 'string' },
        quantity: { type: 'number' },
        price: { type: 'string' },
        name: { type: 'string' },
        image: { type: 'string' },
    },
}

const productValidationSchema = {
    type: 'object',
    required: ['productId', 'productOptions'],
    properties: {
        prouctId: { type: 'string' },
        productOptions: productOptionsValidationSchema,
    },
}

export default { productValidationSchema, productOptionsValidationSchema }
