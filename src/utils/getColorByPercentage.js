



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
         
    })
    return result
}