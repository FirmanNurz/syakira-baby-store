const { Op } = require('sequelize');
const { Product } = require('../models');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ProductController {
    static async getAll(req, res, next) {
        try {
            const { search } = req.query

            let where = {};
            if (search) {
                where.name = {
                    [Op.iLike]: `%${search}%`
                }
            }

            const product = await Product.findAll({ where })

            res.status(200).json({
                product
            })

        } catch (err) {
            console.log(err, "di product getAll");
            
            next(err)
        }
    }

    static async getOne(req, res, next) {
        try {
            const { id } = req.params

            if (isNaN(id)) throw { name: 'BadRequest', message: 'Product ID harus berupa angka' }

            const product = await Product.findByPk(id)

            if (!product) throw { name: 'NotFound' }

            res.status(200).json({
                product
            })
        } catch (err) {
            next(err)
        }
    }

    static async gemini(req, res, next) {
        try {
            const product = await Product.findAll()

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
            const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

            const prompt = `Kasih 
            saya 10 rekomendasi Product apa yang paling rekomendasi untuk 7 hari terakhir 
            ini oleh Google, berdasarkan data yang tersedia, dan ini lah datanya ${JSON.stringify(product)},
            dan kelompokan sesuai dengan kategori yang ada disitu, saya mau juga ganti ganti rekomendasinya gamau yang sama terus acak aja,berikan datanya dalam bentuk JSON tanpa 
            tag dan tanpa enter atau'\' dan tambahkan kata kata yang menarik seperti ini 'This Our 
            Recommendation On Google in 7 Days'`

            const result = await model.generateContent(prompt)
            const response = await result.response
            const text = JSON.parse(response.text())


            res.status(200).json({
                text
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ProductController;