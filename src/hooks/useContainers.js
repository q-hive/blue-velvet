import { request } from "../utils/helpers/requestsHelper";

const useContainers =  (headers) => {

  const updateContainer = async (containerId, containerConfigModel) => {
    return await request('PATCH',`container/config/${containerId}`, headers, {data: containerConfigModel});
  };

  return {
    updateContainer,
  }

};

export default useContainers;
