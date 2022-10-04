import fs from 'fs'
import puppeteer from 'puppeteer'
import path from 'path'
import { doesFileExist } from './controller.js'


const pdfBuildPath = path.resolve('./components/files/filesDB/order.pdf')
/**
 * @description build a pdf from html taking a snapshot using puppeteer
 * @param {String} html receives a string containing the path to trhe html file to render the PDF 
 */
export const buildPDFFromHTML = (htmlPath) => {
    return new Promise(async (resolve, reject) => {
        try{
            const browser = await puppeteer.launch({args: ['--no-sandbox'], headless:true});
            const page = await browser.newPage();

            await page.goto(`file://${htmlPath}`, {waitUntil: 'networkidle0'})


            
            if(doesFileExist(pdfBuildPath)){
                console.log("PDF already exists, deleting...")
                fs.unlink(pdfBuildPath, (err) => {
                    if(err){
                        return reject(err)
                    }
                })
            }
            const pdf = await page.pdf({path: pdfBuildPath, format:'A4'})

            await browser.close();
            resolve(pdf)
        }
        catch(err){
            reject(err)
        }
    })
    
}