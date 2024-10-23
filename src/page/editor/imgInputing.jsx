import React from "react";
import { useEffect,useRef,useState } from "react";
import {IconButton} from "blocksin-system";
import { ImageIcon } from "sebikostudio-icons";
import { fabric } from "fabric";



export default function ImgInputing({canvas}){
    const inputFile = useRef(null);
    
    const onImgInputClick = () => {
        inputFile.current.click();
        console.log('canvas',canvas)
    }

    const onChangeFile = (e) => {
        // event.stopPropagation();
        // event.preventDefault();
        var reader = new FileReader();
        reader.onload = function (event){
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function (ev) {
            var image = new fabric.Image(imgObj);
            image.set({
                    angle:0,
                    top:100,
                    left:100,
            });
            image.scaleToWidth(200);
            canvas.centerObject(image)
            canvas.add(image);
            canvas.renderAll();
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }




    return (
     <div className="FrameComponent">
        <IconButton variant="ghost" onClick={onImgInputClick}>
            <ImageIcon></ImageIcon>
            <input type='file' id='file'
            onChange={onChangeFile} 
            ref={inputFile} style={{display: 'none'}}/>
        </IconButton>
        
     </div>   
    )
}