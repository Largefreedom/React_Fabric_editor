import { IconButton } from "blocksin-system";
import { TextIcon } from "sebikostudio-icons";
import { useEffect,useState } from "react";
import { fabric } from "fabric";


export default function TextInput({canvas}){
    
    const onTextInput = () =>{
        
        const iText = new fabric.IText("Text 输入文字",{
            fontSize: 25,
            fontFamily:'sans-serif',
            fontStyle: 'italic',
            stroke: "white",
            fill: "red",
            fontWeight: "600"
        });
        canvas.centerObject(iText)
        canvas.add(iText);
        canvas.renderAll();
        
    }

    return (
        <IconButton  variant="ghost" onClick={onTextInput}>
            <TextIcon></TextIcon>
        </IconButton>
    )
}