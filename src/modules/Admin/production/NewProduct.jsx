import React from 'react'
import { MixProductsForm } from './TypeOfProductsForms/MixProductsForm'
import { SimpleProductForm } from './TypeOfProductsForms/SimpleProductForm'

export const NewProduct = () => {
    const isMix = window.location.search.startsWith("?") && window.location.search.includes("mix") && window.location.search.includes("true") 
  return (
    <div>
        {
            isMix
            ?
            <MixProductsForm/>
            :
            <SimpleProductForm/>
        
        }
    </div>
  )
}
