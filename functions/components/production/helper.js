

export const addTimeToDate = (date, delta) {
    let totalMs = Object.keys(delta)
        .map(key => convertToMs(delta[key], key))
        .reduce((acc, ms) => acc + ms)
    return new Date(date.getTime() + totalMs)
}


export const areSameDay = (first, second) => 
    first.getDate() === second.getDate() && 
    first.getMonth() === second.getMonth() &&
    first.getFullYear() === second.getFullYear()


export const convertToMs = (quant, time) => {
    if (time === "ms") {
        return time
    } else if (time === "s") {
        return time * 1000
    } else if (time === "m") {
        return time * 1000 * 60
    } else if (time === "h") {
        return time * 1000 * 60 * 60
    } else if (time === "d") {
        return time * 1000 * 60 * 60 * 24
    } else if (time === "w") {
        return time * 1000 * 60 * 60 * 24 * 7
    } else if (time === "month") {
        return time * 1000 * 60 * 60 * 24 * 30
    } else if (time === "y") {
        return time * 1000 * 60 * 60 * 24 * 365
    } 
    return 0
}