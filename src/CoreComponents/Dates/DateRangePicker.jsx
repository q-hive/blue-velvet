import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

const DateRangePicker = (props) => {
  const { startDate, endDate, handleStartDateChange, handleEndDateChange } =
    props;
    
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangePicker;
