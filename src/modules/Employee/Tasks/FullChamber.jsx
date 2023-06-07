import React, { useEffect, useState } from "react";

//*MUI Components
// import { DataGrid } from '@mui/x-data-grid'
import { Alert, Box, Button, Fab, Fade, Snackbar } from "@mui/material";

//*Netword and routing
import { useLocation, useNavigate } from "react-router-dom";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TaskContainer } from "./WorkingTasks/TaskContainer";

import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import { Timer } from "../../../CoreComponents/Timer.jsx";
import useAuth from "../../../contextHooks/useAuthContext";

import useWorkingContext from "../../../contextHooks/useEmployeeContext";
import { tasksCicleObj } from "../../../utils/models";
import { UserDialog } from "../../../CoreComponents/UserFeedback/Dialog";
import { BV_THEME } from "../../../theme/BV-theme";
import { getWorkdayProdData } from "../../../CoreComponents/requests";

import useWork from "../../../hooks/useWork.js";
import useProduction from "../../../hooks/useProduction.js";
import useDelivery from "../../../hooks/useDelivery.js";


//*UNUSED
// import { Add } from '@mui/icons-material'
//THEME
// import {BV_THEME} from '../../../theme/BV-theme'
// import { Clock } from '../../../CoreComponents/Clock'

export const FullChamber = () => {
  //*Network and router
  const navigate = useNavigate();
//   const { state } = useLocation();
//*CONTEXTS
const { user, credential } = useAuth();
let headers = {
  authorization: credential._tokenResponse.idToken,
  user: user,
}
const { getWorkTimeByContainer } = useWork(headers);
const { getContainerWorkDayProduction } = useProduction(headers);
const { getDeliveryPacksOrders, getRoutesOrders } = useDelivery(headers);

const {
  TrackWorkModel,
  setTrackWorkModel,
  WorkContext,
  setWorkContext,
  employeeIsWorking,
  setEmployeeIsWorking,
  state,
  setState
} = useWorkingContext();

  //*DATA STATES
  let { orders, workData, packs, deliverys, cycleKeys } = state;


  //*render states
  const [canSeeNextTask, setCanSeeNexttask] = useState({
    value: false,
    counter: 0,
  });
  const [snack, setSnack] = useState({
    open: false,
    state: "",
    message: "",
  });
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    actions: [],
  });
  const [workdayProdData, setWorkdayProdData] = useState(workData);

  //const [cycleKeys,setCycleKeys] = useState(["preSoaking"])

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack({
      ...snack,
      open: false,
    });
  };

  const getCycleKeys = () => {
    let arrcycl = [];

    Object.keys(workdayProdData).map((activeKey, id) => {
      workdayProdData[activeKey].length > 0
        ? Object.keys(WorkContext.cicle).map((structureKey, id) => {
            if (structureKey == activeKey && !arrcycl.includes(structureKey))
              arrcycl.push(structureKey);
          })
        : null;
    });
    console.log("arrcycl innit", arrcycl);
    return arrcycl;
  };

  /*    let psTrue = workdayProdData.preSoaking?.length>0
    let sTrue = workdayProdData.seeding?.length>0
    let hrTrue = workdayProdData.harvestReady?.length>0
    */

  /*psTrue?cycleKeys.push("preSoaking"):null
    sTrue?cycleKeys.push("seeding"):null
    hrTrue?cycleKeys.push("harvestReady"):null
    */

  const ordersList = orders;

  function getAllProducts() {
    const productList = [];
    ordersList.map((order, id) => {
      order.products.map((product, idx) => {
        productList.push({
          ...product,
          status: order.status,
          productionData:
            order.productionData[
              order.productionData.findIndex((x) => x.product === product.name)
            ],
        });
      });
    });
    return productList;
  }

  const allProducts = workData;

    const getTimeEstimate = async () => {
    // [ ]
    const request = await getWorkTimeByContainer(user._id, user.assignedContainer)

    let result = {
      times: {
        preSoaking: {
          time: 0,
        },
        harvestReady: {
          time: 0,
        },
        packing: {
          time: 0,
        },
        ready: {
          time: 0,
        },
        seeding: {
          time: 0,
        },
        cleaning: {
          time: 30 * 60 * 1000,
        },
        growing: {
          time: 0,
        },
      },
      total: 0,
    };

    const sumTimes = () => {
      let arr = [];
      request.data.data.forEach((item, id) => {
        let status = Object.keys(item)[0];
        arr.push(item[status].minutes);
      });

      arr.push(result.times["cleaning"].time);
      return arr.reduce((a, b) => a + b, 0);
    };

    let totalTime = sumTimes();

    if (request.data.data) {
      result = {
        times: {
          preSoaking: {
            time: request.data.data[0].preSoaking.minutes,
          },
          // soaking1: {
          //     time:request.data.data[1].soaking1.minutes
          // },
          // soaking1: {
          //     time:request.data.data[2].soaking2.minutes
          // },
          harvestReady: {
            time: request.data.data[1].harvestReady.minutes,
          },
          packing: {
            time: request.data.data[2].packing.minutes,
          },
          ready: {
            time: request.data.data[3].ready.minutes,
          },
          seeding: {
            time: request.data.data[4].seeding.minutes,
          },
          cleaning: {
            time: 30 * 60 * 1000,
          },
          growing: {
            time: request.data.data[5].growing.minutes,
          },
        },
        total: totalTime,
      };
    }
    /*
            const reduced = request.data.data.reduce((prev, curr) => {
                const prevseedTime = prev.times.seeding.time
                const prevharvestTime = prev.times.harvest.time

                const currseedTime = curr.times.seeding.time
                const currharvestTime = curr.times.harvest.time

                const prevTotal = prevseedTime + prevharvestTime
                
                const currTotal = currseedTime + currharvestTime

                return {
                    times: {
                        preSoaking: {
                            time:prevharvestTime + currharvestTime
                        }, 
                        harvest: {
                            time:prevharvestTime + currharvestTime
                        }, 
                        seeding: {
                            time:prevseedTime + currseedTime
                        }
                    }, 
                    total:prevTotal + currTotal
                }
            }, 
            {
                times: {
                    preSoaking: {
                        time:0
                    }, 
                    harvest: {
                        time:0
                    }, 
                    seeding: {
                        time:0
                    }
                },
                total:0
            })
        */

    return result;
  };

  {
    /* Products to send as props to TaskTest */
  }
  function getProductsByType(type) {
    const filteredProductList = [];

    allProducts.map((product, id) => {
      if (product.status === type) filteredProductList.push(product);
    });
    return filteredProductList;
  }

  const getWorkData = async () => {
    // if (window.localStorage.getItem("workData")) {
    //   return {
    //     workData: JSON.parse(window.localStorage.getItem("workData")),
    //     packs: JSON.parse(window.localStorage.getItem("packs")),
    //     deliverys: JSON.parse(window.localStorage.getItem("deliverys")),
    //   };
    // }

      // [ ]
      const production = await getContainerWorkDayProduction(user.assignedContainer);
      // [ ]
      const packs = await getDeliveryPacksOrders();
      // [ ]
      const deliverys = await getRoutesOrders()
      const time = await getTimeEstimate();

    return {
      workData: production.data.data,
      packs: packs.data.data,
      deliverys: deliverys.data.data,
      time: time,
    };
  };

  function prepareProductionStatusesForRender(workData) {
    let psTrue = workData.preSoaking?.length > 0;
    let sTrue = workData.seeding?.length > 0;
    let hrTrue = workData.harvestReady?.length > 0;

    let testingKeys = Object.keys(workData);
    //*Delete growing from cycle (not useful display in cycle)
    const growingStatusIndex = testingKeys.indexOf("growing");
    testingKeys.splice(growingStatusIndex, 1);

    testingKeys.push("cleaning");

    return testingKeys;
  }

  const setWorkingContext = (workDataModel, packs, deliverys, time) => {
    //*Employee started working identification
    //*Production data
    window.localStorage.setItem("workData", JSON.stringify(workDataModel));
    window.localStorage.setItem("packs", JSON.stringify(packs));
    window.localStorage.setItem("deliverys", JSON.stringify(deliverys));
    setTrackWorkModel({
        ...TrackWorkModel,
        expected: time
    })
    
    setState({
        ...state,
        packs:packs
    })
    // if (!employeeIsWorking) {
    //   setEmployeeIsWorking(true);

    //   setTrackWorkModel({
    //     ...TrackWorkModel,
    //     started: Date.now(),
    //     expected: estimatedTime,
    //   });

    //   Object.keys(WorkContext.cicle).forEach((value, index) => {
    //     if (!activeStatusesArray.includes(value)) {
    //       // delete WorkContext.cicle[value]
    //       setWorkContext({ ...WorkContext });
    //     } else {
    //       WorkContext.cicle[value].production = workDataModel.production;
    //     }
    //   });

    //   WorkContext.cicle[Object.keys(WorkContext.cicle)[0]].started = Date.now();
    //   window.localStorage.setItem("WorkContext", JSON.stringify(WorkContext));
    // } else {
    //   setWorkContext({ ...WorkContext, current: getFinishedTasks().length });
    // }
  };

  const updateEmployeeWorkDay = async (props) => {
    let user = props.user;
    let credential = props.credential;

      // [ ]
      await updateWorkDay(user._id, user.assignedContainer, {})
      .then((result) => {
        return result.data.success;
      })
      .catch((err) => {
        Promise.reject(err);
      });
  };


  const carouselChange = (index, element) => {
    getWorkData()
      .then(async ({ workData, packs, deliverys, time }) => {
        packs = packs;

        let allOrders = [];
        Object.keys(workData).forEach((key) => {
          workData[key].forEach((modelInTask) => {
            modelInTask.relatedOrders.forEach((orderId) =>
              allOrders.push(orderId)
            );
          });
        });

        allOrders = Array.from(new Set(allOrders));

        orders = allOrders;

        let statusesArr = prepareProductionStatusesForRender(workData);
        setWorkingContext(workData, packs, deliverys, time);

        cycleKeys = statusesArr;

        updateEmployeeWorkDay({ user, credential, workData })
          .then((updated) => {
            allOrders = Array.from(new Set(allOrders));

            // setOrders(allOrders)

            setSnack({ open: false });
            //*Working context
          })
          .catch((err) => {
            console.log(err);
            setSnack({
              open: true,
              label: "There was an error. Reload the page.",
              state: "error",
            });
          });
      })
      .catch((err) => {
        console.log("Error getting packs", err);
        setSnack({
          ...snack,
          open: true,
          state: "error",
          message: "Error getting packing data.",
        });
      });
    setWorkContext({ ...WorkContext, currentRender: index });

    if (index < 0) {
    }

    setCanSeeNexttask((cnSee) => {
      if (index < canSeeNextTask.counter) {
        return {
          ...cnSee,
          value: true,
        };
      }

      return { ...cnSee };
    });

    if (index < canSeeNextTask.counter) {
      return;
    }

    setWorkContext((wrkContext) => {
      if (
        WorkContext.cicle[cycleKeys[index]].started === undefined &&
        index == WorkContext.current
      ) {
        return {
          ...wrkContext,
          cicle: {
            ...WorkContext.cicle,
            [Object.keys(WorkContext.cicle)[index]]: {
              ...WorkContext.cicle[cycleKeys[index]],
              started: Date.now(),
            },
          },
        };
      }

      return { ...wrkContext };
    });

    setCanSeeNexttask({ ...canSeeNextTask, value: false });
  };

  const carouselButtonSX = {
    position: "absolute",
    zIndex: 2,
    top: { xs: "3%", md: "calc(95% - 15px)" },
  };

  const arrowNext = (onClickHandler, hasNext, label) =>
    hasNext && (
      <Button
        disabled={false /*canSeeNextTask.value == false*/}
        variant="contained"
        onClick={onClickHandler}
        title={"next task"}
        sx={() => ({ ...carouselButtonSX, right: "5%" })}
      >
        {"Next Task"}
      </Button>
    );

  const arrowPrev = (onClickHandler, hasPrev, label) =>
    hasPrev && (
      <Button
        variant="contained"
        onClick={onClickHandler}
        title={"previous task"}
        sx={() => ({ ...carouselButtonSX, left: { xs: "5%", md: "5%" } })}
      >
        Prev Task
      </Button>
    );

  const updateEmployeePerformance = (expected, real) => {
    //*EMPLOYEE PERFORMANCE = container capacity (real/expected)
    //* if (real/expected) > 1 negative
  };

  const handleBreaks = () => {
    let started = new Date();
    setDialog({
      ...dialog,
      open: true,
      title: "You are on a break ",
      message: "Rest. Breathe. Your time is still being tracked",
      actions: [
        {
          label: "Continue Working",
          execute: () => {
            let finished = new Date();
            let elapsed = finished - started;
            let thisBreak = {
              task: cycleKeys[WorkContext.current],
              started: started,
              finished: finished,
              elapsed: elapsed,
            };
            WorkContext.cicle[cycleKeys[WorkContext.current]].breaks.push(
              thisBreak
            );
            setWorkContext({ ...WorkContext });
            TrackWorkModel.breaks.push(thisBreak);
            setTrackWorkModel({ ...TrackWorkModel });
            console.log(
              "current task breaks",
              WorkContext.cicle[cycleKeys[WorkContext.current]].breaks
            );
            console.log("trackwork model breaks ", TrackWorkModel.breaks);
            setDialog({ ...dialog, open: false });
          },
        },
      ],
    });
  };

  /*useEffect(()=>{
        let psTrue = workData.preSoaking?.length>0
        let sTrue = workData.seeding?.length>0
        let hrTrue = workData.harvestReady?.length>0

        console.log("aber hdsptm",psTrue,sTrue,hrTrue)
    

    let testingKeys =[] 

    psTrue?testingKeys.push("preSoaking"):null
    sTrue?testingKeys.push("seeding"):null
    hrTrue?testingKeys.push("harvestReady"):null

    setCycleKeys(testingKeys)
    


    },[workdayProdData])*/

  useEffect(() => {
    setWorkContext(() => {
      return {
        ...WorkContext,
        cicle: {
          ...WorkContext.cicle,
          [cycleKeys[WorkContext.current]]: {
            ...WorkContext.cicle[cycleKeys[WorkContext.current]],
            stopped: Date.now(),
          },
        },
      };
    });
  }, [WorkContext.current]);

  // useEffect(()=>{
  //     getWorkdayProdData({
  //         user:user,
  //         credential:credential,
  //         setProdData:setWorkdayProdData,
  //     })
  //     .then(() => {
  //         console.log("Data obtained succesfully")
  //     })

  // },[])

  console.log("lalala2", workdayProdData);

  return (
    <>
      <Carousel
        emulatetouch={true}
        swipeable={false}
        showThumbs={false}
        showArrows={true}
        showStatus={false}
        renderArrowNext={arrowNext}
        renderArrowPrev={arrowPrev}
        renderIndicator={false}
        selectedItem={employeeIsWorking ? WorkContext.current : 0}
        onChange={carouselChange}
        transitionTime={1000}
      >
        {cycleKeys?.map((status, index) => {
          return (
            <Fade in={true} timeout={2000} unmountOnExit>
              <Box
                key={index}
                height="80vh"
                component={"div"}
                sx={{ overflow: "auto" }}
              >
                {TaskContainer({
                  type: status || null,
                  counter: canSeeNextTask.counter,
                  setFinished: setCanSeeNexttask,
                  setSnack: setSnack,
                  snack: snack,
                  stepInList: index,
                  updatePerformance: updateEmployeePerformance,
                  setWorkContext: setWorkContext,
                  products: workdayProdData[status],
                  packs: packs,
                  deliverys: deliverys,
                })}
              </Box>
            </Fade>
          );
        })}
      </Carousel>

      <UserDialog
        dialog={dialog}
        setDialog={setDialog}
        open={dialog.open}
        title={dialog.title}
        content={dialog.message}
        actions={dialog.actions}
      >
        <Timer contxt="global" from="global" />
      </UserDialog>

      <Timer contxt="global" from="global" />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snack.status}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <Fab
        color="primary"
        size="medium"
        aria-label="take a break"
        onClick={handleBreaks}
        sx={{ position: "absolute", bottom: 30, right: { xs: 30, md: "40%" } }}
      >
        <LocalCafeIcon />
      </Fab>
    </>
  );
};

//TODO Move component
export function filterByKey(obj, prop) {
  {
    /* 
        Returns an object with objects' desired prop as key, 
        letting you have a "status as Key" object or a "name as key" object 
        to name a few 
    */
  }
  if (obj != undefined) {
    return obj.reduce(function (acc, item) {
      let key = item[prop];

      if (!acc[key]) {
        acc[key] = [];
      }
      if (item["mix"] == true && item["products"] != undefined) {
        let mixProds = filterByKey(item.products, "item");
      } else if (!item.productionData) {
        acc[key].push({
          name: item.name,
          harvest: item.harvest,
          seeds: item.seeds,
          trays: item.trays,
        });
      } else acc[key].push({ ...item.productionData, name: item.name });

      return acc;
    }, {});
  }
}
