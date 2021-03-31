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
    action: ['bpmn:SequenceFlow', '工具', 'iconfont zwpt_ljzj', '连接线']
}
//contextPad组件的元素 bpmn:TimerEventDefinition
const customShapeAction = [
    {
      type: 'create.intermediate-event',
      action: ['bpmn:IntermediateThrowEvent', '开始事件', 'bpmn-icon-intermediate-event-none', '计时器事件']
    },
    {
      type: 'create.message-event',
      action: ['bpmn:MessageEventDefinition', '开始事件', 'iconfont zwpt_xxsj', '消息事件']
    },
    {
      type: 'create.user-Task',
      action: ['bpmn:UserTask', '环节', 'icon-custom bpmn-icon-user', '用户环节']
    },
    {
      type: 'create.task',
      action: ['bpmn:Task', '环节', 'icon-custom bpmn-icon-task', '普通任务']
    },
    {
      type: 'create.businessRule-task',
      action: ['bpmn:BusinessRuleTask', '环节', 'icon-custom bpmn-icon-business-rule', 'businessRule任务']
    },
    //bpmn:ParallelGateway
    {
      type: 'create.inclusive-gateway',
      action: ['bpmn:InclusiveGateway', '分支', 'iconfont zwpt_brfz', '包容分支']
    },
   {
     type: 'create.parallel-gateway',
     action: ['bpmn:ParallelGateway', '分支', 'iconfont zwpt_bxfz', '并行分支']
   },
   {
    type: 'create.exclusive-gateway',
    action: ['bpmn:ExclusiveGateway', '分支', 'iconfont zwpt_ptfz', '排他分支']
   },
    //bpmn:EventBasedGateway
   {
     type: 'create.eventBasedGateway',
     action: ['bpmn:EventBasedGateway', '分支', 'iconfont zwpt_sjfz', '事件分支']
   },
    {
      type: 'create.end-event',
      action: ['bpmn:EndEvent', '结束事件', 'icon-custom bpmn-icon-end-event-none', '结束节点']
    },
    {
      type: 'create.dataObjectReference',
      action: ['bpmn:DataObjectReference', '自定义', 'icon-custom bpmn-icon-data-object', '变量']
    },
    {
      type: 'create.text-annotation',
      action: ['bpmn:TextAnnotation', '自定义', 'iconfont zwpt_wbzs', '注释']
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
  console.log(customs)
    return customs
}
export { customElements, customConfig, STATICPATH,hasLabelElements ,customShapeAction, customFlowAction}
