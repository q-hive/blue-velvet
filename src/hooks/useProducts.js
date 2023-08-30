import { request } from "../utils/helpers/requestsHelper";

const useProducts =  (headers) => {

  const addProduct = async (mappedProduct) => {
    return await request('POST',`products/`, headers, {data: mappedProduct});
  };

  const updateProductById = async (id, mappedProduct) => {
    return await request('PATCH',`products/?id=${id}`, headers, {data: mappedProduct});
  };

  const updateProductConfigById = async (id, productionDataUpdate) => {
    return await request('PATCH',`products/productionParams/${id}`, headers, {data: productionDataUpdate});
  };

  const addMixProduct = async (mixData) => {
    return await request('POST',`products?mix=true`, headers, {data: mixData});
  };
  
  const deleteProduct = async (id) => {
    return await request('DELETE',`products/?id=${id}`, headers);
  };

  const getProductRelation = async (id) => {
    return await request('GET', `products/${id}/relations`, headers);
  };

  const getProducts = async () => {
    return await request('GET',`products/`, headers);
  };

  const getProductsCompleteData = async () => {
    return await request('GET',`products/?orders&tasks&performance`, headers);
  };



  return {
    addProduct,
    updateProductById,
    updateProductConfigById,
    addMixProduct,
    deleteProduct,
    getProductRelation,
    getProducts,
    getProductsCompleteData,
  }

};

export default useProducts;
