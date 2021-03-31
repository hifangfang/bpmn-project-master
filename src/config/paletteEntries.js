import { assign } from 'min-dash'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

export default {
  'create.customtask': createAction(
    'bpmn:StartEvent', // etl.json 定义
    '开始事件',
    'zwpt_kssj iconfont',
    '开始事件',
    'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/startevent/none.png',
  ),
    // 用户任务节点
  'create.start-StartEvent': createAction(
    'bpmn:UserTask',
    '环节',
    'zwpt_yhhj iconfont',
    '用户环节',
    'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/activity/list/type.user.png'
  ),
    // 通过引擎可识别的脚本语言来进行自动化操作
  'create.end-event': createAction(
    'bpmn:ScriptTask',
    '环节',
    'zwpt_tjhj iconfont',
    '退件环节',
    'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/activity/list/type.user.png'

),
  // 子流程
  'create.task': createAction(
    'bpmn:SubProcess',
    '子流程',
    'zwpt_sjzlc iconfont',
    '事件子流程',
    'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/activity/event.subprocess.png'
    // drawTask
  ),
  //  排他网关
  'create.inclusive-gateway': createAction(
    'bpmn:InclusiveGateway',
    '分支',
    'zwpt_brfz iconfont',
    '包容分支',
      'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/gateway/inclusive.png'
  ),
  'create.intermediate-event': createAction(
    'bpmn:IntermediateThrowEvent',
    '边界事件',
    'zwpt_bjcwsj iconfont',
    '边界错误事件',
    'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/catching/error.png'
  ),
    'create.prticipant': createAction(
        'bpmn:Participant',
        '泳道',
        'zwpt_yd_tit iconfont',
        '泳道',
        // 'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/catching/message.png'
    ),
//        {
//         type: 'create.loop-cardinality',
//         action: ['bpmn:Expression', 'model', 'icon-custom green-text-annotation', '循环']
//     },
}


function createAction (
  type,
  group,
  className,
  title,
  imageUrl = '',
  drawShape,
  translate,
  options
) {
  var shortType = type.replace(/^bpmn:/, '')

  function createListener (event, autoActivate, elementFactory, create) {
    var shape = elementFactory.createShape(assign({ type: type }, options))

    if (options) {
      shape.businessObject.di.isExpanded = options.isExpanded
    }

    // TODO: 自定义元模型 需要 实现 createText
    // shape.businessObject.name = type

    create.start(event, shape)
  }
    const config = {
        type, // 📌 渲染的时候需要判断
        group: group,
        className: className,
        title: title,
        drawShape: drawShape, // 📌
        action: {
            dragstart: createListener,
            click: createListener
        }
    }
    if (imageUrl) {
        assign(config, {
            imageUrl
        })
    }
    if (drawShape) {
        assign(config, {
            drawShape
        })
    }

    return config
}

function drawCustomTask (parentNode, element, textRenderer, entries) {
  const width = 130
  const height = 60
  const borderRadius = 20
  const strokeColor = '#4483ec'
  const fillColor = !element.businessObject.suitable && '#a2c5fd'

  element.width = width
  element.height = height
  const rect = drawRect(
    parentNode,
    width,
    height,
    borderRadius,
    strokeColor,
    fillColor
  )
  const text = textRenderer.createText(element.businessObject.name || '', {
    box: element,
    align: 'center-middle',
    padding: 5,
    size: {
      width: 100
    }
  })
  svgAppend(parentNode, text)
  return rect
}

function drawTask (parentNode, element, textRenderer, entries) {
  const width = 100
  const height = 80
  const borderRadius = 20
  const strokeColor = element.businessObject.suitable
  const fillColor = '#fff'

  element.width = width
  element.height = height
  const rect = drawRect(
    parentNode,
    width,
    height,
    borderRadius,
    strokeColor,
    fillColor
  )
  const text = textRenderer.createText(element.businessObject.name || '', {
    box: element,
    align: 'center-middle',
    padding: 5,
    size: {
      width: 100
    }
  })
  svgAppend(parentNode, text)
  return rect
}

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect (
  parentNode,
  width,
  height,
  borderRadius,
  strokeColor,
  fillColor
) {
  const rect = svgCreate('rect')

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#000',
    strokeWidth: 2,
    fill: fillColor
  })

  svgAppend(parentNode, rect)

  return rect
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
// function prependTo (newNode, parentNode, siblingNode) {
//   parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild)
// }
