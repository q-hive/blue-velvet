export const transformTo = (inputFormat, outputFormat, number) => {
    if(inputFormat === "ms"){
        if(outputFormat == "minutes")
            number = ((number/1000)/60) 
    }

    return Number(number.toFixed(2))
}

export const addZero = (i)=>{
    if (i < 10) {i = "0" + i}
    return i;
  }

const days = {
    0:"Sunday",
    1:"Monday",
    2:"Tuesday",
    3:"Wednesday",
    4:"Thursday",
    5:"Friday",
    6:"Saturday",
  }
  
export const normalizeDate = (date) => {
      let newDate

      //*WEEKDAY HH:MM:SS
      newDate = days[date.getDay()] +  ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds())
                  
      
      return newDate
  }