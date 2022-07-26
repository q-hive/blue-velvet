import mongoose from '../mongo.js'
import Location from './location.js'

const { Schema } = mongoose

const Address = new Schema({
    stNumber:   { type: String,   required: true  },
    street:     { type: String,   required: true  },
    zip:        { type: String,   required: true  },
    city:       { type: String,   required: true  },
    state:      { type: String,   required: true  },
    country:    { type: String,   required: true  },
    references: { type: String,   required: false },
    coords:     { type: Location, required: false }
},
{
    timestamps: {
        "createdAt": "created",
        "updatedAt": "updated"
    },
    query: {
        byCity(city) {
            return this.where({ city: new RegExp(city, 'i') })
        },
        byState(state) {
            return this.where({ state: new RegExp(state, 'i') })
        },
        byCountry(country) {
            return this.where({ country: new RegExp(country, 'i') })
        },
        byZip(zip) {
            return this.where({ zip: new RegExp(zip, 'i') })
        }
    }
})

export default Address