import React from 'react'
import { useLocation } from 'react-router-dom'
import { NewCustomer } from '../../modules/Admin/Client/NewCustomer'
import { NewEmployee } from '../../modules/Admin/Employee/NewEmployee'
import { NewOrder } from '../../modules/Admin/Sales/newOrders/NewOrder'
import { EditionContainer } from './EditionContainer'

export const EditionAbstract = () => {
    const useQuery = () => new URLSearchParams(useLocation().search)
    const query = useQuery()
    const params = query.get('type')
    
    const getInputsComponent = () => {
        switch(params){
            case 'customer':
                return <NewCustomer/>
            case 'order':
                return <NewOrder/>
            case 'employee':
                return <NewEmployee/>
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
