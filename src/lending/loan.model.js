import { Schema, model } from 'mongoose'

const loanSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'book',
        require: true
    },
    egress: {
        type: Date,
        default: Date.now
    },
    entry: {
        type: Date,
        require: true
    }

}, {
    versionKey: false
})

export default model('loan', loanSchema)