import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import React, { useReducer } from 'react';  


const reducer = (state, action) => {
  if (state.checkedIds.includes(action.id)) {
    return {
      ...state,
      checkedIds: state.checkedIds.filter(id => id !== action.id)
    }
  }
  
  if (state.checkedIds.length >= 1) {
    console.log('You can only select one size')
    return state;
  }
  
  return {
    ...state,
    checkedIds: [
      ...state.checkedIds,
      action.id
    ]
  }
}


export const CheckBoxGroup = ({valueState, valueUpdate,children}) => {
  const initialState = { checkedIds: [] }
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    
        <Stack direction="row" >
            {children.map(({ id, label }) => (
                <FormControlLabel 
                    key={id} 
                    control={
                        <Checkbox 
                            onChange={() => {
                              dispatch({ id })
                              valueUpdate({
                                ...valueState,
                                size: label
                              })
                            }} 
                            checked={state.checkedIds.includes(id)}/>
                        } 
                    label={label}/> 
                ))
            }
        </Stack>
    
  )
};

