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
    0:{
        short:"Sun",
        complete:"Sunday"
    },
    1:{
        short:"Mon",
        complete:"Monday"
    },
    2:{
        short:"Tues",
        complete:"Tuesday"
    },
    3:{
        short:"Wed",
        complete:"Wednesday"
    },
    4:{
        short:"Thurs",
        complete:"Thursday"
    },
    5:{
        short:"Fri",
        complete:"Friday"
    },
    6:{
        short:"Sat",
        complete:"Saturday"
    },
}

const months = {
    0:{
        short:"Jan",
        complete:"January"
    },
    1:{
        short:"Feb",
        complete:"February"
    },
    2:{
        short:"Mar",
        complete:"March"
    },
    3:{
        short:"Apr",
        complete:"April"
    },
    4:{
        short:"May",
        complete:"May"
    },
    5:{
        short:"Jun",
        complete:"June"
    },
    6:{
        short:"Jul",
        complete:"July"
    },
    7:{
        short:"Aug",
        complete:"August"
    },
    8:{
        short:"Sep",
        complete:"September"
    },
    9:{
        short:"Oct",
        complete:"October"
    },
    10:{
        short:"Nov",
        complete:"November"
    },
    11:{
        short:"Dec",
        complete:"December"
    }
}



  
export const normalizeDate = (date) => {
    //*WEEKDAY HH:MM:SS
    return `${days[date.getDay()].complete} ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
}

export const formattedDate = (date) => {
    //*WD, MONTH-DD-YYYY
    return `${days[date.getDay()].short}, ${months[date.getMonth()].complete}-${addZero(date.getDate())}-${date.getFullYear()}`;
}
