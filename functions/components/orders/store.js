//*db
import { mongoose } from '../../mongo.js';
let { ObjectId } = mongoose.Types;

//*Schema
import Organization, { organizationModel } from '../../models/organization.js';
import Order from '../../models/order.js';

//*UTILS
import { actualMonthInitialDate, addTimeToDate } from '../../utils/time.js';

//*Org controllers
import { getOrganizationById } from '../organization/store.js';

//*PRODUCTS CONTROLLERS
import { getAllProducts } from '../products/store.js';

import { buildProductionDataFromOrder } from '../production/controller.js';
import {
  getOrdersPrice,
  newOrderDateValidation,
  scheduleProduction,
  setOrderAbonment,
} from './controller.js';
import { getProductionByOrderId } from '../production/store.js';
import { getContainerById, getContainers } from '../container/store.js';
import moment from 'moment';

const orgModel = organizationModel;

export const getAllOrders = (
  orgId,
  req,
  filtered = false,
  filter = undefined,
  production = false
) => {
  return new Promise((resolve, reject) => {
    const orgIDNotProvided = {
      message: 'Organization ID was not provided',
      status: 400,
    };
    const errorFromOrg = {
      message: 'Error obtaining organization',
      status: 500,
    };

    if (!orgId) {
      return reject(new Error(JSON.stringify(orgIDNotProvided)));
    }

    getOrganizationById(orgId, true)
      .then(async (org) => {
        if (!Boolean(org)) return reject(new Error(errorFromOrg));

        let orgOrders = org.orders;

        try {
          if (filtered && filter) {
            const { key, value } = filter;
            if (value == 'uncompleted' && key == 'status') {
              orgOrders = orgOrders.filter((order) => {
                return (
                  order.status != 'delivered' && order.status !== 'cancelled'
                );
              });

              orgOrders.orders = orgOrders;
            } else {
              if (req && Boolean(req.query?.all)) {
                orgOrders = await orgModel.find(
                  {
                    _id: orgId,
                    [`orders.${key}`]: value,
                  },
                  'orders -_id'
                );

                orgOrders = orgOrders[0];
              } else {
                orgOrders = await orgModel.findOne(
                  {
                    _id: orgId,
                    [`orders.${key}`]: value,
                  },
                  'orders -_id'
                );

                if (key === '_id' && orgOrders !== null) {
                  orgOrders = orgOrders.orders.filter((order) =>
                    order[key].equals(value)
                  );
                }

                if (key !== '_id' && orgOrders !== null) {
                  orgOrders = orgOrders.orders.filter(
                    (order) => order[key] === value
                  );
                }
              }
            }
          }

          if (req === undefined) {
            return resolve(orgOrders);
          }

          // if(!Object.keys(req?.query).includes("production") && !Boolean(req.query?.production)){
          //     return resolve(orgOrders)
          // }

          if (!orgOrders) {
            return resolve([]);
          }

          const mappedOrders = orgOrders.map((order, orderIndex) => {
            // const production = getOrderProdData(order, org.containers[0].products, true)
            // const mutableOrdergetKey(task) = order.toObject()
            return order;
          });

          resolve(mappedOrders);
        } catch (err) {
          console.log(err);
          errorFromOrg.processError = err.message;
          reject(new Error(JSON.stringify(errorFromOrg)));
        }
      })
      .catch((err) => {
        console.log(err);
        errorFromOrg.processError = err.message;
        reject(new Error(JSON.stringify(errorFromOrg)));
      });
  });
};
export const getFilteredOrders = (
  orgId,
  req = undefined,
  production,
  filter = undefined
) => {
  return new Promise((resolve, reject) => {
    let key;
    let value;
    let mappedFilter;

    if (req === undefined) {
      if (filter !== undefined) {
        mappedFilter = filter;
      }
    } else {
      if (
        Object.keys(req.query).includes('key') &&
        Object.keys(req.query).includes('value')
      ) {
        key = req.query.key;
        value = req.query.value;
        mappedFilter = { key, value };
      } else if (req.params && filter === undefined) {
        key = Object.entries(req.params)[0][0];
        value = Object.entries(req.params)[0][1];
        mappedFilter = { key, value };
      }
    }

    getAllOrders(orgId, req, true, mappedFilter, production)
      .then((orders) => {
        if (orders === null) {
          resolve([]);
        }

        resolve(orders);
      })
      .catch((err) => {
        return reject('Error getting filtered orders');
      });
  });
};

export const getMonthlyOrders = (orgId) => {
  return new Promise((resolve, reject) => {
    organizationModel
      .findOne(
        { _id: mongoose.Types.ObjectId(orgId) },
        {
          orders: {
            $filter: {
              input: '$orders',
              as: 'order',
              cond: { $gte: ['$$order.created', actualMonthInitialDate()] },
            },
          },
        }
      )
      .then((data) => {
        console.log(data);
        resolve(data.orders);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getMonthlyOrdersByCustomer = (orgId, customerId) => {
  return new Promise((resolve, reject) => {
    organizationModel
      .findOne(
        { _id: mongoose.Types.ObjectId(orgId) },
        {
          orders: {
            $filter: {
              input: '$orders',
              as: 'order',
              cond: {
                $and: [
                  {
                    $gte: [
                      '$$order.created',
                      new Date(actualMonthInitialDate()),
                    ],
                  },
                  {
                    $lt: [
                      '$$order.created',
                      new Date(
                        new Date().getUTCFullYear(),
                        new Date().getUTCMonth() + 1,
                        1
                      ),
                    ],
                  },
                  {
                    $eq: [
                      '$$order.customer',
                      mongoose.Types.ObjectId(customerId),
                    ],
                  },
                ],
              },
            },
          },
        }
      )
      .then((data) => {
        console.log(data);
        resolve(data.orders);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteOrdersDirect = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const values = {
      _id: mongoose.Types.ObjectId(req.query.value),
    };

    let traysToReduce;
    try {
      traysToReduce = await organizationModel.aggregate([
        {
          $match: {
            _id: new ObjectId('636ae6a18453ae9796473eae'),
          },
        },
        {
          $unwind: {
            path: '$containers',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            containers: {
              production: true,
            },
          },
        },
        {
          $unwind: {
            path: '$containers.production',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    'containers.production.ProductionStatus': 'growing',
                  },
                  {
                    'containers.production.ProductionStatus': 'harvestReady',
                  },
                ],
                'containers.production.RelatedOrder': new ObjectId(
                  '63f0b112f9ba9d5c7d916af1'
                ),
              },
            ],
          },
        },
        {
          $group: {
            _id: 'trays',
            totalTrays: {
              $sum: '$containers.production.trays',
            },
          },
        },
      ]);

      traysToReduce = traysToReduce.reduce(
        (acum, actual) => acum + actual.totalTrays,
        0
      );

      console.log(traysToReduce);
    } catch (err) {
      reject(err);
    }

    const deletionOp = await organizationModel.updateOne(
      { _id: res.locals.organization },
      {
        $pull: {
          'containers.$[].production': {
            RelatedOrder: values[req.query.key],
          },
          orders: {
            [req.query.key]: values[req.query.key],
          },
        },
      }
    );

    console.log('Deletion op');
    console.log(deletionOp);

    organizationModel
      .updateOne(
        { _id: res.locals.organization },
        {
          $inc: {
            'containers.$[].available': traysToReduce,
          },
        }
      )
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};
export const deleteOrders = (orgId, orders) => {
  return new Promise(async (resolve, reject) => {
    const org = await getOrganizationById(orgId);
    const find = await orders.map(async (order) => {
      const found = await org.orders.find((ordr) => ordr._id.equals(order._id));

      return found;
    });

    Promise.all(find)
      .then((found) => {
        const operations = found.map(async (order) => {
          const operation = await orgModel.updateOne(
            { _id: orgId },
            {
              $pull: {
                orders: {
                  _id: order._id,
                },
              },
            }
          );
          return operation;
        });

        Promise.all(operations)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

export const insertOrderAndProduction = async (organization, order, allProducts, timezone) => {
  try {
      // Calculate the overhead
      const overhead = organization.containers[0].config.overhead / 100;
    
      // Build the production data for the order
      const production = await buildProductionDataFromOrder(
        order,
        allProducts,
        overhead,
        organization.containers[0]
      );

      // Calculate the total number of trays to use
      const totalTraysToUse = production.reduce(
        (acc, prod) => acc + prod.trays,
        0
      );

      // Schedule the production
      await scheduleProduction(
        organization._id,
        production,
        order,
        allProducts,
        timezone
      );

      // Update the organization's orders and available trays
      organization.orders.push(order);
      const available = organization.containers[0].available;
      organization.containers[0].available = available - totalTraysToUse;

      // Save the organization
      await organization.save();
      
  } catch(err) {
    console.log(err)
    throw new Error('Error creating order and production');
  }
}

export const createNewOrder = async (orgId, containerId, order, tz) => {
  try {
    // Generate a new ID for the order
    const id = new ObjectId();

    // Fetch all products for the organization
    const allProducts = await getAllProducts(orgId);

    // Fetch the organization
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      throw new Error('Could not find organization');
    }

    // Calculate the price of the order
    const price = getOrdersPrice(order, allProducts);
    if (price === undefined || price === null) {
      throw new Error('There was an error calculating the price');
    }
    
    // Convert the order date to a moment object in the user's timezone
    const deliveryDate = moment(order.date).tz(tz).startOf('day');

    // Find parameters of the product
    const productParams = (allProducts, actualProduct) => {
      if (actualProduct.mix.isMix) {
        const allParameters = actualProduct.mix.products.map((prod) => {
          const dbProduct = allProducts.find((product) =>
            product._id.equals(prod.strain)
          );
          return dbProduct.parameters;
        })
        return allParameters
      }
      return actualProduct.parameters
    }

    // Map the products in the order to the full product data from the database
    const mappedProducts = order.products.map((prod) => {
      const dbProduct = allProducts.find((product) =>
        product._id.equals(prod._id)
      );

      // Base order object
      let orderProduct = {
        _id: prod._id,
        name: prod.name,
        seedId: dbProduct?.seed?.seedId,
        packages: prod.packages,
        mix: dbProduct.mix.isMix,
        price: dbProduct.price,
        parameters: productParams(allProducts, dbProduct),
      };

      // If the product is a mix, add the mix status
      if (dbProduct.mix.isMix) {
        return {
          ...orderProduct,
          status: prod.status,
          mixStatuses: prod.mixStatuses,
        };
      }

      // If the product is not a mix, add the product status
      return {
        ...orderProduct,
        status: prod.status,
      };
    });
    // Map the products in the order to the full product data from the database
    const secondProducts = order.products.map((prod) => {
      const dbProduct = allProducts.find((product) =>
        product._id.equals(prod._id)
      );

      // Base order object
      let orderProduct = {
        _id: prod._id,
        name: prod.name,
        seedId: dbProduct?.seed?.seedId,
        packages: prod.packages,
        mix: dbProduct.mix.isMix,
        price: dbProduct.price,
        parameters: productParams(allProducts, dbProduct),
      };

      // If the product is a mix, add the mix status
      if (dbProduct.mix.isMix) {
        return {
          ...orderProduct,
          status: prod.status,
          mixStatuses: prod.mixStatuses,
        };
      }

      // If the product is not a mix, add the product status
      return {
        ...orderProduct,
        status: prod.status,
      };
    });

    // Create the order object
    let orderMapped = {
      _id: id,
      organization: orgId,
      next: null,
      deliveredBy:null,
      customer: order.customer._id,
      price: price,
      date: deliveryDate,
      address: order.address,
      products: mappedProducts,
      status: order.status,
      cyclic: order.cyclic,
    };

    const orderStatuses = Array.from(
      new Set(orderMapped.products.map((prod) => prod.status))
    );
    
      if(!order.cyclic){
        await insertOrderAndProduction(organization, orderMapped, allProducts, tz)

        return getFeedbackOfProduction(orgId, containerId, orderMapped._id)
      }

      if(order.cyclic){
        let tempId = new ObjectId();
        let tempOrder = {
          _id: tempId,
          organization: orgId,
          customer: order.customer._id,
          next:null,
          deliveredBy:null,
          price: price,
          address: order.address,
          products: secondProducts,
          cyclic: order.cyclic,
          status: orderStatuses.length === 1 ? orderStatuses[0] : 'production',
          date: orderMapped.date.clone().date(orderMapped.date.date() + 7).tz(tz),
        };

        orderMapped.next = tempId
        await insertOrderAndProduction(organization, orderMapped, cloneArray(allProducts), tz)
        await insertOrderAndProduction(organization, tempOrder, allProducts, tz)

        return getFeedbackOfProduction(orgId, containerId, orderMapped._id)
      }
      
      throw new Error("Unrecognized configuration of order");
    
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const cloneArray = (arrayData) => {
  return arrayData.map((data) => {
    if (typeof(data) === 'object'){
      const newData = JSON.parse(JSON.stringify(data))
      if(data._id){
        newData._id = new ObjectId(data._id)
      }
      return newData
    }
    if (Array.isArray(data)) {
      return cloneArray(data)
    }
    return data
  });
}

const getFeedbackOfProduction = async (orgId, containerId, orderId) => {
  try {
    const productionModels = await getProductionByOrderId(orgId, containerId, orderId);
    console.log("[PRODUCTION SCHEDULED]")
    const productionData = productionModels.map((prodMod,index) => {
      console.log(`[${index}] -> "${prodMod.ProductName}" to "${prodMod.startProductionDate.toISOString()}" on status: "${prodMod.ProductionStatus}"`)
      return {
        name: prodMod.ProductName,
        startDate: prodMod.startProductionDate,
        status: prodMod.ProductionStatus,
      };
    });
    return productionData;
  } catch (err) {
    console.log(err);
    throw new Error('Error getting production');
  }
};


export const insertNewOrderWithProduction = async (
  orgId,
  order,
  production
) => {
  try {
    await organizationModel.updateOne(
      {
        _id: mongoose.Types.ObjectId(orgId),
      },
      {
        $push: {
          orders: order,
          'containers.$[].production': { $each: production },
        },
      }
    );
  } catch (err) {
    console.log('Error saving order and production');
    console.log(err);
  }
};

export const getOrdersByProd = (orgId, id) => {
  return new Promise(async (resolve, reject) => {
    // TODO: Corregir query
    const orgOrdersByProd = await orgModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(orgId),
          'orders.products._id': mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: '$orders',
      },
      {
        $match: {
          'orders.products._id': mongoose.Types.ObjectId(id),
        },
      },
    ]);
    const mapOrdersFromAggregation = orgOrdersByProd.map((orgModel) => {
      return orgModel.orders;
    });

    resolve(mapOrdersFromAggregation);
  });
};

// Permite actualizar la orden normalmente y los productos segun el status finalizado
export const updateOrder = async (
  org,
  orderId,
  body,
  productId = undefined,
) => {
  let allProducts, price;

  try {
    allProducts = await getAllProducts(org);
    const orders = await getOrderById(org, orderId);

    if (orders && orders.length === 1 && orders[0]) {
      price = await getOrdersPrice(orders[0], allProducts);
    } else {
      throw new Error('Error getting order price');
    }
  } catch (err) {
    console.log(err);
    throw new Error(
      err.message === 'getAllProducts'
        ? 'Error getting all products'
        : 'Error getting order price'
    );
  }

  let updateFields = {};

  if (body.paths) {
    body.paths.forEach(({ path, value }) => {
      updateFields[`orders.$.${path}`] = value;
      if (productId) updateFields[`orders.$.products.$[prod].${path}`] = value;
    });
  } else {
    Object.entries(body).forEach(([key, value]) => {
      updateFields[`orders.$.${key}`] = key === 'price' ? price : value;
    });
  }

  let additionalOptions = {};
  if (productId) {
    additionalOptions.arrayFilters = [{ 'prod._id': productId }];
  }

  return await orgModel
    .findOneAndUpdate(
      { _id: org, 'orders._id': orderId },
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
        ...additionalOptions,
      }
    )
    .exec()
    .catch((err) => {
      console.error(err);
      throw new Error('Error updating order');
    });
};

export const updateManyOrders = (filter, update) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updateResult = await orgModel.updateOne(filter, update);
      resolve(updateResult);
    } catch (err) {
      reject(err);
    }
  });
};

export const getOrderById = async (orgId, orderId) => {
  const filter = {
    key: '_id',
    value: orderId,
  };

  const orders = await getFilteredOrders(orgId, undefined, false, filter);

  return orders;
};
//* production status
//* seeding
//* growing -- 2 days p/w 7am
//* harvestReady
//* harvested
//* packaged
//* delivered

//* payment status
//* unpaid
//* paid
