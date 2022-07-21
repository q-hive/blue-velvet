import { createTheme } from "@mui/material/";


export const BV_THEME = createTheme({
    palette: {
        primary: {
            main: "#0E0C8F",
        },
        secondary: {
            main:"#FF0000",
        }
    },

    margin:{
        mainHeader:{xs:"15%",sm:"10%",md:"8%"},

    },


    mobile: {
        only:{  //values for display property
            xs:"flex", sm:"none"
        },
        hidden:{ //values for display property
            xs:"none", sm:"flex"
        }
    }
    
})
