import React, { useState, useEffect, useRef } from 'react';

//*COMPONENTS FROM MUI
import {
  Box,
  Button,
  Typography,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Alert,
} from '@mui/material';

//*THEME
import { BV_THEME } from '../../../../theme/BV-theme';
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog';

//*NETWORK AND API
import { json, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../../contextHooks/useAuthContext';

// CUSTOM HOOKS
import useWork from '../../../../hooks/useWork';

///tasks steps test
import { PreSoakingContent } from './PreSoakingContent';
import { SeedingContent } from './SeedingContent.jsx';
import { HarvestingContent } from './HarvestingContent.jsx';
import { PackingContent } from './PackingContent.jsx';
import { DeliveryContent } from './DeliveryContent.jsx';
import { Timer } from '../../../../CoreComponents/Timer';
import { ArrowCircleRightOutlined } from '@mui/icons-material';
import { CleaningContent } from '../ContainerTasks/CleaningContent';
import { MatCutContent } from '../ContainerTasks/MatCutContent';
import useWorkingContext from '../../../../contextHooks/useEmployeeContext';
import { PreSoakingContent1 } from './PreSoakingContent1';
import { PreSoakingContent2 } from './PreSoakingContent2';
import { transformTo } from '../../../../utils/times';
import { MaintenanceContent } from '../ContainerTasks/MaintenanceContent';
import { getRefreshedToken } from '../../../../contexts/AuthContext';

export const TaskContainer = (props) => {
  //*Variables declarations
  let steps;
  let contentTitle;
  let content;
  let expectedtTime;

  let trays;
  let redplacedMixProducts;
  let productsByNameObj;

  const theme = useTheme(BV_THEME);

  const { user, credential } = useAuth();
  let headers = {
    authorization: credential._tokenResponse.idToken,
    user: user,
  };
  const { updateProduction, updateTaskHistory } = useWork(headers);
  const {
    WorkContext,
    setWorkContext,
    TrackWorkModel,
    setTrackWorkModel,
    employeeIsWorking,
    isOnTime,
    state,
    setState,
  } = useWorkingContext();
  const navigate = useNavigate();

  //* STEPPER
  const [activeStep, setActiveStep] = useState(0);
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    actions: [],
  });

  let type, orders, products, packs, disabledSteps;

  if (props != null) {
    type = props.type;
    orders = props.orders;
    products = props.products;
    packs = state.packs;
    disabledSteps = props.disabledSteps;
  }

  if (state != null) {
    if (state.type != undefined) {
      ({ type } = state);
    }
  }

  switch (type) {
    // case "unpaid":
    //     contentTitle = "Unpaid"
    //     expectedtTime = 0
    //     content = <Typography>The order is in UNPAID status, please wait until the Order is Ready</Typography>
    //     steps=[{step:"Unpaid"}]
    // break;

    // case "pending":
    //     contentTitle = "Pending"
    //     expectedtTime = 0
    //     content = <Typography>The order is in PENDING status, please wait until the Order is Ready</Typography>
    //     steps=[{step:"Pending"}]
    // break;

    // case "uncompleted":
    //     contentTitle = "Unpaid"
    //     expectedtTime = 0
    //     content = <Typography>The order is in UNPAID status, please wait until the Order is Ready</Typography>
    //     steps=[{step:"Unpaid"}]
    //  break;

    case 'preSoaking':
      contentTitle = 'Soaking seeds';
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.preSoaking.time
      );
      content = (
        <PreSoakingContent
          products={products}
          productsObj={productsByNameObj}
          workData={state.workData['preSoaking']}
          index={activeStep}
        />
      );
      steps = [{ step: 'Pre Soak' }];
      break;

    case 'soaking1':
      contentTitle = 'Soaking stage - 1';
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.preSoaking.time
      );

      content = (
        <PreSoakingContent1
          products={products}
          productsObj={productsByNameObj}
          workData={state.workData['preSoaking']}
          index={activeStep}
        />
      );
      steps = [{ step: 'Water change 1' }];
      break;

    case 'soaking2':
      contentTitle = 'Soaking stage - 2';
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.preSoaking.time
      );
      content = (
        <PreSoakingContent2
          products={products}
          productsObj={productsByNameObj}
          workData={state.workData['preSoaking']}
          index={activeStep}
        />
      );
      steps = [{ step: 'Water change 2' }];
      break;

    case 'seeding':
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.seeding.time
      );
      content = (
        <SeedingContent
          products={products}
          productsObj={productsByNameObj}
          workData={state.workData['seeding']}
          index={activeStep}
        />
      );
      steps = [
        { step: 'Waste and control' },
        { step: 'Seeding' },
        // {step:"Seeding"},
        // {step:"Putting to the light"},
        // {step:"Spray Seeds"},
      ];
      contentTitle = steps[activeStep].step;
      break;

    // case "growing":
    //     contentTitle = "Cycle finished"
    //     content = <Typography>Go to dashboard and finish your work</Typography>
    //     steps=[{step:"Growing"}]
    // break;

    case 'harvestReady':
      contentTitle = 'Harvesting';
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.harvestReady.time
      );
      content = <HarvestingContent products={products} index={activeStep} />;
      steps = [
        { step: 'Recolection' },
        // {step:"Dry Rack"},
        // {step:"Dry Station"},
      ];
      break;

    case 'packing':
      contentTitle = 'Packing';
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.packing.time
      );
      content = (
        <PackingContent index={activeStep} products={products} packs={packs} />
      );
      steps = [
        { step: 'Packing Greens' },
        // {step:"Tools"},
        // {step:"Calibration"},
        // {step:"Boxing"},
      ];
      break;

    case 'ready':
      contentTitle = 'Delivery';
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.harvestReady.time
      );
      content = <DeliveryContent index={activeStep} />;
      steps = [{ step: 'Delivery' }];
      break;

    case 'cleaning':
      contentTitle = 'Cleaning';
      expectedtTime = transformTo(
        'ms',
        'minutes',
        state.time.times.cleaning.time
      );
      content = <CleaningContent index={activeStep} />;
      steps = [{ step: 'Cleaning' }];
      break;

    case 'maintenance':
      contentTitle = 'Maintenance';
      content = <MaintenanceContent index={activeStep} />;
      steps = [{ step: 'Maintenance' }];
      break;

    case 'mats':
      contentTitle = 'Cut Mats';
      content = <MatCutContent index={activeStep} />;
      steps = [{ step: 'Cut Mats' }];
      break;

    default:
      contentTitle = 'Error';
      content = <Typography>Error</Typography>;
      steps = [{ step: 'error' }];
      break;
  }

  const sumProdData = (arr, data) => {
    let result = 0;
    arr.forEach((product) => {
      result += product[data];
    });
    return result;
  };

  if (products != null) {
    trays = getTraysTotal(products);
    redplacedMixProducts = mixOpener(products);
    productsByNameObj = filterByKey(redplacedMixProducts, 'name');
    setFinalProductionData();
  }

  function getTraysTotal(producti) {
    let ttrays = 0;
    producti.map((product, id) => {
      let prev = ttrays;
      let curr;

      {
        product.products != undefined && product.mix === true
          ? (curr = getTraysTotal(product.products))
          : product.productionData != undefined
          ? (curr = product.productionData.trays)
          : (curr = product.trays);
      }
      ttrays = prev + curr;
    });
    return ttrays;
  }

  function filterByKey(obj, prop) {
    {
      /* 
        Returns an object with objects' desired prop as key, 
        letting you have a "status as Key" object or a "name as key" object 
        to name a few 
    */
    }
    return obj.reduce(function (acc, item) {
      let key = item[prop];

      if (!acc[key]) {
        acc[key] = [];
      }
      if (item['mix'] == true && item['products'] != undefined) {
        let mixProds = filterByKey(item.products, 'item');
        console.log('solo soy uno', mixProds);
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

  function mixOpener(products) {
    let arreglo = [];
    products.map((product, id) => {
      if (product.mix) {
        if (product.products) {
          product.products.map((product2, id) => {
            arreglo.push(product2);
          });
        }
      } else arreglo.push(product);
    });
    return arreglo;
  }

  function setFinalProductionData() {
    for (const key in productsByNameObj) {
      const h = sumProdData(productsByNameObj[key], 'harvest');
      const s = sumProdData(productsByNameObj[key], 'seeds');
      const t = sumProdData(productsByNameObj[key], 'trays');

      productsByNameObj[key] = { harvest: h, seeds: s, trays: t };
    }
  }

  //Finish Task
  const handleCompleteTask = () => {
    setDialog({
      ...dialog,
      open: true,
      title: `Finishing ${type}" task`,
      message: `Please wait... Task is finishing`,
    });

    let finished = Date.now();
    let achieved =
      finished -
      WorkContext.cicle[
        Object.keys(WorkContext.cicle)[WorkContext.currentRender]
      ].started;

    const updateProductionData = async () => {
      let wd = JSON.parse(window.localStorage.getItem('workData'));

      //*When this model is sent also updates the performance of the employee on the allocationRatio key.
      const taskHistoryModel = {
        executedBy: user._id,
        expectedTime:
          TrackWorkModel.expected.times[
            Object.keys(WorkContext.cicle)[WorkContext.currentRender]
          ].time,
        achievedTime: achieved,
        orders: state.orders.map((order) => order._id),
        taskType: Object.keys(WorkContext.cicle)[WorkContext.currentRender],
        workDay: TrackWorkModel.workDay,
      };

      let productionModelsIds = [];
      wd[Object.keys(WorkContext.cicle)[WorkContext.currentRender]].forEach(
        (model) => {
          if (model.modelsId) {
            model.modelsId.forEach((productionModelsId) =>
              productionModelsIds.push(productionModelsId)
            );
          }
        }
      );

      let refreshedToken = await getRefreshedToken();
      await updateTaskHistory(
        { ...taskHistoryModel },
        { authorization: refreshedToken, user: user }
      );
      await updateProduction(
        user.assignedContainer,
        productionModelsIds,
        type,
        { authorization: refreshedToken, user: user }
      );
    };

    if (type === 'cleaning') {
      console.log(
        'The production cannot be updated as the same way of a productin model based task'
      );
      WorkContext.cicle[
        Object.keys(WorkContext.cicle)[WorkContext.currentRender]
      ].finished = finished;
      // WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.currentRender+1]].started = finished+1
      WorkContext.cicle[
        Object.keys(WorkContext.cicle)[WorkContext.currentRender]
      ].achieved = achieved;
      TrackWorkModel.tasks.push(
        WorkContext.cicle[
          Object.keys(WorkContext.cicle)[WorkContext.currentRender]
        ]
      );
      setTrackWorkModel({ ...TrackWorkModel, tasks: TrackWorkModel.tasks });

      // WorkContext.currentRender = WorkContext.currentRender + 1
      setWorkContext({
        ...WorkContext,
        current: WorkContext.current,
        currentRender: WorkContext.currentRender,
      });
      localStorage.setItem('WorkContext', JSON.stringify(WorkContext));

      props.setSnack({
        ...props.snack,
        open: true,
        message: 'Production updated succesfully',
        status: 'success',
      });
      props.setFinished({ value: true, counter: props.counter + 1 });
      navigate(`/${user.uid}/${user.role}/dashboard`);
      return;
    }

    updateProductionData()
      .then((result) => {
        // hooks
        WorkContext.cicle[
          Object.keys(WorkContext.cicle)[WorkContext.currentRender]
        ].finished = finished;
        WorkContext.cicle[
          Object.keys(WorkContext.cicle)[WorkContext.currentRender + 1]
        ].started = finished + 1;
        WorkContext.cicle[
          Object.keys(WorkContext.cicle)[WorkContext.currentRender]
        ].achieved = achieved;
        TrackWorkModel.tasks.push(
          WorkContext.cicle[
            Object.keys(WorkContext.cicle)[WorkContext.currentRender]
          ]
        );
        setTrackWorkModel({ ...TrackWorkModel, tasks: TrackWorkModel.tasks });

        WorkContext.currentRender = WorkContext.currentRender + 1;
        setWorkContext({
          ...WorkContext,
          current: WorkContext.current,
          currentRender: WorkContext.currentRender,
        });
        localStorage.setItem('WorkContext', JSON.stringify(WorkContext));

        props.setSnack({
          ...props.snack,
          open: true,
          message: 'Production updated succesfully',
          status: 'success',
        });
        props.setFinished({ value: true, counter: props.counter + 1 });
        setDialog({ ...dialog, open: false });
      })
      .catch((err) => {
        console.log(err);
        props.setSnack({
          ...props.snack,
          open: true,
          message: 'Error updating production, please finish the task again.',
          status: 'error',
        });
      });
  };

  //*********** STEPPER Functionality
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const isLastStep = (index) => {
    return index == steps.length - 1;
  };

  const isDisabledStepButton = (index) => {
    const isDisabledStep = disabledSteps.includes(type);
    return isDisabledStep || (!isOnTime && isLastStep(index));
  };

  const isTaskFinishedToday = () => {
    const isStepFinished = TrackWorkModel.tasks.some(
      (task) => task.type === type
    );
    return isStepFinished;
  };

  // Stepper Navigation buttons
  const getStepContent = (step, index) => {
    return (
      <>
        <Typography sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {step.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <div>
            <Button
              variant='contained'
              onClick={isLastStep(index) ? handleCompleteTask : handleNext}
              sx={() => ({ ...BV_THEME.button.standard, mt: 1, mr: 1 })}
              disabled={
                isDisabledStepButton(index) ||
                type === 'growing' ||
                isTaskFinishedToday()
              }
            >
              {isLastStep(index) ? 'Finish Task' : 'Continue'}
            </Button>

            <Button
              disabled={index === 0}
              onClick={handleBack}
              sx={{ mt: 1, mr: 1 }}
            >
              Back
            </Button>
          </div>
        </Box>
        <Box sx={{ mb: 2 }}>
          {isTaskFinishedToday() && (
            <Alert severity='success' variant='outlined'>
              This step has already been completed successfully today.
              <br />
              <b>Check the logs in "Today's Completed Tasks".</b>
            </Alert>
          )}
        </Box>
      </>
    );
  };

  const getMobileStepperButtons = (index) => {
    return (
      <Box
        sx={{
          width: '100%',
          mb: 2,
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'space-evenly',
        }}
      >
        <Button
          disabled={index === 0}
          onClick={handleBack}
          sx={() => ({ ...BV_THEME.button.standard, color: 'white_btn' })}
          variant='outlined'
        >
          Back
        </Button>

        <Button
          variant='contained'
          onClick={isLastStep(index) ? handleCompleteTask : handleNext}
          sx={() => ({ ...BV_THEME.button.standard })}
          disabled={isDisabledStepButton(index) || isTaskFinishedToday()}
        >
          {isLastStep(index) ? 'Finish Task' : 'Continue'}
        </Button>
      </Box>
    );
  };

  useEffect(() => {
    setActiveStep(() => {
      if (employeeIsWorking) {
        return 0;
      }

      return steps.length - 1;
    });
  }, []);

  return (
    <div style={{}}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          marginTop: '5vh',
          justifyContent: 'center',
          justifyItems: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '90%' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {/*MOBILE STEPPER (HORIZONTAL)*/}
          <Box
            justifyContent={'space-evenly'}
            flexDirection='column'
            alignItems={'center'}
            sx={{
              width: { xs: '100%', sm: '90%' },
              display: { xs: 'flex', sm: 'none' },
            }}
          >
            <Stepper activeStep={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel sx={{ fontSizeAdjust: '20px' }}>
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {getMobileStepperButtons(activeStep)}
          </Box>

          {/* DESKTOP STEPPER (VERTICAL) */}
          <Box
            sx={{ width: '35%', display: { xs: 'none', sm: 'inline-block' } }}
          >
            <Stepper activeStep={activeStep} orientation='vertical'>
              {steps.map((step, index) => (
                <Step key={step.step + 1}>
                  <StepLabel sx={{ fontSizeAdjust: '20px' }}>
                    {step.step}
                  </StepLabel>
                  <StepContent>{getStepContent(step, index)}</StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>

          {/*Specific task instructions*/}
          <Box
            sx={{
              width: { xs: '100%', sm: '65%' },
              display: 'flex',
              flexDirection: 'column',
              padding: '5%',
              alignItems: 'center',
            }}
          >
            {type !== 'growing' && (
              <>
                <Typography variant='h3' color='primary'>
                  {contentTitle}
                </Typography>
                <Typography>
                  Expected time:{' '}
                  {type === 'preSoaking'
                    ? expectedtTime +
                      ` ${expectedtTime > 1 ? 'minutes' : 'minute'}` +
                      ' for soaking seeds '
                    : expectedtTime + ' Minutes'}
                </Typography>
                <Timer contxt='task' />
              </>
            )}
            {content}
          </Box>
        </Box>
      </Box>
      {/* DIALOG */}
      <UserDialog
        title={dialog.title}
        content={dialog.message}
        dialog={dialog}
        setDialog={setDialog}
        actions={dialog.actions}
        open={dialog.open}
      />
    </div>
  );
};
