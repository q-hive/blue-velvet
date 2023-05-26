import express from 'express';
import { error, success } from '../../network/response.js';
import { updateOrder } from '../orders/store.js';
import { stopJob } from './controller.js';

const backgroundRouter = express.Router();

backgroundRouter.post('/stopJob/:jobid', async (req, res) => {
    try {
        stopJob(req.params.jobid)

        console.log(req.params.jobid.split('-')[1]   +  " Order job has been stopped and update is going to happen")
        if(req.params.jobid.split('-')[0] === "Reorder"){
            const updateResult = await updateOrder(res.locals.organization,req.params.jobid.split('-')[1], {paths:[{path:"cyclic", value:false},{path:"job", value:"No Job"}]})

            console.log(updateResult)
        }
    } catch (err) {
        error(req, res, 500, "Error stopping job", err);
        return
    }

    success(req, res, 204, `Successfully stoped ${req.params.jobid} job`)

    
})

export default backgroundRouter;