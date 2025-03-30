import { fabric } from "fabric";

const snappingDistance = 20;

export const handleObjectMoving = (canvas,obj,guidelins,setGuildelins) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const left = obj.left;
    const top = obj.top;
    const centerX = left + obj.width * obj.scaleX/2;
    const centerY = top + obj.height * obj.scaleY/2;
    let newGuidelines = [];
    clearGuidelins(canvas);
    let snapped = false;
    if(Math.abs(centerX - canvasWidth/2)<snappingDistance){
        // obj.set({left:0})
        if(!guidelineExists(canvas,"vertical-right")){
            // 是否存在
            const line = createVerticalGuideLine(
                canvas,
                canvasWidth/2,
                "vertical-right"
            );
            newGuidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }
    
    if(Math.abs(centerY-canvasHeight/2) <snappingDistance){
        // obj.set({top:canvasHeight/2 -obj.height*obj.scaleY/2});
        if(!guidelineExists(canvas,"horizontal-bottom")){
            const line = createHorizontalGuideLine(
                canvas,
                canvasHeight/2,
                "horizontal-bottom"
            );
            newGuidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }
    
    if(!snapped){
        clearGuidelins(canvas);
    }else{
        setGuildelins(newGuidelines);
    }
    canvas.renderAll();

}

export const createVerticalGuideLine = (canvas,x,id) => {
    return new fabric.Line(
        [x,0,x,canvas.height],{
            id,
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
            strokeDashArray: [5,5],
            opacity: 0.8
        });
}

export const createHorizontalGuideLine = (canvas,y,id) => {
    return new fabric.Line(
        [0,y,canvas.width,y],{
            id,
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
            strokeDashArray: [5,5],
            opacity: 0.8
        });
}

export const clearGuidelins = (canvas) => {
    const objects = canvas.getObjects("line");
    objects.forEach((obj) => {
        if((obj.id && obj.id.startsWith("vertical-"))
        || obj.id.startsWith("horizontal-")
        ){
            // 移出该元素
            canvas.remove(obj);
        }
    });
    canvas.renderAll();
}

const guidelineExists = (canvas,id) => {
    const objs = canvas.getObjects("line");
    return objs.some((obj) => obj.id === id);
}