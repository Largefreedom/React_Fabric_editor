import { fetch } from "../utils/fetch";
import {backendUrl} from '../utils/utils'




/**
 * 触发模型分割
 */
export function _queryProcess(data) {
    return fetch({
      url: `${backendUrl}/comfy-ui/query-process`,
      method: 'post',
      data:data
    });
}

export default {}