import { areSameDay } from "../../utils/time.js";
import { getCustomerById } from "../customer/store.js";
import { updateManyOrders } from "./store.js";

import nodeschedule from "node-schedule";
import {
  buildProductionDataFromOrder,
  getInitialStatus,
} from "../production/controller.js";
import { getOrganizationById } from "../organization/store.js";
import { organizationModel } from "../../models/organization.js";
import mongoose from "mongoose";

const sortProductsPrices = (order, products) => {
  const orderProducts = order.products.map((prod) => {
    return { prodId: prod._id, packages: prod.packages };
  });

  //*We will save the sorted prods in an array
  const sortedProducts = [];

  //*Iterate over the requested order products
  orderProducts.forEach((element) => {
    //*For each product we search for equility in DB by ID so we can acces
    //*to the price based on size for each product
    const prodFound = products.find((prod) => {
      return prod._id.equals(element.prodId);
    });
    if (!prodFound) {
      return;
    }
    //*Bubble sort algorithm
    prodFound.price.forEach((price, idx) => {
      //*If next element of prices in product found from DB is undefined
      //*Then we are in the last element, finish algorithm
      if (prodFound.price[idx + 1] === undefined) {
        return;
      }

      //*If package from actual index is bigger than the next package size
      if (price.packageSize > prodFound.price[idx + 1].packageSize) {
        //*We swap actual product price with next product price
        prodFound.price[idx] = prodFound.price[idx + 1].packageSize;
      }
    });

    const mixProducts = [];
    if (prodFound.mix.isMix) {
      prodFound.mix.products.forEach((strain) => {
        let mixProd = products.find((prod) => prod._id.equals(strain.strain));

        mixProd.price.forEach((prc, idx) => {
          //*If next element of prices in product found from DB is undefined
          //*Then we are in the last element, finish algorithm
          if (mixProd.price[idx + 1] === undefined) {
            return;
          }

          //*If package from actual index is bigger than the next package size
          if (prc.packageSize > mixProd.price[idx + 1].packageSize) {
            //*We swap actual product price with next product price
            mixProd.price[idx] = mixProd.price[idx + 1].packageSize;
          }
        });
        sortedProducts.push(mixProd);
      });
    }
    //*Insert sorted products prices in reference
    return sortedProducts.push(prodFound);
  });

  return sortedProducts;
};

export const getOrdersPrice = (order, products) => {
  try {
    //*Filter unnecesary data from prods object
    const orderProducts = order.products.map((prod) => {
      return { prodId: prod._id, packages: prod.packages };
    });
    /* 
    *Exists the posibility that the DB return or save the prices unsorted
    we need the prices sorted by package size so we can make a reference based 
    its index, from small to large package size, then package[0] must the smaller available
    */
    const sortedProducts = sortProductsPrices(order, products);

    //*Iterate and mutate the order products to make calculation based on each package
    const calculatedTotals = orderProducts.map((prod) => {
      const dbSortedProd = sortedProducts.find((fprod) =>
        fprod._id.equals(prod.prodId)
      );
      //*If we found the actual product in the sorted array from DB then
      if (dbSortedProd) {
        //*Iterate over the product order packages
        let newPackages = prod.packages.map((pkg, idx) => {
          switch (pkg.size) {
            //*we have 2 types of sizes and with the sorted products we can access based on index
            case "small":
              //*Total per product will be the number of determined package size
              //* multiplied by amount(price) of corresponding size y productFromDB
              return {
                ...pkg,
                total: dbSortedProd.price[0].amount * pkg.number,
              };
            case "medium":
              return {
                ...pkg,
                total: dbSortedProd.price[1].amount * pkg.number,
              };
          }
        });

        prod.packages = newPackages;

        return prod;
      }
    });

    //*Now we have the total per package
    //*Iterate over the products now with totals per package
    const finalTotalPerProd = calculatedTotals.map((prodwithtotal) => {
      //*Reduce the totals per package to a total per product
      const finalTotal = prodwithtotal.packages.reduce((prev, curr, idx) => {
        console.log("Current product to get total", curr);
        return prev + curr.total;
      }, 0);

      return { ...prodwithtotal, total: finalTotal };
    });

    //*Reduce finalTotalPerProd to a total per order
    const orderTotal = finalTotalPerProd.reduce((prev, curr, idx) => {
      return prev + curr.total;
    }, 0);
    //*RETURN ORDER TOTAL
    console.log("Total de la orden", orderTotal);

    return orderTotal;
  } catch (err) {
    throw new Error(err);
  }
};

export const newOrderDateValidation = (order, allProducts = undefined) => {
  const deliveryDateLeftDays = parseInt(
    (new Date(order.date) - new Date()) / 1000 / 60 / 60 / 24
  );

  if (deliveryDateLeftDays < 7) {
    throw new Error(
      "Invalid date, must be a delivery date after the total production times."
    );
  }

  const completeObjectProducts = order.products.map((orderProduct) =>
    allProducts.find((dbProduct) => dbProduct._id.equals(orderProduct._id))
  );

  const times = completeObjectProducts.flatMap((product) => {
    if (product.mix.isMix) {
      const mixProductsCompleteObjects = product.mix.products.map((mixProd) =>
        allProducts.find((dbProd) => dbProd._id.equals(mixProd.strain))
      );
      console.log(mixProductsCompleteObjects);

      const mixTimes = mixProductsCompleteObjects.map(
        (mixProd) => mixProd.parameters.day + mixProd.parameters.night
      );

      return mixTimes;
    }
    return product.parameters.day + product.parameters.night;
  });

  const maxTime = Math.max(...times);

  if (deliveryDateLeftDays < maxTime) {
    throw new Error(
      "Invalid date, must be a delivery date after the total production times."
    );
  }
};

export const updateAllOrders = async (orgId, update) => {
  try {
    const result = await updateManyOrders({ _id: orgId }, update);
    // await updateProductionWithOrderUpdate()
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

export const groupOrdersByDate = (
  orders,
  date = undefined,
  outputFormat = undefined
) => {
  const hash = {},
    result = [];
  let useOrderDate = true;
  if (date !== undefined) {
    orders = orders.filter((order) => areSameDay(order.date, date));
    useOrderDate = false;
  }

  if (date === undefined) {
    useOrderDate = true;
  }

  orders.forEach((order) => {
    if (useOrderDate) {
      if (
        !hash[
          `${order.date.getDate()}-${
            order.date.getMonth() + 1
          }-${order.date.getFullYear()}`
        ]
      ) {
        hash[
          `${order.date.getDate()}-${
            order.date.getMonth() + 1
          }-${order.date.getFullYear()}`
        ] = {
          ...order.toObject(),
        };
        result.push({
          [`${order.date.getDate()}-${
            order.date.getMonth() + 1
          }-${order.date.getFullYear()}`]:
            hash[
              `${order.date.getDate()}-${
                order.date.getMonth() + 1
              }-${order.date.getFullYear()}`
            ],
        });
      }
    } else {
      if (!hash[date]) {
        hash[date] = {
          ...order.toObject(),
        };
        result.push({
          [`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`]:
            hash[date],
        });
      }
    }
  });

  if (outputFormat === "hash") {
    return hash;
  }

  return result;
};

export const groupOrdersForPackaging = (orders, date = undefined) => {
  const hash = {},
    result = [];
  orders.forEach((order) => {
    order.products.forEach((product) => {
      if (!hash[product.name]) {
        hash[product.name] = {
          packages: {
            small: 0,
            medium: 0,
            large: 0,
          },
        };
        result.push({ [product.name]: hash[product.name] });
      }

      product.packages.forEach((pkg) => {
        hash[product.name].packages[pkg.size] += +pkg.number;
      });
    });
  });
  return result;
};

export const groupOrdersForDelivery = async (orders, date = undefined) => {
  const mappedProducts = (products) => {
    const map = products.map((product) => {
      const packagesHash = {};
      for (const { size, number, grams, _id } of product.packages) {
        if (!packagesHash[size]) {
          packagesHash[size] = 0;
        }

        packagesHash[size] += +number;
      }

      return { ProductName: product.name, packages: packagesHash };
    });

    return map;
  };

  const hash = {},
    result = [];
  await Promise.all(
    orders.map(async (order) => {
      console.log("Groupping orders of the customer: " + order.customer);
      const customer = await getCustomerById(
        order.organization,
        order.customer
      );

      if (!hash[order.customer.toString()]) {
        hash[order.customer.toString()] = {
          customerName: customer.name,
          customerAdreess: customer.address.street,
          orders: [],
        };

        result.push(hash[order.customer.toString()]);
      }

      hash[order.customer.toString()].orders.push({
        _id: order._id,
        products: mappedProducts(order.products),
        price: order.price,
      });
    })
  );

  return result;
};

export const groupOrders = (criteria, orders, groupValue) => {
  let grouppedOrders;

  if (criteria === "date") {
    if (groupValue !== undefined) {
      grouppedOrders = groupOrdersByDate(orders, groupValue);
    }

    if (groupValue === undefined) {
      grouppedOrders = groupOrdersByDate(orders);
    }
  }

  return grouppedOrders;
};

export const groupOrdersForMonthlyInvoice = (orders, customerData) => {
  const Model = {
    customer: {
      clientName: "",
      clientAddress: "customer.address.street",
      adressContainer: {
        city: "customer.address.city",
        state: "customer.address.state",
        cp: "customer.address.zip",
      },
    },
    totalIncome: 0,
    orders: [],
    products: [{}],
  };

  try {
    Model.customer["clientName"] = customerData.name;
    Model.customer["clientAddress"] = customerData.address.street;
    Model.customer["adressContainer"]["city"] = customerData.address.city;
    Model.customer["adressContainer"]["state"] = customerData.address.state;
    Model.customer["adressContainer"]["cp"] = customerData.address.zip;
  } catch (err) {
    throw new Error("Error building customer model for monthly invoice");
  }

  try {
    orders.forEach((order) => {
      Model.orders.push({ _id: order._id, created: order.created });
    });
  } catch (err) {
    throw new Error("Error processing orders to build monthly invoice");
  }

  try {
    const mappedOrdersProducts = orders.map((order) => {
      const product = order.products.map((product) => {
        const mapProd = product.packages.map((pack) => {
          let indexSize;
          switch (pack.size) {
            case "small":
              indexSize = 0;
            case "medium":
              indexSize = 1;
            case "large":
              indexSize = 2;
          }

          return {
            size: pack.size,
            price: product.price[0].amount / product.price[0].packageSize,
            qty: pack.number,
            total:
              (product.price[0].amount / product.price[0].packageSize) *
              pack.number,
          };
        });
        const total = mapProd.reduce((prev, curr) => {
          return prev + curr.total;
        }, 0);

        return { product: mapProd, total: total };
      });

      return { reducedProducts: product };
    });
  } catch (err) {
    throw new Error("Error reducing products to build monthly invoice");
  }
};

export const buildOrderFromExistingOrder = (
  orderData,
  oldOrderObject,
  allProducts
) => {
  let newOrder = {};

  const deliveryDate = orderData.date;
  const creationDate = orderData.created;
  console.log(deliveryDate.getTime());
  console.log(creationDate.getTime());
  const differenceFromCreationAndDeliveryDateInValidOrder =
    deliveryDate.getTime() - creationDate.getTime();

  let mappedProducts = orderData.products.map((prod) => {
    const dbProduct = allProducts.find((product) => {
      return product._id.equals(prod._id);
    });

    let mixStatuses = null;
    if (dbProduct.mix.isMix) {
      mixStatuses = dbProduct.mix.products.map((mixProd) => {
        const prod = allProducts.find((product) => {
          return product._id.equals(mixProd.strain);
        });

        return {
          product: prod.name,
          status: getInitialStatus(prod),
        };
      });
    }

    return {
      _id: prod._id,
      name: prod.name,
      status: dbProduct.mix.isMix ? null : getInitialStatus(dbProduct),
      mixStatuses: mixStatuses,
      seedId: prod.seedId,
      packages: [...prod.packages],
      mix: dbProduct.mix.isMix,
      price: dbProduct.price,
    };
  });
  let prc = getOrdersPrice(orderData, allProducts);

  newOrder._id = mongoose.Types.ObjectId();
  newOrder.cyclic = true;
  newOrder.price = prc;
  newOrder.products = mappedProducts;
  newOrder.date = new Date(
    new Date().getTime() + differenceFromCreationAndDeliveryDateInValidOrder
  );
  newOrder.customer = orderData.customer;
  newOrder.organization = orderData.organization;
  newOrder.status = "production";
  newOrder.job = orderData.job;

  return newOrder;
};

export const scheduleProduction = (orgId, productions, order, products) => {
    if (!orgId || !productions || !order || !products) {
      throw new Error("Missing necessary data for scheduling production.");
    }
  
    for (let production of productions) {
      scheduleIndividualProduction(orgId, production, order, products);
    }
  };
  
const scheduleIndividualProduction = (orgId, production, order, products) => {
try {
    const product = products.find((prod) => prod._id.equals(production.ProductID));

    if (!product) {
    console.error(`No product found for ID ${production.ProductID}.`);
    return;
    }

    // Convert order date to Date object for comparison
    const orderDate = new Date(order.date);

    const today = new Date();
      
    if (orderDate.getFullYear() === today.getFullYear() && 
        orderDate.getMonth() === today.getMonth() && 
        orderDate.getDate() === today.getDate()) {
      // If the order date is today, set the status of the production to "harvestReady"
      production.status = "harvestReady";
    }
    
    if (!product.mix.isMix) {

        if (!['seeding', 'preSoaking'].includes(production.status)) {
            updateProduction(orgId, production);
            return;
          }
        
        
        const deliveryDate = new Date(order.date);
        deliveryDate.setDate(deliveryDate.getDate() - (product.parameters.day + product.parameters.night));
        deliveryDate.setHours(4);
        deliveryDate.setMinutes(0);
        deliveryDate.setSeconds(0);

        console.log("Scheduling production for " + deliveryDate + " for order " + order._id + " and product " + product.name + ".")
        const job = nodeschedule.scheduleJob(deliveryDate, async () => {
            await updateProduction(orgId, production);
        });
    }
} catch (error) {
    console.error(`Error scheduling production for ID ${production._id}: ${error.message}`);
}
};
  
const updateProduction = async (orgId, production) => {
try {
    const updateOP = await organizationModel.updateOne(
    { "_id": mongoose.Types.ObjectId(orgId) },
    {
        "$push":{
        "containers.$[].production": {"$each": [production]},
        },
    },
    );
} catch (error) {
    console.error(`Error updating production for ID ${production._id}: ${error.message}`);
}
};

export const setOrderAbonment = (org, ordr, forProdOrder, prods, ovrhd) => {
  console.log(
    "New order will be recreated every: " + new Date(ordr.date).getDay()
  );
  const callBack = async (
    orgId,
    order,
    productionOrder,
    allProducts,
    overhead
  ) => {
    try {
      console.log(order.products);
      const production = await buildProductionDataFromOrder(
        productionOrder,
        allProducts,
        overhead
      );
      console.log(
        `Production of the new order set:  ${typeof production} from the original order production data`
      );

      console.log("New order and production automatic building started...");
      const newOrder = buildOrderFromExistingOrder(
        order,
        productionOrder,
        allProducts
      );
      console.log(`New order id: ${newOrder._id}`);

      // console.log(production)
      const updateOP = await organizationModel.updateOne(
        {
          _id: mongoose.Types.ObjectId(orgId),
        },
        {
          $push: {
            orders: newOrder,
            "containers.$[].production": { $each: production },
          },
        }
      );
      console.log("Organization automatic update completed");
      console.log(updateOP);

      const updateOrder = await organizationModel.updateOne(
        {
          _id: mongoose.Types.ObjectId(orgId),
        },
        {
          $push: {
            "orders.$[order].relatedOrdersFromJob": mongoose.Types.ObjectId(
              newOrder._id
            ),
          },
        },
        {
          arrayFilters: [
            {
              "order._id": mongoose.Types.ObjectId(order._id),
            },
          ],
        }
      );
      console.log("Order related to the new orders created has been updated");
      console.log(updateOrder);

      return newOrder;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  const rule = new nodeschedule.RecurrenceRule();
  rule.dayOfWeek = new Date(ordr.date).getUTCDay();
  rule.hour = new Date(ordr.date).getUTCHours();
  rule.minute = 0;
  const job = nodeschedule.scheduleJob(`Reorder-${ordr._id}`, rule, () => {
    callBack(org, ordr, forProdOrder, prods, ovrhd)
      .then((result) => {
        console.log("Callback of job finished");
        console.log(result);
      })
      .catch((err) => {
        console.log("Callback of job failed");
        console.log(err);
      });
  });

  //*TESTJOB
  // const job  = nodeschedule.scheduleJob(`Reorder-${ordr._id}`, `*/10 * * * * *`, () => {
  //     callBack(org, ordr, forProdOrder,prods, ovrhd)
  //     .then((result) => {
  //         console.log("Callback of job finished")
  //         console.log(result)
  //     })
  //     .catch(err => {
  //         console.log("Callback of job failed")
  //         console.log(err)
  //     })
  // })

  ordr.job = job.name;

  return job;
};
