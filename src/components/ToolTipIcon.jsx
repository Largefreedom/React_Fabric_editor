import { useState,useEffect } from "react"
import './ToolTipIcon.css'

export default function ToolTipIcon({jsxEle,tip}){
    
    let [isShow,setIsShow] = useState(false)
    const changeShow = (status) => {
        isShow = status
        setIsShow(status)
    }




    return(
    <div className="icon-item"
        onMouseLeave={() => changeShow(false)}
        onMouseEnter={()=> changeShow(true) }>
            {
                tip && isShow && 
                <span className="tip-show">
                    {tip}
                </span> 
            }
        {jsxEle}
           
    </div>
    )
    
}