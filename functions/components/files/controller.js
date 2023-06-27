import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { getCustomerById } from '../customer/store.js'
import { getOrganizationById } from '../organization/store.js'
import { getAllProducts } from '../products/store.js'
import { buildPDFFromHTML } from './pdfManager.js'

import { mongoose } from '../../mongo.js'
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

    const rowData = item.data.map((data)=>{
        const value = data.value;
        const values = value.split(',');
        return values.map((val)=>`<td>${val}</td>`).join('');
    }).join('');
    return `<tr>${rowData}</tr>`;
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
        <table>
            <thead>
                <tr>
                    ${config.headers.map((header, index) => {
                        if (index === 0 || index === config.headers.length-1) {
                            return `<th rowspan="2">${header.name}</th>`
                        } else {
                            return `<th colspan="2">${header.name}</th>`
                        }
                    }).join('')}
                </tr>
                <tr>
                    ${Array(2).fill().map(() => {
                        return `
                            <th>Small</th>
                            <th>Medium</th>
                        `
                    }).join('')}
                </tr>
            </thead>
            <tbody>
                ${config.rows}
                ${config.footer}
            </tbody>
        </table>
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
    console.log("Building client data container")
    console.log(data)
    const {textLines} = data
    const headerColumn1 = `
        <h2>${textLines?.businessName}</h2>
        <h3>${textLines?.containerName}</h3>
        <p>${textLines?.email}</p>
        <p>${textLines?.phone}</p>
        <p>${textLines.addressContainer?.city}, ${textLines.addressContainer?.state}, ${textLines.addressContainer?.cp}</p>
    `
    const headerColumn2 = `
        <h1>${textLines?.pdfType}</h1>
    `

    const headersHTML = `
        <div class="invoice-section">
            <div class="invoice-details">
                ${headerColumn1}
            </div>
            <div class="invoice-details">
                ${headerColumn2}
            </div>
        </div>
        <hr>
    `
    return headersHTML
}

export const createCustomerBillingStructure = (data) => {
    const {customer, invoice} = data;
    const {address} = customer;
    const {deliveryAddress} = invoice;
    const customerAddress = `
        <p>${address?.street},${address?.stNumber},${address?.cp}</p>
        <p>${address?.city},${address?.state},${address?.country}</p>
        <p>References: ${address?.references}</p>
    `;
    const orderAddress = `
        <p>${deliveryAddress?.street},${deliveryAddress?.stNumber},${deliveryAddress?.cp}</p>
        <p>${deliveryAddress?.city},${deliveryAddress?.state},${deliveryAddress?.country}</p>
        <p>References: ${deliveryAddress?.references}</p>
    `;
    return `
        <div class="order-details">
            <div class="customer-details">
                <h2>Bill to: ${customer?.clientName}</h2>
                <p>${customer?.clientEmail}</p>
                ${orderAddress}
            </div>
            
            <div class="customer-details">
                <h3>Invoice Number: ${invoice?.invoiceNumber}</h3>
                <h3>Date: ${invoice?.date}</h3>
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
                <header>
                    <img src="${softwareLogoPath}" alt="Software logo">
                    <img src="${blvtLogoPath}" alt="Container logo">
                </header>

                <div class="order-container">
                    ${config.header.content}
                    ${config.body}
                </div>
            </body>
        </html>
    `;
}

/** 
 * @description check if a file exists in file sistem checking for status
 * @param {String} filePath 
*/
export const doesFileExist = (filePath) => {
    try {
        fs.statSync(filePath);
        return true
    } catch (err) {
        return false
    }
}

const createOrderPDFStruct = (data) => {
    //*SETS THE HTML STRUCTURE FOR THE INVOICE HEADER
    const header = createInvoiceHeader(data.header)

    //*SETS THE HTML STRUCTURE FOR THE CUSTOMER DATA
    const customerData = createCustomerBillingStructure({ customer: data.customerData, invoice: data.invoiceData })

    //*SETS THE HTML STRUCTURE FOR THE INVOICE DATA
    // const invoiceData = createInvoiceDataHTML(data.invoiceData)
    //*SETS THE HTML STRUCTURE FOR THE ORDER TABLE
    //*Generate rows
    const rows = data.table.rows.map((row) => createRow(row)).join('');

    const footer = data.table.footer

    const table = createTable({
        headers: data.table.headers,
        rows: rows,
        footer: footer
    })

    //*RETURNS THE HTML STRUCTURE

    return {
        header: {
            style: data.header.style,
            content: header
        },
        body: `
            ${customerData}
            ${table}
        `
    }
}

const createStructure = (type, data) => {
    switch (type) {
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
        if (doesFileExist(buildPath)) {
            console.log("HTML File already exists, deleting old file")

            fs.unlink(buildPath, (err) => {
                if (err) {
                    return reject(err)
                }
            })

        }

        try {
            const config = createStructure("order", orderPDFConfig)
            const html = createHTML(config)

            console.log("The file will be saved on the following path: " + buildPath)
            fs.writeFile(buildPath, html, (err) => {
                if (err) {
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
    const orgOwner = await ownerModel.find({ _id: organization.owner })
    const formattedOrderDate = moment(order.date).format('ddd, MMM DD, YYYY h:mm A');
    const products = await getAllProducts(order.organization)
    let mappedTable

    const headers = [
        { name: "Product name" },
        { name: "Product price" },
        { name: "Quantity" },
        { name: "Total" },
    ]

    const rows = order.products.map((product) => {
        let productData
        const mapProd = product.packages.map((pack) => {
            let indexSize;

            switch (pack.size) {
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
                size: pack.size,
                price: product.price[indexSize].amount,
                qty: pack.number,
                total: product.price[indexSize].amount * pack.number
            }
        })

        const total = mapProd.reduce((prev, curr) => {
            return prev + curr.total
        }, 0)

        productData = [
            { value: product.name },
            { value: `${mapProd.map((prod) => prod.price).join(',')}` },
            { value: `${mapProd.map((prod) => prod.qty).join(',')}` },
            { value: total.toString() },
        ];
        const filteredProductData = productData.filter((item) => item.value !== '');

        return { data: filteredProductData }
    })

    const footer = `
        <tr>
            <td colspan="5" class="total-txt">Total:</td>
            <td class="total-price">${order?.price}</td>
        </tr>`

    mappedTable = { headers, rows, footer }
    return {
        header: {
            style: `
            body {
                font-family: Arial, Helvetica, sans-serif;
                max-width: 60em;
                margin: 0 auto;
                background-color: #F5F5F5;
            }
    
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2em 0;
                border-bottom: 2px solid #2F4DA5;
            }
    
            header img {
                width: 30%;
            }
    
            .order-container {
                width: 90%;
                margin: 2em auto;
            }
    
            .invoice-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 2em;
            }
    
            .invoice-details {
                width: 50%;
            }
    
            .order-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2em;
            }
    
            .customer-details {
                width: 50%;
            }
    
            h1, h2, h3, p {
                margin: 0;
            }
    
            h1 {
                font-size: 2.5em;
                text-align: right;
                color: #2F4DA5;
            }
    
            h2 {
                font-size: 2em;
                color: #2F4DA5;
                margin-bottom: 0.5em;
            }
    
            h3 {
                font-size: 1.5em;
                color: #666;
            }
    
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 2em;
            }
    
            th, td {
                padding: 1em;
                text-align: center;
                border-bottom: 1px solid #CCC;
            }
    
            th {
                background: #2F4DA5;
                color: #FFF;
            }
    
            tr:nth-child(odd) {
                background: #EFEFEF;
            }
    
            tr:nth-child(even) {
                background: #F5F5F5;
            }
    
            .total-txt, .total-price {
                font-weight: bold;
                font-size: 1.2em;
                color: #2F4DA5;
                text-align: right;
            }
    
            .total-price {
                text-align: center;
            }
            `,
            textLines: {
                pdfType: "Invoice",
                businessName: organization.name,
                containerName: organization.containers[0].name,
                addressContainer: {
                    street: organization?.address?.street,
                    stNumber: organization?.address?.stNumber,
                    cp: organization?.address?.zip,
                    city: organization?.address?.city,
                    state: organization?.address?.state,
                    country: organization?.address?.country,
                    references: organization?.address?.references,
                },
                email: orgOwner[0]?.email,
                phone: orgOwner[0]?.phone,
            }
        },
        customerData: {
            clientName: customer?.name,
            clientEmail: customer?.email,
            address: {
                street: customer?.address?.street,
                stNumber: customer?.address?.stNumber,
                cp: customer?.address?.zip,
                city: customer?.address?.city,
                state: customer?.address?.state,
                country: customer?.address?.country,
                references: customer?.address?.references,
            },
        },
        invoiceData: {
            invoiceNumber: order._id,
            date: formattedOrderDate,
            Total: order.price,
            deliveryAddress: {
                street: order?.address?.street,
                stNumber: order?.address?.stNumber,
                cp: order?.address?.zip,
                city: order?.address?.city,
                state: order?.address?.state,
                country: order?.address?.country,
                references: order?.address?.references,
            }
        },
        table: mappedTable
    }
}

const buildTableForInvoiceFromManyOrders = (orders, totalAmount) => {
    let mappedTable
    let rows

    const headers = [
        { name: "Product name" },
        { name: "Product price" },
        { name: "Quantity" },
        { name: "Total" },
    ]

    const hashProducts = {}

    orders.map((order) => {
        const mappedProducts = order.products.map((product) => {
            let productData

            if (hashProducts[product.name]) {

            } else {
                hashProducts[product.name] = {
                    "small": {
                        "number": 0,
                        "price": 0,
                        "totalPrice": 0
                    },
                    "medium": {
                        "number": 0,
                        "price": 0,
                        "totalPrice": 0
                    },
                    "large": {
                        "number": 0,
                        "price": 0,
                        "totalPrice": 0
                    },
                    "total": 0
                }
            }

            const mapProd = product.packages.map((pack) => {
                let indexSize;

                switch (pack.size) {
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
                hashProducts[product.name][pack.size]["totalPrice"] = hashProducts[product.name][pack.size]["totalPrice"] + product.price[indexSize].amount * pack.number;
                return {
                    size: pack.size,
                    price: product.price[indexSize].amount,
                    qty: pack.number,
                    total: product.price[indexSize].amount * pack.number
                }
            })

            const total = mapProd.reduce((prev, curr) => {
                return prev + curr.total
            }, 0)

            hashProducts[product.name]["total"] += + total;
        })

    })

    rows = Object.keys(hashProducts).map((name) => {
        const data = [
            {
                value: name,
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
                value: hashProducts[name]["total"]
            },
        ]

        return { data: data }
    })


    const footer = ['<th id="total" class="right, endTable"><b>Total :</b><th/>', `<td class="endTable">${totalAmount}</td>`]
    mappedTable = { headers, rows, footer }

    return mappedTable

}

export const createConfigObjectFromManyOrders = (shapedOrgData) => {
    let table = buildTableForInvoiceFromManyOrders(shapedOrgData[0].orders, shapedOrgData[0].totalIncome)

    return {
        header: {
            style: `
            body {
                font-family: Arial, Helvetica, sans-serif;
                max-width: 60em;
                margin: 0 auto;
                background-color: #F5F5F5;
            }
    
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2em 0;
                border-bottom: 2px solid #2F4DA5;
            }
    
            header img {
                width: 30%;
            }
    
            .order-container {
                width: 90%;
                margin: 2em auto;
            }
    
            .invoice-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 2em;
            }
    
            .invoice-details {
                width: 50%;
            }
    
            .order-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2em;
            }
    
            .customer-details {
                width: 50%;
            }
    
            h1, h2, h3, p {
                margin: 0;
            }
    
            h1 {
                font-size: 2.5em;
                text-align: right;
                color: #2F4DA5;
            }
    
            h2 {
                font-size: 2em;
                color: #2F4DA5;
                margin-bottom: 0.5em;
            }
    
            h3 {
                font-size: 1.5em;
                color: #666;
            }
    
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 2em;
            }
    
            th, td {
                padding: 1em;
                text-align: center;
                border-bottom: 1px solid #CCC;
            }
    
            th {
                background: #2F4DA5;
                color: #FFF;
            }
    
            tr:nth-child(odd) {
                background: #EFEFEF;
            }
    
            tr:nth-child(even) {
                background: #F5F5F5;
            }
    
            .total-txt, .total-price {
                font-weight: bold;
                font-size: 1.2em;
                color: #2F4DA5;
                text-align: right;
            }
    
            .total-price {
                text-align: center;
            }
            `,
            textLines: {
                pdfType: "Invoice",
                businessName: shapedOrgData[0].name,
                businessAddress: shapedOrgData[0].address.street,
                addressContainer: {
                    city: shapedOrgData[0].address.country,
                    state: shapedOrgData[0].address.state,
                    cp: shapedOrgData[0].address.zip,
                },
                phone: shapedOrgData[0].owner[0].phone,
                email: shapedOrgData[0].owner[0].email,
            }
        },
        customerData: {
            clientName: shapedOrgData[0].customer[0].name,
            clientAddress: shapedOrgData[0].customer[0].address.street,
            addressContainer: {
                city: shapedOrgData[0].customer[0].address.city,
                state: shapedOrgData[0].customer[0].address.state,
                cp: shapedOrgData[0].customer[0].address.zip,
            },
        },
        invoiceData: {
            price: shapedOrgData[0].totalIncome,
            date: shapedOrgData[0].invoice.date,
            invoiceNumber: shapedOrgData[0].invoice._id
        },
        table: table,
    }
}