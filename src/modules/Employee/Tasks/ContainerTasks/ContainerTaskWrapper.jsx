import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { TaskContainer } from '../../../../CoreComponents/TasksPresentation/TaskContainer';

export const ContainerTaskWrapper = () => {
    const {state} = useLocation()

    console.log(state.type)
    
    const [snack, setSnack] = useState({
        open:false,
        state:"",
        message:""
    });
    
  return (
    <div>
        {TaskContainer({
             type: state.type || null, 
             // counter:canSeeNextTask.counter, 
             // setFinished:setCanSeeNexttask,
             setSnack:setSnack,
             snack:snack,
             // stepInList:index,
             // updatePerformance: updateEmployeePerformance,
             // setWorkContext: setWorkContext,
             products: [],
             packs: [],
             deliverys: []
        })
        }
    </div>
  )
}
