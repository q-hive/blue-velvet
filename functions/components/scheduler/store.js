import Scheduler from "../../models/scheduler.js";

export const insertScheduler = async (data) => {
  try {
    const newScheduler = await Scheduler.create(data);
    console.log("Schedule has been added to the database.");
    return newScheduler;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating schedule on DB.");
  }
}

export const findSchedulersByCriteria = async (orgId, orderId, productId = null) => {
  try {
    const query = {
      OrganizationId: orgId,
      OrderId: orderId,
    };

    if (productId) {
      query.ProductId = productId;
    }

    const matchingSchedulers = await Scheduler.find(query);

    return matchingSchedulers;
  } catch (error) {
    console.log(error);
    throw new Error("Error finding schedulers in DB.");
  }
};
