



export const getColorByPercentage = (percentage,colorArr) => {

    if(colorArr == undefined){
        colorArr=["primary","warning","error"]
    }

    let bp=1/colorArr.length

    console.log("array of reserved colors",colorArr)

    let result
    colorArr.map((color,index) =>{
        console.log(bp*(index+1))
        
        if (percentage<(bp*(index+1)) && result == undefined){  
         console.log(color)
         return result = color
            
        }
        if(percentage>(bp*colorArr.length)){
            return result = colorArr[colorArr.length-1]
        }
         
    })
    return result
}