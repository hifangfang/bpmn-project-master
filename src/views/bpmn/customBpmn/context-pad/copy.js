import store from '../../../../store'
export default function ContextPadProvider(contextPad, config, injector, translate, bpmnFactory, elementFactory, create, modeling, connect) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    this.bpmnFactory = bpmnFactory
    this.modeling = modeling
    this.connect = connect
    config = config || {}
    if (config.autoPlace !== false) {
        this.autoPlace = injector.get('autoPlace', false);
    }
    contextPad.registerProvider(this)
}

ContextPadProvider.$inject = [
    'contextPad',
    'config',
    'injector',
    'translate',
    'bpmnFactory',
    'elementFactory',
    'create',
    'modeling',
    'connect'
]

ContextPadProvider.prototype.getContextPadEntries = function(element) {
    const {
        autoPlace,
        create,
        elementFactory,
        translate,
        modeling,
        globalConnect
    } = this;
    // 删除功能
    function removeElement(e) {
        modeling.removeElements([element])
    }
    //连线
    function linkElement(event) {
        globalConnect.toggle(event)
    }
    function clickElement(e) {
        console.log(element)
        // window.localStorage.setItem('nodeInfo', JSON.stringify(element))
        // window.localStorage.setItem('nodeVisible', 'true')
        store.commit('SETNODEINFO', element)
        store.commit('TOGGLENODEVISIBLE', true)
    }

    function appendTask(event, element) {
        console.log(autoPlace)
        if (autoPlace) {
            const shape = elementFactory.createShape({ type: 'bpmn:StartEvent' });
            autoPlace.append(element, shape);
        } else {
            appendTaskStart(event, element);
        }
    }

    function appendTaskStart(event) {
        console.log(event)
        const shape = elementFactory.createShape({ type: 'bpmn:StartEvent' });
        create.start(event, shape, element);
    }

    function deleteElement() {
        return {
            group: 'edit',
            className: 'icon-custom icon-delete',
            title: translate('删除'),
            action: {
                click: removeElement
            }
        }
    }
    function createConnect () {
        return {
            group: 'tools',
            className: 'icon-custom icon-link',
            title: '新增线',
            action: {
                click: linkElement
            }
        }
    }
    return {
        // 'append.lindaidai-task': {
        //     group: 'model',
        //     className: 'icon-custom icon-start',
        //     title: translate('创建一个类型为bpmn:StartEvent的任务节点'),
        //     action: {
        //         click: appendTask,
        //         dragstart: appendTaskStart
        //     }
        // },
        // 'delete': deleteElement(),
        // 'global-connect-tool': createConnect()
    }
}
