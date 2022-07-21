import morgan from 'morgan'
import moment from 'moment-timezone'
import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

export const useMorgan = (app) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const __logname = path.join(__dirname, '', 'access.log')
    
    // * Create file if log doesn't exists
    if (!fs.existsSync(__logname)) {
        fs.writeFileSync(__logname, "")
    }

    const accessLogStream = fs.createWriteStream(
        __logname,
        { flags: 'a' }
    );

    morgan.token('date', (req, res, tz) => {
        return moment().tz(tz).format();
    })
    morgan.format('myformat', 
        '[:date[Asia/Taipei]] ":method :url" :status '+
        ':res[content-length] - :response-time ms')

    app.use(morgan('myformat', { stream: accessLogStream }))
}