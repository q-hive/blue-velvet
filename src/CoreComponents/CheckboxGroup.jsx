import { Alert, AlertTitle, Checkbox, FormControlLabel, Snackbar, Stack, Typography } from '@mui/material';
import React, { useReducer } from 'react';  


const reducer = (state, action) => {
  if (state.checkedIds.includes(action.id)) {
    return {
      ...state,
      checkedIds: state.checkedIds.filter(id => id !== action.id),
      filled:true

    }
  }
  
  if (state.checkedIds.length >= 1) {
    console.log('You can only select one size')
    return {...state,filled:true}
  }
  
  return {
    ...state,
    checkedIds: [
      ...state.checkedIds,
      action.id
    ]
  }
}
const showAlert = () => {
  return (
    <Alert severity="warning">
    <AlertTitle>Warning</AlertTitle>
      This is a warning alert — <strong>check it out!</strong>
    </Alert>
  )
}


export const CheckBoxGroup = (props) => {
  console.log(props)
  const initialState = { checkedIds: [],filled:false }
  const [state, dispatch] = useReducer(reducer, initialState)
  const [snackState, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal } = snackState;

  const [open, setOpen] = React.useState(false);
  

  const snackbarCheck = () => {
    if(state.filled){ setOpen(true)};
  };

  const changeFilled = () => {

    setOpen(false)
  }  
  return (
    <>
    
        <Stack direction="row" >
            {children.map(({ id, label }) => (
                <FormControlLabel 
                    key={id} 
                    control={
                        <Checkbox 
                            onChange={() => {
                              
                              dispatch({ id })
                              snackbarCheck()
                              props.valueUpdate({
                                ...props.valueState,
                                size: label
                              }) 
                            }} 
                            checked={state.checkedIds.includes(id)}/>
                        } 
                    label={label}/>
                   
                ))
            }
        </Stack>


        <Snackbar
          anchorOrigin={ {vertical:"top",horizontal: "center"} }
          open={open}
          autoHideDuration={3000}
          onClose={changeFilled}
          message="Sólo puedes seleccionar un tamaño"
          key={"top" + "center"}
        />
      </>
    
  )
};

