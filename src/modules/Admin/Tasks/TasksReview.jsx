import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { TaskContainer } from '../../../CoreComponents/TasksPresentation/TaskContainer'

export const TasksReview = () => {
    const params = useParams()
    const {state} = useLocation()

    const [snack, setSnack] = useState({
        open:false,
        state:"",
        message:""
    });
  return (
    <div>
        {TaskContainer(
            { 
                type: params.task || null, 
                // counter:canSeeNextTask.counter, 
                // setFinished:setCanSeeNexttask,
                setSnack:setSnack,
                snack:snack,
                // stepInList:index,
                // updatePerformance: updateEmployeePerformance,
                // setWorkContext: setWorkContext,
                products: state.workData[params.task],
                packs: state.packs,
                deliverys: state.deliverys
            }
        )}
    </div>
  )
}
