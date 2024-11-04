
import Loader from '../../assets/icons/loader.svg?react'
import './ButtonSpinner.less'

export default function ButtonSpinner({onSubmit,text,loading}){
    
    return (
    <>
        <button className="submit-btn" onClick={onSubmit}>
            {!loading ? text: <Loader className="spinner"></Loader> }
        </button>
    </>)

    
    
}