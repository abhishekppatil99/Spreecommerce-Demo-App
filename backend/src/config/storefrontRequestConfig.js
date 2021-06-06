const { STOREFRONT_API_URL, REQUEST_TIMEOUT } = process.env

export default {
    baseURL: STOREFRONT_API_URL,
    timeout: parseInt(REQUEST_TIMEOUT, 10),
    headers: {
        'Content-Type': 'application/json',
    },
}
