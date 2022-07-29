

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