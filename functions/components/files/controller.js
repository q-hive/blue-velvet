import fs from 'fs'
import path from 'path'
import { getCustomerById } from '../customer/store.js'
import { getOrganizationById } from '../organization/store.js'
import { getAllProducts } from '../products/store.js'
import { buildPDFFromHTML } from './pdfManager.js'

import {mongoose} from '../../mongo.js'
import Client from '../../models/client.js'

const ownerModel = mongoose.model('clients', Client)
// import bvLogo from '../../assets/images/logos/blue-velvet'
const buildPath = path.resolve('./components/files/filesDB/orderStyled.html')
const blvtLogoPath = "https://github.com/q-hive/blue-velvet/blob/deploy/src/assets/images/png-Logos/blue-velvet.png?raw=true"
const softwareLogoPath = "https://github.com/q-hive/blue-velvet/blob/deploy/src/assets/images/png-Logos/softwareLogo.png?raw=true"
/**
 * Take an object with the following model
 * @param {Object} item
 * @model
 * {
 *  "data":[
 *      {
 *          value:"ITEM1"
 *      },
 *      {
 *          value:"ITEM2"
 *      },
 *  ]
 * }
 */
export const createRow = (item) => {
    console.log("Building row for table")
    console.log(item)
    return `
        <tr>
            ${item.data.map((data) => {
                return `<td>${data.value}</td>`
            }).join('')}
        </tr>
    `
}


/**
 * @description Generates a new table for PDF receiving a config object with the following model
 * @param {Object}
 * @model
 * {
 *  headers:[
 *      {
 *          name:"HEADERNAME"
 *      },
 *      {
 *          name:"HEADERNAME"
 *      },
 *  ],
 *  rows:['<tr></tr>', '<tr></tr>']
 * }
 * @returns {String}
 */
export const createTable = (config) => {
    return `
        <div id="tableContainer">
            <table style="width:75%;">
                <thead>
                    <tr>
                        ${config.headers.map((header) => {
                            return `<th>${header.name}</th>`
                        }).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${config.rows}
                </tbody>
                <tfoot>
                    <td></td>
                    <td></td>
                    
                    ${config.footer.join('')}
                </tfoot>

            </table>
            
        </div>
    `
}

/**
 * @description creates the Header structure for the HTML of the order for PDF styling
 * @param {Object} data receives an object with the following structure
 * {
 *  
 * }
 */
export const createInvoiceHeader = (data) => {
    const getAddressContainer = () => {
        const adressData = Object.entries(data.textLines).find((key) => {
            return key[0] === "adressContainer"
        })

        console.log(adressData)

        const h3 = Object.entries(adressData[1]).map((entry) => {
            return `
                <h3 id='${entry[0]}'>${entry[1]}</h3>
            `
        }).join('')

        const adressHTML = `
            <div id="addressContainer">
                ${h3}
            </div>
        `


        return adressHTML
    }
    const getClientContainer = () => {
        console.log("Building client data container")
        console.log(data)
        const headerColumn1 = `
            <h2 id="businessName">${data.textLines.businessName}</h2>
            ${getAddressContainer()}
            <br/>
            <h2 id="phone">Phone Number: ${data.textLines.phone}</h2>
            <h2 id="email">E-Mail: ${data.textLines.email}</h2>
        `
        const headerColumn2 = `
            <h1 id='pdfType' class="right">${data.textLines.pdfType}</h1>
        `

        const headersHTML = `
            <div class="headerColumn">
                ${headerColumn1}
            </div>
            <div class="headerColumn">
                ${headerColumn2}
            </div>

        `
        return headersHTML
    }   
    
    return `
        <header>
            <div id="logoHeader">

                <div class="headerColumn">
                    <img src="${softwareLogoPath}" style="width:65%">
                </div>
                
                <div class="headerColumn">
                    <img src="${blvtLogoPath}" style="display:block;margin-left:auto;width:65%"/>
                </div>
            
            </div>
        </header>
    
        <div id="clientContainer" class="orderContainer">
            ${getClientContainer()}
        </div>

        <hr class="divider"/>
    `
}

export const createCustomerBillingStructure = (data) => {
    return `
        <div id="billingContainer" class="orderContainer">
            <div style="width:10%; float:left;">
                <h2><strong>Bill to:</strong></h2>
            </div>

            <div id='addressContainer' style="width:40%;float:left;">
                <h2 id="clientName">${data.customer.clientName}</h2>
                ${Object.keys(data.customer.adressContainer).map((key) => {
                    return `
                        <p id=${key}><strong>${key}: </strong>${data.customer.adressContainer[key]}</p>
                    `
                }).join('')}
            </div>
            
            <div style="width:50%;float:left;">
                <h3 id="invoiceNumber"><b>Invoice Number: <b/> ${data.invoice.invoiceNumber}</h3>
                <h3 id="date"><b>Date:</b> ${data.invoice.date}</h3>
            </div>
        </div>
    `
}

// const createInvoiceDataHTML = (data) => {
//     return `
//         <div id="billingContainer" class="orderContainer">
//             ${Object.keys(data).map((key) => {

//                 return `<h2 id='${key}'>${data[key]}</h2>`
//             }).join('')}
//         </div>
//     `
// }

/** 
 * @description receives an Object with the style and the body as strings containing the html
*/
export const createHTML = (config) => {
    return `
        <html>
            <head>
                <style>
                    ${config.header.style}
                </style>
            </head>

            <body>
                ${config.header.content}
                ${config.body}
            </body>
        </html>
    `;
}


/** 
 * @description check if a file exists in file sistem checking for status
 * @param {String} filePath 
*/
export const doesFileExist = (filePath) => {
    try{
        fs.statSync(filePath);
        return true
    } catch (err){
        return false
    }
}

const createOrderPDFStruct = (data) => {
    //*SETS THE HTML STRUCTURE FOR THE INVOICE HEADER
    const header = createInvoiceHeader(data.header)
    
    //*SETS THE HTML STRUCTURE FOR THE CUSTOMER DATA
    const customerData = createCustomerBillingStructure({customer:data.customerData, invoice:data.invoiceData})

    //*SETS THE HTML STRUCTURE FOR THE INVOICE DATA
    // const invoiceData = createInvoiceDataHTML(data.invoiceData)
    //*SETS THE HTML STRUCTURE FOR THE ORDER TABLE
     //*Generate rows
    const rows = data.table.rows.map((row) => createRow(row)).join('');
    
    const footer = data.table.footer


    const table = createTable({
        headers:data.table.headers,
        rows:rows,
        footer: footer
    })

    //*RETURNS THE HTML STRUCTURE

    return {
        header: {
            style: data.header.style,
            content: header
        },
        body: `${customerData} ${table}`
    }
}

const createStructure = (type, data) => {
    switch(type){
        case "order":
            return createOrderPDFStruct(data)
    }
}

/**
 * 
 * @description creates the Order PDF using the file controller reciving the following model
 * @param {Object} orderPDFConfig
 * @model
 * {
    header:{
        style: ``,
        textLines: {
            pdfType:"",
            businessName:"",
            businessAddress: "",
            adressContainer:{
                city:"",
                state:"",
                cp:"",
            },
            phone:"",
            email:"",
        }
    },
    customerData:{
        clientName: "",
        clientAddress: "",
        adressContainer:{
            city:"",
            state:"",
            cp:"",
        },
    },
    invoiceData: {
        invoiceNumber: "",
        date:""
    },
    table:{
        headers:[
            {
                name:""
            },
            {
                name:""
            },
            {
                name:""
            },
        ],
        rows:[
            {
                data:[
                    {
                        value:""
                    },
                    {
                        value:""
                    },
                    {
                        value:""
                    },
                ]
            },
        ]
    }
}
 * 
 */
export const createOrderInvoicePdf = (orderPDFConfig) => {
    return new Promise(async (resolve, reject) => {
        if(doesFileExist(buildPath)){
            console.log("HTML File already exists, deleting old file")

            fs.unlink(buildPath, (err) => {
                if(err){
                    return reject(err)
                }
            })

        }
        
        try{
            const config = createStructure("order", orderPDFConfig)
    
            const html = createHTML(config)

            console.log("The file will be saved on the following path: " + buildPath)
            fs.writeFile(buildPath, html, (err) => {
                if(err){
                    return reject(err)
                }
            })
            // fs.writeFileSync(buildPath, html)


            
            buildPDFFromHTML(buildPath)
            .then((file) => {
                resolve(file)
            })
            .catch((err) => {
                reject(err)
            })


        } catch (err) {
            reject(err)
        }

    })
}

export const createConfigObjectFromOrder = async (order) => {
    const customer = await getCustomerById(order.organization, order.customer)
    const organization = await getOrganizationById(order.organization)
    const orgOwner = await ownerModel.find({_id:organization.owner})
    console.log(orgOwner)
    const products = await getAllProducts(order.organization)
    let mappedTable

    const headers = [
        {
            name:"Product name"
        },
        {
            name:"Product price"
        },
        {
            name:"Quantity"
        },
        {
            name:"Total"
        },
    ]

    const rows = order.products.map((product) => {
        let productData
        const mapProd = product.packages.map((pack) => {
            let indexSize;

            switch(pack.size){
                case "small": 
                    indexSize = 0;
                    break;
                case "medium": 
                    indexSize = 1;
                    break;
                case "large": 
                    indexSize = 2;
                    break;
            }
            
            return {
                size:   pack.size, 
                price:  product.price[indexSize].amount, 
                qty:    pack.number, 
                total:  product.price[indexSize].amount*pack.number
            }
        })
        
        const total = mapProd.reduce((prev, curr) => {
            return prev + curr.total
        },0)
        
        productData = [
            {
                value: product.name
            },
            {
                value: `${mapProd.map((price) => {
                    return `${price.size}: ${price.price}`
                })}`
            },
            {
                value: `${mapProd.map((price) => {
                    return `${price.size}: ${price.qty}`
                })}`
            },
            {
                value:total
            },
        ]
        
        return {data:productData}
    })

    const footer = ['<th id="total" class="right, endTable"><b>Total :</b><th/>', `<td class="endTable">${order.price}</td>`]
    mappedTable = {headers, rows, footer}
    return {
        header:{
            style: ` 
            body{
                font-family: Arial, Helvetica, sans-serif;
                width:65em;
                padding-bottom: 5%;
            }

            p{
                font-size: 1.8vh;
                font-weight: 500;
            }
            h3{
                font-weight: 500;
            }
            html {
                -webkit-print-color-adjust: exact;
            }
            .right{text-align:right;align-items: right;}
            
            table {
                width: 100%;
                border-spacing: 0px;
                border-width: 0px;
                border-style: hidden hidden solid;
                border-collapse: collapse;
            }
            tr {
                text-align: left;
            }

            th,td {
                border-width: 2px;
                padding: 15px;
                border-style: solid;
                border-color: #2F4DA5;
            }

            thead tr th {
                background: #93cf0f;
                color: #FFF;
            }


            tfoot td{
                background: #FFF;
                border-style: hidden;
            }

            .endTable{
                background: #FFF;
                border-style: hidden hidden solid ;
                border-collapse: separate !important;
            }

            tr:nth-child(odd) {
                background: #CCC
            }

            tr:nth-child(even) {
                background: #FFF
            }

            .no-content {
                background-color: red;
            }

            .orderContainer{
                width:95%;
                padding:3%;
                margin-top: 1%;
                overflow: auto;
                
            }

            #clientContainer {
                justify-content: space-between;
            }

            #billingContainer{

            }

            #addressContainer {
                justify-content: space-evenly;
            }
            
            #tableContainer {
                width:100%;
                display:flex;
                justify-content: center;
                align-items: center;
            }

            .headerColumn{
                width:50%;
                float:left;
            }
            .divider{
                border: 10px solid #2F4DA5;
                border-radius: 5px;
            }
            `,
            textLines: {
                pdfType:"Invoice",
                businessName:organization.name,
                businessAddress: organization.address.street,
                adressContainer:{
                    city:organization.address.country,
                    state:organization.address.state,
                    cp:organization.address.zip,
                },
                phone:orgOwner[0].phone,
                email:orgOwner[0].email,
            }
        },
        customerData:{
            clientName: customer.name,
            clientAddress: customer.address.street,
            adressContainer:{
                city:customer.address.city,
                state:customer.address.state,
                cp:customer.address.zip,
            },
        },
        invoiceData: {
            invoiceNumber: order._id,
            date:order.date,
            Total: order.price
        },
        table:mappedTable
    }
}



const buildTableForInvoiceFromManyOrders = (orders, totalAmount) => {
    let mappedTable
    let rows

    const headers = [
        {
            name:"Product name"
        },
        {
            name:"Product price"
        },
        {
            name:"Quantity"
        },
        {
            name:"Total"
        },
    ]

    const hashProducts = {}
    
    orders.map((order) => {
        const mappedProducts = order.products.map((product) => {
            let productData
            
            if(hashProducts[product.name]){
                
            } else {
                hashProducts[product.name] = {
                    "small":{
                        "number":0,
                        "price":0,
                        "totalPrice":0
                    },
                    "medium":{
                        "number":0,
                        "price":0,
                        "totalPrice":0
                    },
                    "large":{
                        "number":0,
                        "price":0,
                        "totalPrice":0
                    },
                    "total":0
                }
            }
            
            const mapProd = product.packages.map((pack) => {
                let indexSize;
    
                switch(pack.size){
                    case "small": 
                        indexSize = 0;
                        break;
                    case "medium": 
                        indexSize = 1;
                        break;
                    case "large": 
                        indexSize = 2;
                        break;
                }

                
                hashProducts[product.name][pack.size]["number"] = hashProducts[product.name][pack.size]["number"] + pack["number"];
                hashProducts[product.name][pack.size]["price"] = product.price[indexSize].amount;
                hashProducts[product.name][pack.size]["totalPrice"] = hashProducts[product.name][pack.size]["totalPrice"] + product.price[indexSize].amount*pack.number;
                return {
                    size:   pack.size, 
                    price:  product.price[indexSize].amount, 
                    qty:    pack.number, 
                    total:  product.price[indexSize].amount*pack.number
                }
            })
            
            const total = mapProd.reduce((prev, curr) => {
                return prev + curr.total
            },0)

            hashProducts[product.name]["total"] +=+ total; 
        })
        
    })

    rows = Object.keys(hashProducts).map((name) => {
        const data = [
            {
                value:name,
            },
            {
                value: `${Object.keys(hashProducts[name]).map((size) => {
                    return `${size}: ${hashProducts[name][size]["price"]}`
                })}`
            },
            {
                value: `${Object.keys(hashProducts[name]).map((size) => {
                    return `${size}: ${hashProducts[name][size]["number"]}`
                })}`
            },
            {
                value:hashProducts[name]["total"]
            },
        ]
        
        return {data:data}
    })


    const footer = ['<th id="total" class="right, endTable"><b>Total :</b><th/>', `<td class="endTable">${totalAmount}</td>`]
    mappedTable = {headers, rows, footer}

    return mappedTable
    
}

export const createConfigObjectFromManyOrders = (shapedOrgData) => {
    let table = buildTableForInvoiceFromManyOrders(shapedOrgData[0].orders, shapedOrgData[0].totalIncome)
        
    return {
        header:{
            style: ` 
            body{
                font-family: Arial, Helvetica, sans-serif;
                width:65em;
                padding-bottom: 5%;
            }

            p{
                font-size: 1.8vh;
                font-weight: 500;
            }
            h3{
                font-weight: 500;
            }
            html {
                -webkit-print-color-adjust: exact;
            }
            .right{text-align:right;align-items: right;}
            
            table {
                width: 100%;
                border-spacing: 0px;
                border-width: 0px;
                border-style: hidden hidden solid;
                border-collapse: collapse;
            }
            tr {
                text-align: left;
            }

            th,td {
                border-width: 2px;
                padding: 15px;
                border-style: solid;
                border-color: #2F4DA5;
            }

            thead tr th {
                background: #93cf0f;
                color: #FFF;
            }


            tfoot td{
                background: #FFF;
                border-style: hidden;
            }

            .endTable{
                background: #FFF;
                border-style: hidden hidden solid ;
                border-collapse: separate !important;
            }

            tr:nth-child(odd) {
                background: #CCC
            }

            tr:nth-child(even) {
                background: #FFF
            }

            .no-content {
                background-color: red;
            }

            .orderContainer{
                width:95%;
                padding:3%;
                margin-top: 1%;
                overflow: auto;
                
            }

            #clientContainer {
                justify-content: space-between;
            }

            #billingContainer{

            }

            #addressContainer {
                justify-content: space-evenly;
            }
            
            #tableContainer {
                width:100%;
                display:flex;
                justify-content: center;
                align-items: center;
            }

            .headerColumn{
                width:50%;
                float:left;
            }
            .divider{
                border: 10px solid #2F4DA5;
                border-radius: 5px;
            }
            `,
            textLines: {
                pdfType:"Invoice",
                businessName:shapedOrgData[0].name,
                businessAddress: shapedOrgData[0].address.street,
                adressContainer:{
                    city:shapedOrgData[0].address.country,
                    state:shapedOrgData[0].address.state,
                    cp:shapedOrgData[0].address.zip,
                },
                phone:shapedOrgData[0].owner[0].phone,
                email:shapedOrgData[0].owner[0].email,
            }
        },
        customerData:{
            clientName: shapedOrgData[0].customer[0].name,
            clientAddress: shapedOrgData[0].customer[0].address.street,
            adressContainer:{
                city:shapedOrgData[0].customer[0].address.city,
                state:shapedOrgData[0].customer[0].address.state,
                cp:shapedOrgData[0].customer[0].address.zip,
            },
        },
        invoiceData:{
            price:shapedOrgData[0].totalIncome,
            date:shapedOrgData[0].invoice.date,
            invoiceNumber:shapedOrgData[0].invoice._id
        },
        table:table,
    }
}