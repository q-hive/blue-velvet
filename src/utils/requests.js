const createMixApiRequest = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.api.post(`${api.apiVersion}/products?mix=true`, model, {
                headers:{
                    authorization:credential._tokenResponse.idToken,
                    user:user
                }
            })

            return response
        } catch (err) {
            reject(err)
        }
    })
}