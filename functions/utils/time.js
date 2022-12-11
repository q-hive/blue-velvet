
//     //*InputFormat param is for determining if time is in milliseconds, seconds, minutes hours,days,months, or a date    
// export const estimateDateBasedOnTime = (inputFormat, value) => {
//     return new Date(value)
// }

export const addTimeToDate = (date, delta) => {
    let totalMs = Object.keys(delta)
        .map(key => convertToMs(delta[key], key))
        .reduce((acc, ms) => acc + ms, 0)
    return new Date(date.getTime() + totalMs)
}


export const areSameDay = (first, second) => 
    first.getDate() === second.getDate() && 
    first.getMonth() === second.getMonth() &&
    first.getFullYear() === second.getFullYear()


export const convertToMs = (quant, time) => {
    if (time === "ms")          return quant 
    else if (time === "s")      return quant * 1000
    else if (time === "m")      return quant * 1000 * 60
    else if (time === "h")      return quant * 1000 * 60 * 60
    else if (time === "d")      return quant * 1000 * 60 * 60 * 24
    else if (time === "w")      return quant * 1000 * 60 * 60 * 24 * 7
    else if (time === "month")  return quant * 1000 * 60 * 60 * 24 * 30
    else if (time === "y")      return quant * 1000 * 60 * 60 * 24 * 365
    return 0
}

export const dateToObject = (date) => {
    return new Map(dateToArray(date)
        .map((num, i) => 
        [i === 0 ? "y" : i === 1 ? "m" : "d", num]))
}


export const dateToArray = (date) => {
    return date.toISOString()
        .split('T')[0]
        .split('-').map(num => parseInt(num))
}

export const nextDay = (date) => {
    let arr = dateToArray(date)


    let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // * Validate for leap year
    if (arr[0] % 100 === 0 ? arr[0] % 400 === 0 : arr[0] % 4 === 0) 
        months[1] = months[1] + 1

    // * Next day is at next month
    if (arr[2] + 1 > months[arr[1] - 1]) {
        arr[2] = 1 
        // * Is next year
        if (arr[1] + 1 === 13) {
            arr[1] = 1
            arr[0] = arr[0] + 1
        } else {
            arr[1] = arr[1] + 1
        }   
    }

    return new Date(arr)
}

export const yesterDay = (date) => {
    date.setDate(date.getDate() - 1);
    return date 
}