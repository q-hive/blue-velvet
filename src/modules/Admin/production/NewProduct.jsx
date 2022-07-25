import React from 'react'
import { MixProductsForm } from './TypeOfProductsForms/MixProductsForm'
import { SimpleProductForm } from './TypeOfProductsForms/SimpleProductForm'

export const NewProduct = (props) => {
  const isMix = window.location.search.startsWith("?") && window.location.search.includes("mix") && window.location.search.includes("true") 

  let productToEdit

  if(props.edit){
    let id = new URLSearchParams(window.location.search).get("id")
    productToEdit = JSON.parse(window.localStorage.getItem('products')).data.find((prod) => prod._id === id)
  }
  return (
    <div>
        {
            isMix
            ?
            <MixProductsForm editing={props.edit} product={productToEdit}/>
            :
            <SimpleProductForm editing={props.edit} product={productToEdit}/>
        
        }
    </div>
  )
}
