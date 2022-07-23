import { ThemeContext } from "@emotion/react";
import { createTheme } from "@mui/material/";

const shadow = "0px 3px 1px -6px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)"
export const BV_THEME = createTheme({
    palette: {
        primary: {
            main: "#0E0C8F",
        },
        secondary: {
            main:"#FF0000",
        },
        
    },

    textColor:{
        lightGray:"#757575",
        darkGray:"#353535",

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
    },

    input:{
        mobile:{
            fullSize:{
                    desktop:{
                        halfSize:       { width:{xs:"98%",sm:"48%"},marginX:"1%",marginY:"2%",boxShadow:shadow},
                        fullSize:       { width:{xs:"98%",sm:"98%"},marginX:"1%",marginY:"2%"},
                        quarterSize:    { width:{xs:"98%",sm:"23%"},marginX:"1%",marginY:"2%"},
                        thirdSize:      { width:{xs:"98%",sm:"33%"},marginX:"1%",marginY:"2%"},
                        twoThirdsSize:  { width:{xs:"98%",sm:"66%"},marginX:"1%",marginY:"2%"},
                    },
                },
            halfSize:{
                desktop:{
                    halfSize:       { width:{xs:"48%",sm:"48%"},marginX:"1%",marginY:"2%"},
                    fullSize:       { width:{xs:"48%",sm:"98%"},marginX:"1%",marginY:"2%"},
                    quarterSize:    { width:{xs:"48%",sm:"23%"},marginX:"1%",marginY:"2%"},
                    thirdSize:      { width:{xs:"48%",sm:"33%"},marginX:"1%",marginY:"2%"},
                    twoThirdsSize:  { width:{xs:"48%",sm:"66%"},marginX:"1%",marginY:"2%"},
                },
                
            },
            twoThirds:{
                desktop:{
                    halfSize:       { width:{xs:"64%",sm:"48%"},marginX:"1%",marginY:"2%"},
                    fullSize:       { width:{xs:"64%",sm:"98%"},marginX:"1%",marginY:"2%"},
                    quarterSize:    { width:{xs:"64%",sm:"23%"},marginX:"1%",marginY:"2%"},
                    thirdSize:      { width:{xs:"64%",sm:"33%"},marginX:"1%",marginY:"2%"},
                    twoThirdsSize:  { width:{xs:"64%",sm:"66%"},marginX:"1%",marginY:"2%"},
                },
                
            },
                

        }
    },


})
