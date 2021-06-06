/* eslint-disable import/extensions */
import axios from 'axios'
import storefrontRequestConfig from '../../../../config/storefrontRequestConfig.js'

const ITEMS_PER_PAGE = 9

const taxonController = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        // get params from incoming request
        const { page } = request.query || 1
        // Configuration for the storefront request
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                page,
                per_page: ITEMS_PER_PAGE,
                include: 'children,image',
            },
        }
        // Request to the Storefront API
        axios
            .get('/taxons', requestConfig)
            .then((response) => {
                const data = []
                response.data.data.forEach((attr) => {
                    data.push({
                        id: attr.id,
                        type: attr.type,
                        attributes: attr.attributes,
                    })
                })
                // reply with fetched data
                reply
                    .status(response.status)
                    .send({ success: true, data: response.data })
            })
            .catch((error) => {
                // reply with an error message
                console.error(error.message)
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })
    })

    fastify.get('/parent/:id', async (request, reply) => {
        const { page } = request.query || 1
        const parent = request.params.id || 1
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                page,
                per_page: 8,
                include: 'parent,taxonomy,children,image',
                'filter[parent_id]': parent,
            },
        }
        axios
            .get(`/taxons`, requestConfig)
            .then((response) => {
                const taxons = {}
                const taxonImages = {}
                const taxonomys = {}
                response.data.included.forEach((inc) => {
                    if (inc.type === 'taxon') {
                        taxons[inc.id] = inc
                    } else if (inc.type === 'taxon_image') {
                        taxonImages[inc.id] =
                            inc.attributes.styles[
                                inc.attributes.styles.length - 1
                            ]
                    } else if (inc.type === 'taxonomy') {
                        taxonomys[inc.id] = inc
                    } else {
                        console.log(inc)
                    }
                })
                const data = []
                response.data.data.forEach((item) => {
                    const itm = {
                        id: item.id,
                        ...item.attributes,
                        // taxonomy: {},
                        image: {},
                    }
                    // itm.taxonomy = taxonomys[item.relationships.taxonomy.data.id]
                    if (item.relationships.image.data !== null) {
                        itm.image =
                            taxonImages[item.relationships.image.data.id]
                    }
                    data.push(itm)
                })
                reply.status(response.status).send({ success: true, data })
            })
            .catch((error) => {
                console.error(error.message)
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })
    })
    fastify.get('/single/:id', async (request, reply) => {
        const requestConfig = {
            ...storefrontRequestConfig,
            params: {
                per_page: 8,
            },
        }
        axios
            .get(`/taxons/${request.params.id}`, requestConfig)
            .then((response) => {
                // extract attributes from response.data.data
                const data = (({ id, type, attributes, relationships }) => ({
                    id,
                    type,
                    attributes,
                    relationships,
                }))(response.data.data)

                reply.status(response.status).send({ success: true, data })
            })
            .catch((error) => {
                console.error(error.message)
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })
    })
}
export default taxonController
