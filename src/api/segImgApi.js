import { fetch } from "../utils/fetch";
import {backendUrl} from '../utils/utils'
/**
 * 触发模型分割
 */
export function _segImgInvoke(data) {
    return fetch({
      url: `${backendUrl}/comfy-ui/seg-img-invoke`,
      method: 'post',
      data:data
    });
  }
  
  /**
 * 触发 prompt
 */
export function _uploadData(data) {
    return fetch({
      url: `${backendUrl}/comfy-ui/upload-img`,
      method: 'post',
      data: data
    });
  }


  /**
 * 查询历史
 */
  export function _queryHistory(data) {
    return fetch({
      url: `${backendUrl}/comfy-ui/history`,
      method: 'post',
      data: data
    });
  }
  
  
  export default {};