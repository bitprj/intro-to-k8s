const { StatusCodes } = require('http-status-codes');
const fetch = require('node-fetch')
class ProductResetController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const cartKeys = await this.redisClientService.scan('cart:*');

        for (const key of cartKeys) {
            await this.redisClientService.del(key);
        }

        let result = await fetch('http://gateway-service:80/catalog')
        let products = await result.json()
        products = products.result
        console.log(products)
        for (const product of products) {
            var { Description } = product;
            console.log(Description)
            await this.redisClientService.jsonSet(`product:${Description}`, '.', JSON.stringify(product));
            productList.push({product});
        }

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductResetController;