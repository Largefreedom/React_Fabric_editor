import axios from 'axios';

export default function defaultFetch() {}

export async function fetch(options) {
  const instance = await axios.create({
    timeout: 1000 * 60, // 超时  (设定请求时长 60s)
  });
  try {
    const result = await instance(options);
    console.log('resul r is',result)
    return result.data.data || null;
  } catch (error) {
    alert(error.stack)
    console.log('error is ', error)
    return 0;
  }
}