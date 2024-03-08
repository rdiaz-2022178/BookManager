import Category from '../category/category.model.js'
import Book from './book.model.js'


export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const add = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let book = new Book(data)
        await book.save()
        return res.send({ message: 'a new book was created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'saving error' })
    }
}
