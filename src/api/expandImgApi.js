import { fetch } from "../utils/fetch";
import {backendUrl} from '../utils/utils'



/**
 * 触发模型分割
 */
export function _expandImgInvoke(data) {
    return fetch({
      url: `${backendUrl}/comfy-ui/expand-img`,
      method: 'post',
      data:data
    });
  }
  

  
  
  export default {};