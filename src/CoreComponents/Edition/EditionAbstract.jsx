import React from 'react'
import { useLocation } from 'react-router-dom'
import { NewCustomer } from '../../modules/Admin/Client/NewCustomer'
import { NewOrder } from '../../modules/Admin/Sales/newOrders/NewOrder'
import { EditionContainer } from './EditionContainer'

export const EditionAbstract = () => {
    const useQuery = () => new URLSearchParams(useLocation().search)
    const query = useQuery()
    const params = query.get('type')
    console.log(params)
    const getInputsComponent = () => {
        switch(params){
            case 'customer':
                return <NewCustomer/>
            case 'order':
                return <NewOrder/>
            default:
                return <div></div>
        }
    
    }
    
  return (
    <EditionContainer>
        {getInputsComponent()}
    </EditionContainer>
  )
}
