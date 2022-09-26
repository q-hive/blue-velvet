import fs from 'fs'
import path from 'path'
import { getCustomerById } from '../customer/store.js'
import { getOrganizationById } from '../organization/store.js'
import { getAllProducts } from '../products/store.js'
import { buildPDFFromHTML } from './pdfManager.js'

// const {pathname: buildPath} = new URL('./filesDB/newFile.html', import.meta.url)
const buildPath = path.resolve('./components/files/filesDB/order.html')
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
        <table>
            <tr>
                ${config.headers.map((header) => {
                    return `<th>${header.name}</th>`
                }).join('')}
            </tr>
            ${config.rows}
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
    return `
        <div id="headerContainer">
        ${Object.keys(data.textLines).map((key) => {
            if(key === "adressContainer") {
                return `
                    <div id='${key}'>
                        ${Object.keys(data.textLines[key]).map((addressKey) => {
                            return `
                                <h3 id='${addressKey}'>${data.textLines[key][addressKey]}</h3>
                            `
                        }).join('')}
                    </div>
                `
            }
            
            return `<h2 id='${key}'>${data.textLines[key]}</h2>`
        }).join('')}
        </div>
    `
}

export const createCustomerDataStructure = (data) => {
    return `
        <h2><strong>Bill to:</strong></h2>

        ${Object.keys(data).map((key) => {
            if(key === "adressContainer") {
                return `
                    <div id='${key}'>
                        ${Object.keys(data[key]).map((addressKey) => {
                            return `
                                <h3 id=${addressKey}>${data[key][addressKey]}</h3>
                            `
                        }).join('')}
                    </div>
                `
            }
            return `<h2 id='${key}'>${data[key]}</h2>`
        }).join('')}
    `
}

const createInvoiceDataHTML = (data) => {
    return `
        ${Object.keys(data).map((key) => {
            return `<h2 id='${key}'>${data[key]}</h2>`
        }).join('')}
    `
}

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
                <header>${config.header.content}</header>
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
    const customerData = createCustomerDataStructure(data.customerData)

    //*SETS THE HTML STRUCTURE FOR THE INVOICE DATA
    const invoiceData = createInvoiceDataHTML(data.invoiceData)
    //*SETS THE HTML STRUCTURE FOR THE ORDER TABLE
     //*Generate rows
    const rows = data.table.rows.map((row) => createRow(row)).join('');
    
    
    const table = createTable({
        headers:data.table.headers,
        rows:rows
    })

    //*RETURNS THE HTML STRUCTURE

    return {
        header: {
            style: data.header.style,
            content: header
        },
        body: `${customerData} ${invoiceData} ${table}`
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
    return new Promise((resolve, reject) => {
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
            console.log(buildPath)
            fs.writeFileSync(buildPath, html)


            
            buildPDFFromHTML(buildPath)
            .then((pdf) => {
                resolve(pdf)
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
            let indexSize = pack.size === "small" ? 0 : 1
            
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
                    return `Size: ${price.size} Price: ${price.price}`
                })}`
            },
            {
                value: `${mapProd.map((price) => {
                    return `Size: ${price.size} Ordered: ${price.qty}`
                })}`
            },
            {
                value:total
            },
        ]
        
        return {data:productData}
    })

    mappedTable = {headers, rows}
    return {
        header:{
            style: ` 
            table {
                width: 100%;
              }
            tr {
            text-align: left;
            border: 1px solid black;
            }
            th, td {
            padding: 15px;
            }
            table, th, td {
            border:solid 1px black;
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
            #headerContainer {
                justify-content:space-between;
            }
            #addressContainer {
                display: flex;
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
                phone:"123456",
                email:"luis@gmail.com",
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