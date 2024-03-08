import { Schema, model } from 'mongoose'

 const bookSchema = Schema({
    name: {
        type: String,
        require: [true, 'Name is require']
    },
    author: {
        type: String,
        require: [true, 'Author is require']
    },
    edition: {
        type: String,
        require: [true, 'Edition is require']
    },
    status:{
        type: String,
        enum: ['AVAILABLE', 'TAKEN'],
        default: 'AVAILABLE'
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        require: true

    }
}, {
    versionkey: false
})

export default model('book', bookSchema)