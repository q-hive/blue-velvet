export const transformTo = (inputFormat, outputFormat, number) => {
    if(inputFormat === "ms"){
        if(outputFormat == "minutes")
            number = ((number/1000)/60) 
    }

    return Number(number.toFixed(2))
}