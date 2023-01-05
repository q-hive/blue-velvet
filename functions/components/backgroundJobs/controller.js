import nodeschedule from 'node-schedule';

export const stopJob = (jobid) => {
    const job = nodeschedule.scheduledJobs[jobid]

    if(job){
        job.cancel()
    }
}