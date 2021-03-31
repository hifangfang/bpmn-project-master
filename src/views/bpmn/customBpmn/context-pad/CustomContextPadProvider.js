// 完全自定义ContextPad
import store from '../../../../store'
import {bus} from '../../../../utils/bus'
import {
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import { batchCreateCustom, customShapeAction, customFlowAction } from '../../../../utils/util'
import CustomContextPad from "./CustomContextPad";
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
        modeling,    //modeling引进来, 因为要使用到它的removeElements方法;
        bpmnFactory,
        connect
    } = this;

    var actions = {}
    var businessObject = element.businessObject

    // 击的时候实现删除功能
    function removeElement(e) {
        modeling.removeElements([element])
    }

    function startConnect(event, element) {
        debugger
        connect.start(event, element)
    }

    function clickElement(e) {
        // console.log(element)
        // store.commit('SETNODEINFO', element)
        // store.commit('TOGGLENODEVISIBLE', true)
    }
    function replaceElement(e) {
        bus.$emit('showDialog', element)
    }
    function createAction(type, group, className, title, options) {
        debugger
        function appendCustomElements(type) {
            return function(event, element) {
                if(element.type=="bpmn:SequenceFlow"){
                 element=element.source
                }
                debugger
                if (autoPlace) {
                    const businessObject = bpmnFactory.create(type)
                    if(type=="bpmn:TextAnnotation"){
                        businessObject.color = "red"
                    }
                    const shape = elementFactory.createShape(Object.assign({
                        type,
                        businessObject
                    }, options))
                    autoPlace.append(element, shape)
                    debugger
                    // modeling.connect(shape,element.target)
                    bus.$emit('connect', shape,element.target)
                } else {
                    appendCustomElementsStart(event, element)
                }
            }
        }

        function appendCustomElementsStart(type) {
            return function(event) {
                const businessObject = bpmnFactory.create(type)
                const shape = elementFactory.createShape(Object.assign({
                    type,
                    businessObject
                }, options))
                create.start(event, shape, element)
            }
        }
        return {
            group,
            className,
            title: translate(title),
            action: {
                click: appendCustomElements(type),
                dragstart: appendCustomElementsStart(type)
            }
        }
    }

    function createConnect(type, group, className, title, options) {
        return {
            group,
            className,
            title,
            action: {
                click: startConnect,
                dragstart: startConnect
            }
        }
    }

    function editElement() { // 创建编辑图标
        return {
            group: 'edit',
            className: 'icon-custom icon-custom-edit',
            title: translate('编辑'),
            action: {
                click: clickElement
            }
        }
    }
   // 创建垃圾桶-删除图标
    function deleteElement() {
        return {
            group: 'edit',
            className: 'icon-custom icon-custom-delete',
            title: translate('删除'),
            action: {
                click: removeElement
            }
        }
    }
    //
    // 创建修改组件类型图标
    function changeElement() {
        return {
            group: 'edit',
            className: 'icon-custom icon-replace',
            title: translate('修改组件类型'),
            action: {
                click: replaceElement
            }
        }
    }
    // 只有点击列表中的元素才会产生的元素
    const contextPadArr=[]

    if (isAny(businessObject,contextPadArr )) {
        Object.assign(actions, {
            ...batchCreateCustom(customShapeAction, createAction),
            ...batchCreateCustom(customFlowAction, createConnect), // 连接线
            // 'edit': editElement(),
            'change':changeElement(),
            'delete': deleteElement()
        })
        console.log(actions)
    }
    // 某些节点只有删除和编辑-结束节点和线只有删除和编辑
    const someArr= ['bpmn:EndEvent', 'bpmn:DataOutputAssociation','bpmn:TextAnnotation']
    if (isAny(businessObject,someArr)) {
        Object.assign(actions, {
            // 'edit': editElement(),
            'delete': deleteElement()  // 返回值加上删除的功能
        })
    }
    return actions
}

// ContextPadProvider.prototype._updateAndOpen = function(element) {
//
//     var entries = this.getEntries(element),
//         pad = this.getPad(element),
//         html = pad.html;
//
//     forEach(entries, function(entry, id) {
//         var grouping = entry.group || 'default',
//             control = domify(entry.html || '<div class="entry" draggable="true"></div>'),
//             container;
//
//         attr(control, 'data-action', id);
//
//         container = query('[data-group=' + grouping + ']', html);
//         if (!container) {
//             container = domify('<div class="group" data-group="' + grouping + '"></div>');
//             const arrowDown = 'el-icon-arrow-down'
//             const groupLabel = domify(
//                 `<div class="groupLabel"></i></i><i id="custom-palette-group-arrow" class="${arrowDown}"></i><span title="${grouping}">${grouping}</span></div></div>`
//             )
//
//             groupLabel.addEventListener('click', function () {
//                 const iconArrowDown = this.querySelector('.el-icon-arrow-down')
//                 const iconArrowLeft = this.querySelector('.el-icon-arrow-left')
//                 if (iconArrowDown) {
//                     // const isArrowDown = Array.from(iconArrowDown).includes('el-icon-arrow-down')
//                     iconArrowDown.classList = ['el-icon-arrow-left']
//                     const entry = this.parentNode.querySelectorAll('.entry')
//                     forEach(entry, function (it) {
//                         it.style.display = 'none'
//                     })
//                 }
//                 if (iconArrowLeft) {
//                     iconArrowLeft.classList = ['el-icon-arrow-down']
//                     const entry = this.parentNode.querySelectorAll('.entry')
//                     forEach(entry, function (it) {
//                         it.style.display = 'block'
//                     })
//                 }
//             })
//
//             container.appendChild(groupLabel)
//             html.appendChild(container);
//         }
//
//         container.appendChild(control);
//
//         if (entry.className) {
//             addClasses(control, entry.className);
//         }
//
//         if (entry.title) {
//             attr(control, 'title', entry.title);
//         }
//
//         if (entry.imageUrl) {
//             control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
//         }
//     });
//
//     classes(html).add('open');
//
//     this._current = {
//         element: element,
//         pad: pad,
//         entries: entries
//     };
//
//     this._eventBus.fire('contextPad.open', { current: this._current });
// };
//
// function addClasses(element, classNames) {
//
//     var classes$1 = classes(element);
//
//     var actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g);
//     actualClassNames.forEach(function(cls) {
//         classes$1.add(cls);
//     });
// }
