const customElements = [] ;// render自定义元素的类型
const STATICPATH = 'http://192.168.11.78:19058/gisquest-model-designer/editor-app/stencilsets/bpmn2.0/icons/' ;// 静态文件路径
const customConfig = { // 自定义元素的配置
    'bpmn:StartEvent': {
        'url':STATICPATH+'startevent/none.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    },
    'bpmn:UserTask': {
        'url':STATICPATH+'startevent/none.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    },
    'bpmn:EndEvent': {
        'url':STATICPATH+'activity/list/type.user.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    },
    'bpmn:Task': {
        'url':STATICPATH+'activity/event.subprocess.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    },
    'bpmn:ExclusiveGateway': {
        'url':STATICPATH+'gateway/inclusive.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    },
    'bpmn:DataObjectReference': {
        'url':STATICPATH+'catching/error.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    },
    'bpmn:IntermediateThrowEvent':{
        'url':STATICPATH+'catching/error.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    },
    'bpmn:Expression':{
        'url':STATICPATH+'catching/message.png',
        'attr': { x: 0, y: 0, width: 30, height: 30 }
    }
}
// 一开始就有label标签的元素类型
// const hasLabelElements = []
const hasLabelElements = ['bpmn:StartEvent','bpmn:EndEvent','bpmn:Task','bpmn:ExclusiveGateway','bpmn:DataObjectReference','bpmn:IntermediateThrowEvent'];
//顺序流
const flowAction = {
    type: 'global-connect-tool',
    action: ['bpmn:SequenceFlow', 'tools', 'icon-custom icon-custom-flow', '连接线']
}
//contextPad组件的元素
const customShapeAction = [{
    type: 'create.start-StartEvent',
    action: ['bpmn:UserTask', 'event', 'icon-custom icon-custom-usertask', '用户环节']
    },
    {
        type: 'create.inclusive-gateway',
        action: ['bpmn:ExclusiveGateway', 'activity', 'icon-custom icon-custom-inclusive-gateway', '包容分支']
    },
    {
        type: 'create.end-event',
        action: ['bpmn:EndEvent', 'event', 'icon-custom icon-custom-end', '结束节点']
    },
    {
        type: 'create.task',
        action: ['bpmn:Task', 'activity', 'icon-custom icon-custom-task', '普通任务']
    },
    {
        type: 'create.businessRule-task',
        action: ['bpmn:BusinessRuleTask', 'activity', 'icon-custom icon-custom-businessRule', 'businessRule任务']
    },
    {
        type: 'create.dataObjectReference',
        action: ['bpmn:DataObjectReference', 'activity', 'icon-custom icon-custom-data', '变量']
    },
    {
        type: 'create.text-annotation',
        action: ['bpmn:TextAnnotation', 'model', 'icon-custom green-text-annotation', '注释']
    },

]
const customFlowAction = [
    flowAction
]
/**
 * 循环创建出一系列的元素
 * @param {Array} actions 元素集合
 * @param {Object} fn 处理的函数
 */
export function batchCreateCustom(actions, fn) {
    const customs = {}
    actions.forEach(item => {
        customs[item['type']] = fn(...item['action'])
    })
    return customs
}
export { customElements, customConfig, STATICPATH,hasLabelElements ,customShapeAction, customFlowAction}
