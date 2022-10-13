import React from 'react'
import { useLocation } from 'react-router-dom'

export const EditionContainer = ({children}) => {
    const {state} = useLocation() 
  return (
    <div>
        {React.cloneElement(
            children, 
            {
                edit: {
                    isEdition:true, 
                    values: state.edition
                }
            
            }
        )
        }
    </div>
  )
}
