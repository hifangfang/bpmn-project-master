
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil'

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';
import { customElements, customConfig, hasLabelElements } from '../../../../utils/util'

const HIGH_PRIORITY = 1500
const TASK_BORDER_RADIUS = 2
console.log(BaseRenderer)
export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, modeling) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
        this.modeling = modeling;
    }
    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }
    drawShape(parentNode, element) {
        debugger
        console.log(parentNode,element)
        // 所有节点都会走这个函数，所以此时只限制，需要自定义的才去自定义，否则仍显示bpmn默认图标
        const type = element.type;
        if (customElements.includes(type)) { // or customConfig[type]
            const { url, attr } = customConfig[type]
            const customIcon = svgCreate('image', {
                ...attr,
                href: url,
            })
            element['width'] = attr.width // 这里我是取了巧, 直接修改了元素的宽高
            element['height'] = attr.height
            svgAppend(parentNode, customIcon)
            const someArr= ['bpmn:EndEvent', 'bpmn:DataOutputAssociation','bpmn:TextAnnotation']
            const isAddIcon=someArr.some(item=>item==type)
            if(!isAddIcon){
                //每根线节点添加一个图标
                if(type=="bpmn:StartEvent"){
                    const addIcon=svgCreate('image', {
                        x: attr.x+attr.width*0.2,
                        y: attr.y + attr.height +40,
                        width:20,
                        height:20,
                        href: require("../../../../assets/images/add-link.png"),
                        parentNode:parentNode,
                        class:element.id

                    })
                    svgAppend(parentNode, addIcon)
                }
                // else{
                //     const addIcon=svgCreate('image', {
                //         x: attr.x+0.35*attr.width,
                //         y: attr.y + attr.height +50,
                //         width:20,
                //         height:20,
                //         href: require("../../../../assets/images/add-link.png"),
                //         parentNode:parentNode,
                //         class:element.id,
                //     })
                //     svgAppend(parentNode, addIcon)
                // }
            }


            if (!hasLabelElements.includes(type) && element.businessObject.name) {
                const text = svgCreate('text', {
                    x: attr.x,
                    y: attr.y + attr.height +20,
                    "font-size": "14",
                    "fill": "#000",
                    "text":"center",
                })
                text.innerHTML = element.businessObject.name
                svgAppend(parentNode, text)
            }
            debugger
            return customIcon
        }

        // const shape = this.bpmnRenderer.drawShape(parentNode, element)
        // return shape
    }
}
// if（element.type===‘XX’）{element.width=X}
CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'modeling'];
