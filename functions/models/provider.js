import mongoose from 'mongoose'
import Seed from './seed.js'

const { Schema } = mongoose

const Provider = new Schema({
    email: { type: String, required: true },
    name:  { type: String, required: true },
    seeds: { type: [Seed], required: true }
})

export default Provider