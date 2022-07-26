import mongoose from '../mongo.js'

const { Schema } = mongoose

const Location = new Schema({
    latitude:  { type: Number, required: true },
    longitude: { type: Number, required: true }
})

export default Location