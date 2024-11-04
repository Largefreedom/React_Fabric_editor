import { fetch } from "../utils/fetch";



const open_api_url = "http://localhost:8001"


export function _submitDir(data) {
    return fetch({
        url: `${open_api_url}/api/submit-dir`,
        method: 'post',
        data: data        
    })
}


export function _startProcesData(data) {
    return fetch({
        url: `${open_api_url}/api/start/process`,
        method: 'post',
        data: data        
    })
}

export default {}