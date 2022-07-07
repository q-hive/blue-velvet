import React, {useEffect} from 'react'

//*network
import api from '../../../axios'

export const ProductionMain = () => {

    useEffect(() => {
        const requests = async () => {
            const products = await api.get('/api/v1/products')
            // const productionLines = await api.get('')
            return [products]
        }

        requests()
        .then(resArray => {
            console.log(resArray)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])
  return (
    <div>ProductionMain</div>
  )
}
