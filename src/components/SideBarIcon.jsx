import IconButton from "blocksin-system/dist/IconButton"
import { useState } from "react"
import './SideBarIcon.css'

export default function SideBarIcon({jsxEle,tipName,func}){
    let [isShow,setIsShow] = useState(false)
    
    const changeIsShow = (res) => {
        isShow = res
        setIsShow(isShow)
    }

    return (
        (
        func ?
        <IconButton
            onClick={func}
            onMouseEnter={() => {
                changeIsShow(true)
            }}
            onMouseLeave= {
                () => {
                    changeIsShow(false)}
            }>
            {tipName && isShow &&
            <span className="tip">
                {tipName}
            </span>
            }
            {jsxEle}
        </IconButton> : 
        <IconButton
       
            onMouseEnter={() => {
                changeIsShow(true)
            }}
            onMouseLeave= {
                () => {
                    changeIsShow(false)}
            }>
            {tipName && isShow &&
            <span className="tip">
                {tipName}
            </span>
            }
            {jsxEle}
        </IconButton>
        
    )
    
    )
    
}