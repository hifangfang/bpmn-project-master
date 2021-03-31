<template>
  <div class="index">
    <div class="headerNav">
      <div class="header">
        <div class="header-logo"></div>
        <span>工作流设计器</span>
      </div>
      <div class="tool">
        <el-tooltip class="item" effect="dark" content="保存XML" placement="bottom">
          <i @click="saveXML" class="iconfont zwpt_save"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导入XML" placement="bottom">
          <i @click="$refs.refFile.click()" class="iconfont zwpt_shujuluru"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="保存SVG" placement="bottom">
          <i @click="saveSVG" class="iconfont zwpt_complete"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="撤销" placement="bottom">
          <i @click="handlerUndo" class="el-icon-back"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="恢复" placement="bottom">
          <i @click="handlerRedo" class="el-icon-right"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
          <i @click="handlerZoom(0.1)" class="el-icon-circle-plus"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="bottom">
          <i @click="handlerZoom(-0.1)" class="el-icon-remove"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="还原" placement="bottom">
          <i @click="handlerZoom(0)" class="el-icon-refresh"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="获取所有元素" placement="bottom">
          <i @click="getElementAll" class="el-icon-s-data"></i>
        </el-tooltip>
        <input type="file"
               id="files"
               ref="refFile"
               style="display: none"
               @change="loadXML" />
      </div>
    </div>
    <div class="bpmn">
      <!--左侧-->
      <!--<div ref="palette"></div>-->
      <processAttribute ref="processAttribute" :bpmnModeler="bpmnModeler"></processAttribute>
      <!--内容-->
      <div class="canvas" ref="canvas" id="canvas">

          <div class="resize-top">
            <span> <i class="el-icon-arrow-up"></i><i @click="toBottom" class="el-icon-arrow-down"></i></span>
          </div>
        <div class="resize-right">
          <span> <i class="el-icon-arrow-right"></i><i class="el-icon-arrow-left"></i></span>
        </div>
        <div class="resize-bottom">
          <span> <i class="el-icon-arrow-down"></i><i class="el-icon-arrow-up"></i></span>
        </div>
        <div class="resize-left">
          <span> <i class="el-icon-arrow-left"></i><i class="el-icon-arrow-right"></i></span>
        </div>
      </div>
      <!--右侧属性-->
      <!--<div id="js-properties-panel" class="panel"></div>-->
      <ProcessPanel v-if="bpmnModeler" :bpmnModeler="bpmnModeler" prefix="activiti" class="process-panel"></ProcessPanel>
      <!--修改组件类型弹框-->
      <ModifyTypeDialog ref="ModifyTypeDialog" :modeler="bpmnModeler"></ModifyTypeDialog>
      <contextPad ref="contextPad"></contextPad>
    </div>

  </div>
</template>

<script>
// 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
import customPalette from './customBpmn/palette'
import customRenderer from './customBpmn/renderer'
import contextPadProvider from './customBpmn/context-pad'
import activitiModdleDescriptor from './config/activitiDescriptor.json'
import qaPackage from './config/qaPackage.json'
import {xmlStr} from './xmlData' // 这里是直接引用了xml字符串
// 将字符串转换成图显示出来
// let xmlString = xml || DefaultEmptyXML(new Date().getTime(), "测试流程");
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
} from 'tiny-svg'
import { query as domQuery } from 'min-dom'
import ProcessPanel from "@/components/process-panel/ProcessPanel";
import ModifyTypeDialog from '../../components/modify-type-dialog'
import {bus} from '../../utils/bus'
import contextPad from "../..//components/contextPad"
import processAttribute from "../../components/process-attribute-form"
import { customElements, customConfig, hasLabelElements } from '../../utils/util'
export default {
  name: 'Bpmn',
  data () {
    return {
      bpmnModeler: null,
      container: null,
      canvas: null,
      scale: 1,
      xml: ''
    }
  },
    components:{
        ModifyTypeDialog,
        ProcessPanel,
        contextPad,
        processAttribute
    },
  mounted () {
      //监听关闭
      // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    this.$nextTick(() => {
      this.init()
       // 修改组件类型
      const  _this=this
      bus.$on('showDialog', function (msg) {
          _this.$refs.ModifyTypeDialog.show(msg)
      })
        // bus.$on('connect', function (source,target) {
        //     _this.connectElement(source,target)
        // })
        bus.$on('create', function (value,element) {
            debugger
            console.log(value)
            const obj={
                type: value.type,
                x:element.x+100,
                y:element.y
            }
            debugger
            _this.createElement(obj,element)
        })

        this.initEvent()
    })

  },
  methods: {
      beforeunloadHandler (e) {
          e = e || window.event
          if (e) {
              e.returnValue = '关闭提示'
          }
          return '关闭提示'
      },
    async init () {
      // 去除默认工具栏
      const modules = BpmnModeler.prototype._modules
      const index = modules.findIndex(it => it.paletteProvider)
      modules.splice(index, 1)
      const canvas = this.$refs.canvas
      const palette = this.$refs.palette
      // 建模
      this.bpmnModeler = new BpmnModeler({
        // 主要容器
        container: canvas,
        // 工具栏容器
        paletteContainer: palette,
        // 工具栏配置及实现自定义渲染方法
        // 开启键盘快捷
        keyboard: {
          bindTo: document
        },
        // 添加自定义元模型
        moddleExtensions: {
            activiti: activitiModdleDescriptor,
            qa: qaPackage
        },
        // 扩展
        additionalModules: [
          customPalette,
          // 自定义渲染
          customRenderer,
          // 自定义内容面板
         contextPadProvider,
          {
            // // 禁用滚轮滚动
            zoomScroll: ['value', ''],
          },
        ]
      })
      // 初始化 流程图
      await this.createNewDiagram();
      // // 调整与正中间
      await this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')

      await this.getProcessAttribute()
    },
    createNewDiagram () {
        // 将字符串转换成图显示出来
        let xmlString = xmlStr;
        this.bpmnModeler.importXML(xmlString)
    },
      // 获取流程属性
      getProcessAttribute(){
          const process = this.bpmnModeler.get('elementRegistry').getAll()
          const element =process[0]
          this.$refs.processAttribute.initData(element)
      },
      // 绑定事件
      initEvent () {
          this.getEventBusAll()  //查看所有可用事件
          const eventBus = this.bpmnModeler.get('eventBus')
          const eventTypes = ['element.click', 'element.changed'] // 需要监听的事件集合
          eventTypes.forEach(function(eventType) {
              eventBus.on(eventType, function(e) {
                  if (!e || e.element.type == 'bpmn:Process') return // 这里我的根元素是bpmn:Process


              })
          })
      },
    // 初始化自定义箭头
    initArrow (id) {
      const g=document.getElementsByTagName("svg")
      const marker = svgCreate('marker')
      svgAttr(marker, {
        id,
        viewBox: '0 0 20 20',
        refX: '11',
        refY: '10',
        markerWidth: '10',
        markerHeight: '10',
        orient: 'auto'
      })
      const path = svgCreate('path')
      svgAttr(path, {
        d: 'M 1 5 L 11 10 L 1 15 Z',
        style:
          ' stroke-width: 0px; stroke-linecap: round; stroke-dasharray: 10000, 1; '
      })

      const defs = domQuery('defs')
      svgAppend(marker, path)
      svgAppend(defs, marker)
    },

    async saveXML () {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true })
        const { xml } = result

        const xmlBlob = new Blob([xml], {
          type: 'application/bpmn20-xml;charset=UTF-8,'
        })

        const downloadLink = document.createElement('a')
        downloadLink.download = `bpmn-${+new Date()}.bpmn`
        downloadLink.innerHTML = 'Get BPMN SVG'
        downloadLink.href = window.URL.createObjectURL(xmlBlob)
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        }
        downloadLink.style.visibility = 'hidden'
        document.body.appendChild(downloadLink)
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    },

    async saveSVG () {
      try {
        const result = await this.bpmnModeler.saveSVG()
        const { svg } = result

        const svgBlob = new Blob([svg], {
          type: 'image/svg+xml'
        })

        const downloadLink = document.createElement('a')
        downloadLink.download = `bpmn-${+new Date()}.SVG`
        downloadLink.innerHTML = 'Get BPMN SVG'
        downloadLink.href = window.URL.createObjectURL(svgBlob)
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        }
        downloadLink.style.visibility = 'hidden'
        document.body.appendChild(downloadLink)
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    },

    async loadXML () {
      const that = this
      const file = this.$refs.refFile.files[0]

      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function () {
        that.xmlStr = this.result
        that.createNewDiagram()
      }
    },
    handlerRedo () {
      this.bpmnModeler.get('commandStack').redo()
    },
    handlerUndo () {
      this.bpmnModeler.get('commandStack').undo()
    },

    handlerZoom (radio) {
      const newScale = !radio ? 1.0 : this.scale + radio
      this.bpmnModeler.get('canvas').zoom(newScale)

      this.scale = newScale
    },

    // 获取所有元素
    getElementAll () {
      const all = this.bpmnModeler.get('elementRegistry').getAll()
      console.log('all', all)
      return all
    },
    // 根据 id 获取元素
    getElementById (id) {
      return this.bpmnModeler.get('elementRegistry').get(id)
    },

    // 创建 业务对象 business objects
    createBusinessElement () {
      const bpmnFactory = this.bpmnModeler.get('bpmnFactory')
      const taskBusinessObject = bpmnFactory.create('bpmn:Task')
        console.log(taskBusinessObject)

      // 使用刚创建的业务对象创建新的图表形状
      const task = this.createElement({
        type: 'bpmn:Task',
        businessObject: taskBusinessObject
      })
        console.log(task)
      return task
    },

    // 新增元素
    createElement (elementConfig,element) {
          debugger
        const elementFactory = this.bpmnModeler.get('elementFactory')
        const elementRegistry = this.bpmnModeler.get('elementRegistry')
        const modeling = this.bpmnModeler.get('modeling');
        const processId=elementRegistry.getAll()[0].id
        const process = elementRegistry.get(processId)
        const startEvent = elementRegistry.get(element.id);
        // const targetEvent = elementRegistry.get(element.target.id);
        const task = elementFactory.createShape(elementConfig)

        // (4) 将新 task 添加到图中
        modeling.createShape(task, { x: element.x+15, y: element.y+100 }, process);
        // (5) 连线
        // const currentEvent= elementRegistry.get(task.id)
        modeling.connect(startEvent, task);
        // modeling.connect(currentEvent, targetEvent);
        //隐藏弹框
        this.$bus.$emit("hiddenContext")
    },

    // 添加元素
    appendElement (parentsElement, newElement, location = { x: 400, y: 100 }) {
      const modeling = this.bpmnModeler.get('modeling')
      modeling.createShape(newElement, location, parentsElement)
      // modeling.createShape(newElement, location, parentsElement, { attach: true })
    },

    // 连线
    connectElement (sourceElement, targetElement) {
          debugger
      const modeling = this.bpmnModeler.get('modeling')
      modeling.connect(sourceElement, targetElement)
    },

    // 添加元素并连线
    appendConnect (
      sourceElement,
      targetElement,
      location = { x: 400, y: 100 },
      parentsElement
    ) {
      const modeling = this.bpmnModeler.get('modeling')
      modeling.appendShape(
        sourceElement,
        targetElement,
        location,
        parentsElement
      )
    },

    // 查看所有可用事件
    getEventBusAll () {
      const eventBus = this.bpmnModeler.get('eventBus')
      const eventTypes = Object.keys(eventBus._listeners)
      console.log(eventTypes) // 打印出来有242种事件
      return eventTypes
    },

    // 更新属性
    updateAttr (id, AttrObj = {}) {
      const element = this.getElementById(id)
      const modeling = this.bpmnModeler.get('modeling')
      modeling.updateProperties(element, AttrObj)
    },
      handleOk() {
          let extensionElements = this.element.businessObject.get('extensionElements')
          if (!extensionElements) {
              extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
          }
          //清除旧值
          extensionElements.values = extensionElements.values
              ? extensionElements.values.filter((item) => item.$type !== 'flowable:ExecutionListener')
              : []
          this.dataSource.forEach((item) => {
              const executionListener = this.modeler.get('moddle').create('flowable:ExecutionListener')
              executionListener['event'] = item.event
              console.log(item)
              item.type == 'className' && (executionListener['class'] = item.javaClassName)
              item.type == 'expression' && (executionListener['expression'] = item.javaClassName)
              item.type == 'delegateExpression' && (executionListener['delegateExpression'] = item.javaClassName)

              if (item.fieldDataSource && item.fieldDataSource.length) {
                  item.fieldDataSource.forEach((field) => {
                      const fieldElement = this.modeler.get('moddle').create('flowable:Field')
                      fieldElement['name'] = field.field
                      // fieldElement[field.type] = field.value
                      // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
                      const valueElement = this.modeler
                          .get('moddle')
                          .create(`flowable:${field.type}`, { body: `<![CDATA[${field.value}]]>` })
                      fieldElement[field.type] = valueElement
                      executionListener.get('fields').push(fieldElement)
                  })
              }

              extensionElements.get('values').push(executionListener)
          })

          // console.log(extensionElements)
          this.updateProperties({ extensionElements: extensionElements })
          // console.log(this.element)
          console.log(this.dataSource)
          // console.log(this.listener)
      },
      toBottom(){
        debugger
        const canvas=document.getElementById("canvas").getElementsByClassName("djs-container")[0].getElementsByTagName('svg')[0]
          canvas.style.width=canvas.width.animVal.value-100
          canvas.style.height=canvas.height.animVal.value-100
          console.log(canvas.height.animVal.value,canvas.width.animVal.value)
          const djsContainer=document.getElementById("canvas").getElementsByClassName("djs-container")[0]
          djsContainer.scrollTop=djsContainer.scrollTop+100
          console.log(djsContainer)
      },
  },

    destroyed () {
        window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    },
}
</script>

<style lang="less">
  @import "../../assets/css/index";
  @import "../../assets/css/process-panel";
  .matrix{

  }

</style>
