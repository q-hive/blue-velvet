



export const getColorByPercentage = (percentage,colorArr) => {

    if(colorArr == undefined){
        colorArr=["primary","warning","error"]
    }

    let bp=1/colorArr.length

    let result
    colorArr.map((color,index) =>{
        if (percentage<(bp*(index+1)) && result == undefined){  
            return result = color
        }
        if(percentage>(bp*colorArr.length)){
            return result = colorArr[colorArr.length-1]
        }
         
    })
    return result
}