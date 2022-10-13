import React from 'react'
import { useLocation } from 'react-router-dom'
import { NewCustomer } from '../../modules/Admin/Client/NewCustomer'
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
