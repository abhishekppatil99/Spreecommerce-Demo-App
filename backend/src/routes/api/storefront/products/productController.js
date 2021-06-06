/* eslint-disable import/extensions */
import axios from 'axios'
import storefrontRequestConfig from '../../../../config/storefrontRequestConfig.js'

const ITEMS_PER_PAGE = 9
const SPREECOMMERCE_BASE_URL = 'https://demo.spreecommerce.org'

const parseProductAPI = (response) => {
    // some include caching
    const images = {}
    const properties = {}
    const variants = {}
    response.data.included.forEach((item) => {
        if (item.type === 'image') {
            images[item.id] = {
                viewable_id: item.attributes.viewable_id,
                image:
                    item.attributes.styles[item.attributes.styles.length - 2]
                        .url,
            }
        } else if (item.type === 'variant') {
            variants[item.id] = item.attributes
        } else if (item.type === 'product_property') {
            properties[item.id] = item.attributes
        }
    })
    function parseData(attr) {
        // setting up default variant for later use
        const defaultVariant = parseInt(
            attr.relationships.default_variant.data.id,
            10
        )

        // loading included cached images
        const itemImages = []
        attr.relationships.images.data.forEach((item) => {
            if (images[item.id].viewable_id === defaultVariant)
                // adding url domain as standard to get whole urls to return
                itemImages.push(
                    `https://demo.spreecommerce.org${images[item.id].image}`
                )
        })

        // loading included cached variants
        const itemVaraints = []
        attr.relationships.variants.data.forEach((item) => {
            itemVaraints.push(variants[item.id])
        })

        // loading included cached properties
        const itemProperties = []
        attr.relationships.product_properties.data.forEach((item) => {
            itemProperties.push(properties[item.id])
        })
        return {
            id: attr.id,
            ...attr.attributes,
            images: itemImages,
            default_variant: defaultVariant,
            variants: itemVaraints,
            properties: itemProperties,
        }
    }
    if (Array.isArray(response.data.data)) {
        const data = []
        response.data.data.forEach((attr) => data.push(parseData(attr)))
        return data
    }
    return parseData(response.data.data)
}

const getProductDetailsBasic = (response, included) => {
    let data = []
    const { SPREECOMMERCE_BASE_URL } = process.env

    response.forEach((product) => {
        let image_url = SPREECOMMERCE_BASE_URL
        included.forEach((element) => {
            if (
                product.relationships.default_variant.data.id ==
                element.attributes.viewable_id
            ) {
                image_url += element.attributes.styles[9].url
            }
        })
        const temp_object = {
            id: product.id,
            name: product.attributes.name,
            price: product.attributes.display_price,
            display_image: image_url,
        }
        data.push(temp_object)
    })

    return data
}
const getSingleProductDetailsBasic = (response, included) => {
    const { SPREECOMMERCE_BASE_URL } = process.env

    let image_url = SPREECOMMERCE_BASE_URL

    /* productDetails = {
        id: product_id,
        name: product_name,
        description: product_description,
        price: product_price,
        default_images: [
            {url:...}, 
            {url:...},
        ],
        colors: [...],
        sizes: [...],
        variants: [
            "color_red": [
                {url:...},
                {url:...},
            ],
            "color_blue": [
                {url:...},
                {url:...},
            ],
        ]
    } */

    var colors = []
    var sizes = []
    var variant_colors = {}
    var allImages = []
    //var default_variant_id = response.relationships.default_variant.data.id

    included.forEach((element) => {
        if (element.type == 'image') {
            // if (default_variant_id == element.attributes.viewable_id) {
            //     image_url += element.attributes.styles[4].url
            // }
            var temp_image_obj = {
                id: element.id,
                url:
                    image_url +
                    element.attributes.styles[
                        element.attributes.styles.length - 2
                    ].url,
            }
            allImages.push(temp_image_obj)
        } else if (element.type == 'variant') {
            var options = element.attributes.options_text
            var arr = options.split(',')
            var colorTemp = arr[0].split(' ')
            var sizeTemp = arr[1].split(' ')
            var colorSingle = colorTemp[1]
            var sizeSingle = sizeTemp[2]

            if (!colors.includes(colorSingle)) {
                colors.push(colorSingle)
                var variant_images = []
                element.relationships.images.data.forEach((image) => {
                    variant_images.push(image.id)
                })
                variant_colors[colorSingle] = {
                    variant_id: element.id,
                    image_ids: variant_images,
                }
            }
            if (!sizes.includes(sizeSingle)) {
                sizes.push(sizeSingle)
            }
        }
    })

    /*variant_colors = {
        "red": {
            variant_id: 21,
            image_ids: [12,13,14],
        }
        "blue": {
            variant_id: 22,
            image_ids: [15,16,17],
        }
    }
    */

    const temp_object = {
        id: response.id,
        name: response.attributes.name,
        price: response.attributes.display_price,
        description: response.attributes.description,
        images: allImages,
        colors: colors,
        sizes: sizes,
        variants: variant_colors,
    }

    return temp_object
}

const productController = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        const { page, taxon } = request.query
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                page: page || 1,
                per_page: ITEMS_PER_PAGE,
                // set includes as default cause we need them everywhere
                include: 'images,variants,default_variant,product_properties',
                'filter[taxons]': taxon || undefined,
            },
        }

        axios
            .get('/products', requestConfig)
            .then((response) => {
                reply
                    .status(response.status)
                    .send({ success: true, data: parseProductAPI(response) })
            })
            .catch((error) => {
                console.error(error.message)
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })
    })

    fastify.get('/default', async (request, reply) => {
        const { page, taxon } = request.query
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                page: page || 1,
                per_page: ITEMS_PER_PAGE,
                // set includes as default cause we need them everywhere
                include: 'images',
                'filter[taxons]': taxon || undefined,
            },
        }

        axios
            .get('/products', requestConfig)
            .then((response) => {
                reply.status(response.status).send({
                    success: true,
                    data: getProductDetailsBasic(
                        response.data.data,
                        response.data.included
                    ),
                })
            })
            .catch((error) => {
                console.error(error.message)
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })
    })

    fastify.get('/default/:id', async (request, reply) => {
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                // set includes as default cause we need them everywhere
                include: 'images,variants',
            },
        }
        axios
            .get(`/products/${request.params.id}`, requestConfig)
            .then((response) => {
                reply.status(response.status).send({
                    success: true,
                    data: getSingleProductDetailsBasic(
                        response.data.data,
                        response.data.included
                    ),
                })
            })
            .catch((error) => {
                console.error(error.message)
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })
    })

    fastify.get('/:id', async (request, reply) => {
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                // set includes as default cause we need them everywhere
                include: 'images,variants,default_variant,product_properties',
            },
        }
        axios
            .get(`/products/${request.params.id}`, requestConfig)
            .then((response) => {
                reply
                    .status(response.status)
                    .send({ success: true, data: parseProductAPI(response) })
            })
            .catch((error) => {
                console.error(error.message)
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })
    })

    fastify.post('/category/:cat/:page', async (request, reply) => {
        const { minPrice, maxPrice } = request.body

        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                // set includes as default cause we need them everywhere
                per_page: 12,
                page: request.params.page,
                include: 'images',
                //Filtering colors, sizes and price using the URL filter[options][tshirt-color].
            },
        }
        var taxon_id = request.params.cat
        axios
            .get(
                `/products?&filter[taxons]=${taxon_id}&fields[variant]=options_text&filter[price]=${minPrice},${maxPrice}`,
                requestConfig
            )
            .then((res) => reply.send(res.data))
    })

    fastify.post('/search/:search/:page', async (request, reply) => {
        const { minPrice, maxPrice } = request.body

        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                // set includes as default cause we need them everywhere
                per_page: 12,
                page: request.params.page,
                include: 'images',
                //Filtering colors, sizes and price using the URL filter[options][tshirt-color].
            },
        }
        var searchWord = request.params.search
        axios
            .get(
                `/products?&filter[name]=${searchWord}&fields[variant]=options_text&filter[price]=${minPrice},${maxPrice}`,
                requestConfig
            )
            .then((res) => reply.send(res.data))
    })
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
    }

    fastify.get('/bestsellers', async (request, reply) => {
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                // set includes as default cause we need them everywhere
                per_page: 4,
                page: getRandomIntInclusive(1, 8),
                include: 'images',
                //Filtering colors, sizes and price using the URL filter[options][tshirt-color].
            },
        }
        var taxon_id = request.params.cat
        axios
            .get(`/products?filter[taxons]=19`, requestConfig)
            .then((res) => reply.send(res.data))
    })
}

export default productController
