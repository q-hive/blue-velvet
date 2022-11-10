import React from 'react'
import { MixProductsForm } from './TypeOfProductsForms/MixProductsForm'
import { SimpleProductForm } from './TypeOfProductsForms/SimpleProductForm'

export const NewProduct = (props) => {
  const isMix = window.location.search.startsWith("?") && window.location.search.includes("mix") && window.location.search.includes("true") 

  let productToEdit

  if(props.edit){
    let id = new URLSearchParams(window.location.search).get("id")
    productToEdit = JSON.parse(window.localStorage.getItem('products')).find((prod) => prod._id === id)
    console.log(productToEdit)

  }
  return (
    <div>
        {
            isMix || productToEdit.mix.isMix 
            ?
            <MixProductsForm editing={props.edit} product={productToEdit}/>
            :
            <SimpleProductForm editing={props.edit} product={productToEdit}/>
        
        }
    </div>
  )
}
