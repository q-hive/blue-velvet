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
import mongoose, { set } from "mongoose";
import moment from "moment";

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
        `${order.date.getDate()}-${order.date.getMonth() + 1
        }-${order.date.getFullYear()}`
        ]
      ) {
        hash[
          `${order.date.getDate()}-${order.date.getMonth() + 1
          }-${order.date.getFullYear()}`
        ] = {
          ...order.toObject(),
        };
        result.push({
          [`${order.date.getDate()}-${order.date.getMonth() + 1
            }-${order.date.getFullYear()}`]:
            hash[
            `${order.date.getDate()}-${order.date.getMonth() + 1
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
    // Quitar todos los productos que esten en produccion pasiva (preSoaking, seeding, growing)
    const passiveProduction = ['preSoaking', 'seeding', 'growing']
    order.products.forEach((product) => {
      if (passiveProduction.includes(product.status)) return
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
      // Quitar todos los productos que esten en produccion pasiva (preSoaking, seeding, growing)
      const passiveProduction = ['preSoaking', 'seeding', 'growing']
      if (passiveProduction.includes(product.status)) return

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
          orderAddress: order.address,
          orders: [],
        };

        result.push(hash[order.customer.toString()]);
      }


      console.log("🎈", mappedProducts(order.products));

      hash[order.customer.toString()].orders.push({
        _id: order._id,
        products: mappedProducts(order.products).filter((product) => product !== undefined),
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

export const isWorkingDay = (date) => {
  //*WORKINNG DAYS ARE TUESDAY (2) AND FRIDAY (5)
  const day = date.day();
  return (day === 2 || day === 5)
};

const scheduler = async (todayDate, scheduleDate, orgId, productionData, orderData) => {
  console.log("Scheduling production...");
  if (scheduleDate.isBefore(todayDate) && !isToday(scheduleDate, todayDate)) {
    throw new Error("Cannot schedule production for a date in the past.");
  }

  const startDate = new Date(scheduleDate.utc().startOf('day'));
  productionData.startProductionDate = startDate
  const activeStatus = ['harvestReady', 'packing', 'ready']
  productionData.startHarvestDate = activeStatus.includes(productionData.ProductionStatus) ? startDate : null;

  await insertProduction(orgId, productionData);
  await modifyOrder(orgId, orderData);
}

export const getClosestWorkableDay = (date, today) => {

  //IF THE DAY IS AFTER TUESDAY, SET DATE TO THE PAST TUESDAY, IF NOT, SET DATE TO FRIDAY
  let newDate = date.clone();
  const day = newDate.day();
  if (!newDate.isBefore(today)) {
    console.log("La pinchi fecha es mayor o igual a hoy")
    //     Sunday     Saturday     Monday
    if (day === 0 || day === 6 || day === 1) {
      const diff = day === 0 ? 2 : day === 6 ? 1 : 3;
      newDate.subtract(diff, 'days');
      return newDate;
    }

    //   Wednesday    Thursday
    if (day === 3 || day === 4) {
      const diff = day - 2;
      newDate.subtract(diff, 'day');
      return newDate;
    }

    console.log("Retorna el mismo dia")
    return newDate;
  }

  if (day === 0 || day === 6 || day === 1) {
    const diff = day === 0 ? 2 : day === 6 ? 3 : 1;
    newDate.add(diff, 'days');
    return newDate;
  }

  //   Wednesday    Thursday
  if (day === 3 || day === 4) {
    const diff = 5 - day;
    newDate.add(diff, 'day');
    return newDate;
  }

  if (day === 2 || day === 5) {
    return newDate;
  }
  throw new Error("No closest working day matched")
};

export const scheduleProduction = async (orgId, productions, order, products, tz) => {
  console.log("Scheduling production...");
  console.log(productions);
  if (
    !orgId ||
    !productions ||
    !productions.length > 0 ||
    !order ||
    !products
  ) {
    throw new Error("Missing necessary data for scheduling production.");
  }

  try {
    for (let production of productions) {
      try {
        await scheduleIndividualProduction(orgId, production, order, products, tz);
      } catch (err) {
        throw err;
      }
    }
  } catch (err) {
    throw err;
  }
};

// Function to check if a date is today
const isToday = (date, today) => {
  return (
    date.year() === today.year() &&
    date.month() === today.month() &&
    date.date() === today.date()
  )
};

// Function to set data to an active production status
const setToActiveStatus = (production, order, activeStatus = "harvestReady") => {
  // Set production model status to an active production status
  production.ProductionStatus = activeStatus;
  // Set the product status to an active production status
  const productIndex = order.products.findIndex((prod) => prod._id.toString() === production.ProductID.toString());
  if (productIndex !== -1) {
    order.products[productIndex].status = activeStatus;
  }
  // Set the order status to an active production status
  const orderStatuses = Array.from(new Set(order.products.map((prod) => prod.status)));
  order.status = orderStatuses.length === 1 ? orderStatuses[0] : "production"
}

// Function to schedule individual production
const scheduleIndividualProduction = async (orgId, production, order, products, tz) => {
  try {
    console.log("****************************");
    console.log("🚀 [production product  - status]:", production.ProductName + ' - ' + production.ProductionStatus)
    console.log(`🚀 [order id - date - status ]:`, order._id + ' - ' + order.date.format() + ' - ' + order.status)
    console.log("****************************");
    // Find the product associated with the production
    const product = products.find((prod) => prod._id.equals(production.ProductID));

    // If no product is found, log an error and return
    if (!product) {
      console.error(`No product found for ID ${production.ProductID}.`);
      throw new Error(`No product found for ID ${production.ProductID}.`);
    }

    // Log the found product
    // console.log("Product found:", product);

    // Convert delivery date to Date object for comparison (COMES IN THE USER TIMEZONE)
    const today = moment().utc().startOf('day');
    const deliveryDate = order.date.clone().startOf('day')
    const serverTz = moment.tz.guess();
    const closestDateToDeliveryDadte = getClosestWorkableDay(deliveryDate, today).startOf("day")
    const startProductionDate = closestDateToDeliveryDadte.clone().subtract(product.parameters.day + product.parameters.night, "days").startOf("day");

    // If the product is not a mix
    if (!product.mix.isMix) {
      // Calculate the start production date
      console.log("/////////////");
      console.log("🚀 [today]:", moment(today))
      console.log("🚀 [deliveryDate]:", moment(deliveryDate))
      console.log("🚀 [closestDateToDeliveryDadte]:", moment(closestDateToDeliveryDadte))
      console.log("🚀 [startProductionDate]:", moment(startProductionDate))
      console.log("/////////////");


      // If the production status is not passive status and the order delivery date is not today
      if (!["seeding", "preSoaking"].includes(production.ProductionStatus) && !isToday(deliveryDate, today)) {
        // Schedule a job to insert the production on the closest working day based on delivery date
        try {
          console.log("🎈 OP 1");
          // const scheduledDate =  getClosestWorkableDay(startProductionDate, today).startOf("day").tz(serverTz)
          console.log("🚀[scheduledDate]", moment(closestDateToDeliveryDadte).format("ddd, DD-MM-YYYY"));
          scheduler(today, closestDateToDeliveryDadte, orgId, production, order)
          console.log(`Scheduled production for ${closestDateToDeliveryDadte} for order ${order._id} and product ${product.name}.`);
          return;
        } catch (error) {
          console.log("Error creating production");
          console.log(error);
          throw error;
        }
      }

      // If the delivery date is today and it's a working day, will set the production to harvestReady, if not, to ready
      if (isToday(deliveryDate, today)) {
        try {
          console.log("🎈🎈 OP 2");
          const activeStatus = isToday(getClosestWorkableDay(deliveryDate, today), today) ? "harvestReady" : "ready";
          setToActiveStatus(production, order, activeStatus);
          scheduler(today, deliveryDate, orgId, production, order)
          console.log("Production has been added to the database.");
          return;
        } catch (error) {
          throw new Error("Error creating production.");
        }
      }

      if (isToday(startProductionDate, today)) {
        try {
          console.log("🎈🎈🎈 OP 3");
          scheduler(today, startProductionDate, orgId, production, order)
          console.log("Production has been added to the database.");
          return;
        } catch (error) {
          throw new Error("Error creating production.");
        }
      }

      // If the start production date is not a working day, schedule a job to insert the production on the closest working day
      if (!isWorkingDay(startProductionDate) && !moment(startProductionDate).isBefore(today)) {
        console.log("🎈🎈🎈🎈 OP 4");
        const schedule = getClosestWorkableDay(startProductionDate, today).startOf("day")
        if (isToday(schedule, today)) {
          try {
            scheduler(today, schedule, orgId, production, order)
            console.log("Production has been added to the database.");
            return;
          } catch (error) {
            throw new Error("Error creating production.");
          }
        }
        console.log("🚀 [schedule]", moment(schedule).format("ddd, DD-MM-YYYY"));
        scheduler(today, schedule, orgId, production, order)
        console.log(`Scheduled production for ${schedule} (${serverTz}) for order ${order._id} and product ${product.name}. USER TIMEZONE: ${tz}`);
        return;
      }

      // If the start production date is a working day, schedule a job to insert the production
      console.log("🎈🎈🎈🎈🎈 OP 5");
      const scheduleDate = closestDateToDeliveryDadte.startOf("day")
      console.log("🚀 [scheduleDate]:", scheduleDate)
      const isafter = scheduleDate.isAfter(today)
      const diffDays = moment.duration(scheduleDate.diff(today)).asDays()

      console.log("isafter---", isafter)
      console.log("diffDates---", diffDays)
      if ((isafter || isToday(scheduleDate, today)) && diffDays < (product.parameters.day + product.parameters.night)) {
        console.log("🎈🎈🎈🎈🎈 OP 5.1");
        setToActiveStatus(production, order, "harvestReady")
        scheduler(today, scheduleDate, orgId, production, order)
        console.log(`Scheduled production for ${scheduleDate} (${serverTz}) for order ${order._id} and product ${product.name}. USER TIMEZONE: ${tz}`);
        return
      }
      console.log("🎈🎈🎈🎈🎈 OP 5.2");
      scheduler(today, startProductionDate, orgId, production, order)
      console.log(`Scheduled production for ${startProductionDate} (${serverTz}) for order ${order._id} and product ${product.name}. USER TIMEZONE: ${tz}`);
      return;
    }
  } catch (error) {
    console.log(error)
    console.error(`Error scheduling production for production of ${production.ProductName}: ${error.message}`);
    throw new Error("Error scheduling production.");
  }
};

const insertProduction = async (orgId, production) => {
  try {
    await organizationModel.updateOne(
      { _id: mongoose.Types.ObjectId(orgId) },
      {
        $push: {
          "containers.$[].production": { $each: [production] },
        },
      }
    );
  } catch (error) {
    console.log(error)
    console.error(
      `Error updating production for ID ${production._id}: ${error.message}`
    );
  }
};

const modifyOrder = async (orgId, order) => {
  try {
    await organizationModel.updateOne(
      { _id: mongoose.Types.ObjectId(orgId), "orders._id": order._id },
      { $set: { "orders.$": order } }
    );
  } catch (error) {
    console.log(error)
    console.error(
      `Error updating order for ID ${order._id}: ${error.message}`
    );
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
