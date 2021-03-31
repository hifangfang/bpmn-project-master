<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <headerNav ref="headerNav" :parent="this"></headerNav>
      <!-- 用于打开本地文件-->
      <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn" @change="importLocalFile" />
    </div>
    <div class="my-process-designer__container">
      <!--左侧工具栏-->
      <!--<div ref="palette"></div>-->
      <!--流程属性-->
      <processAttributeForm ref="processAttribute" :bpmnModeler="bpmnModeler" :prefix="prefix"></processAttributeForm>
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
      <!--<my-process-panel :bpmn-modeler="bpmnModeler" prefix="camunda" class="process-panel" />-->
    </div>
    <el-dialog title="预览" width="60%" :visible.sync="previewModelVisible" append-to-body destroy-on-close>
      <highlightjs :language="previewType" :code="previewResult" />
    </el-dialog>
    <!--修改组件类型弹框-->
    <ModifyTypeDialog ref="ModifyTypeDialog" :modeler="bpmnModeler"></ModifyTypeDialog>
  </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import {DefaultEmptyXML} from "./plugins/defaultEmpty.ts";
// 翻译方法
import customTranslate from "./plugins/translate/customTranslate";
import translationsCN from "./plugins/translate/zh";
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import camundaModdleDescriptor from "./plugins/descriptor/camundaDescriptor.json";
import activitiModdleDescriptor from "./plugins/descriptor/activitiDescriptor.json";
import flowableModdleDescriptor from "./plugins/descriptor/flowableDescriptor.json";
// 标签解析 Extension
import camundaModdleExtension from "./plugins/extension-moddle/camunda";
import activitiModdleExtension from "./plugins/extension-moddle/activiti";
import flowableModdleExtension from "./plugins/extension-moddle/flowable";
// 引入json转换与高亮
import convert from "xml-js";
import hljs from "highlight.js";
import Vue from "vue";
Vue.use(hljs.vuePlugin);
import "highlight.js/styles/atom-one-dark-reasonable.css";
import MyProcessPanel from "../process-panel/ProcessPanel";
import customPalette from './plugins/palette'
import factory from './plugins/factory'
import entries from '../../src/config/paletteEntries'
import processAttributeForm from "../../src/components/processAttribute"
import headerNav from "../../src/components/headerNav"
import ContextPad from './plugins/context-pad'
import ModifyTypeDialog from '../../src/components/modifyTypeDialog'
// import {ProcessModelApi} from '../../model/ProcessModel-Api'
export default {
  name: "MyProcessDesigner",
  componentName: "MyProcessDesigner",
  props: {
    value: String, // xml 字符串
    translations: Object, // 自定义的翻译文件
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: String,
      default: "activiti"
    },
    events: {
      type: Array,
      default: () => ["element.click"]
    },
    headerButtonSize: {
      type: String,
      default: "small",
      validator: value => ["default", "medium", "small", "mini"].indexOf(value) !== -1
    },
    headerButtonType: {
      type: String,
      default: "primary",
      validator: value => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1
    }
  },
  data() {
    return {
      currentScale: "100%",
      defaultZoom: 1,
      previewModelVisible: false,
      previewResult: "",
      previewType: "xml",
      recoverable: false,
      revocable: false,
      bpmnModeler:null,
    };
  },
    components:{
        headerNav,
        MyProcessPanel,
        processAttributeForm,
        ModifyTypeDialog

    },
  computed: {
    additionalModules() {
      const Modules = [
        //自定义工厂函数，主要是id生成规则
        factory,
        //自定义工具内容面板
        ContextPad,
          {
          // // 禁用滚轮滚动
          zoomScroll: ['value', ''],
          }
          ];
      // 仅保留用户自定义扩展模块
      if (this.onlyCustomizeAddi) {
        if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
          return this.additionalModel || [];
        }
        return [this.additionalModel];
      }

      // 插入用户自定义扩展模块
      if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
        Modules.push(...this.additionalModel);
      } else {
        this.additionalModel && Modules.push(this.additionalModel);
      }
      // 翻译模块
      const TranslateModule = {
        translate: ["value", customTranslate(this.translations || translationsCN)]
      };
      Modules.push(TranslateModule);

      // 根据需要的流程类型设置侧边栏构建器
      // if (this.prefix === "bpmn") {
      //   Modules.push(bpmnModdleExtension);
      // }
      if (this.prefix === "camunda") {
        Modules.push(camundaModdleExtension);
      }
      if (this.prefix === "flowable") {
        Modules.push(flowableModdleExtension);
      }
      if (this.prefix === "activiti") {
        Modules.push(activitiModdleExtension);
      }

      return Modules;
    },
    moddleExtensions() {
      const Extensions = {};
      // 仅使用用户自定义模块
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null;
      }

      // 插入用户自定义模块
      if (this.moddleExtension) {
        for (let key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key];
        }
      }

      // 根据需要的 "流程类型" 设置 对应的解析文件
      if (this.prefix === "activiti") {
        Extensions.activiti = activitiModdleDescriptor;
      }
      if (this.prefix === "flowable") {
        Extensions.flowable = flowableModdleDescriptor;
      }
      if (this.prefix === "camunda") {
        Extensions.camunda = camundaModdleDescriptor;
      }
      return Extensions;
    }
  },
  async mounted() {
    await this.initBpmnModeler();
    await this.createNewDiagram(this.value);
    await this.getProcessAttribute()
    this.$once("hook:beforeDestroy", () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit("destroy", this.bpmnModeler);
      this.bpmnModeler = null;
    });
    const _this=this
    this.$bus.$on('create', function (value,element) {
        const obj={
            type: value.type,
            x:element.x+100,
            y:element.y,
            width:value.width,
            height:value.height

        }
        debugger
        _this.createElement(obj,element)
    })
    // 修改组件类型
    this.$bus.$on('showDialog', function (msg) {
      debugger
      _this.$refs.ModifyTypeDialog.show(msg)
    })
  },
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return;
      // 去除默认工具栏
      const modules = BpmnModeler.prototype._modules
      const index = modules.findIndex(it => it.paletteProvider)
      modules.splice(index, 1)
      this.bpmnModeler = new BpmnModeler({
          // 主要容器
        container: this.$refs["bpmn-canvas"],
          // 工具栏容器
        // paletteContainer:  this.$refs.palette,
          // 工具栏配置及实现自定义渲染方法
          paletteEntries: entries,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions,
        bpmnRenderer: {
          defaultStrokeColor: '#467CF3'
        }
      });
      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();

    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async () => {
        debugger
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(e);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", e => {
        this.defaultZoom = Math.floor(e.viewbox.scale * 100) / 100;
        this.currentScale = Math.floor(this.defaultZoom * 100) + "%";
      });
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      try {
        let { warnings } = this.bpmnModeler.importXML(DefaultEmptyXML);
        if (warnings) console.warn(warnings);
      } catch (e) {
        console.error(e);
      }
    },
    // 获取流程属性
    getProcessAttribute(){
      const processElement =this.bpmnModeler.get('elementRegistry').find(el => el.type === "bpmn:Process");
      console.log("===============");
      console.log(processElement);
      processElement.businessObject.$attrs.process_id = processElement.id;

      this.$refs.processAttribute.initData(processElement)
    },
    // 下载流程图到本地
    async downloadProcess(type, name) {
      try {
        const _this = this;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await this.bpmnModeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml);
          downloadFunc(href, filename);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = _this.setEncoded("SVG", svg);
          downloadFunc(href, filename);
        }
      } catch (e) {
        console.error(e);
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = "diagram", data) {
      const encodedData = encodeURIComponent(data);
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
      };
    },

    // 加载本地文件
    importLocalFile() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    async saveModel() {

    },
    downloadProcessAsXml() {
      this.downloadProcess("xml");
    },
    downloadProcessAsBpmn() {
      this.downloadProcess("bpmn");
    },
    downloadProcessAsSvg() {
      this.downloadProcess("svg");
    },
    processRedo() {
      console.log("===================");
      console.log(this.bpmnModeler.get("commandStack"));
      this.bpmnModeler.get("commandStack").redo();
    },
    processUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    processZoomIn(newZoom = 0.1) {
      this.defaultZoom = Math.floor(this.defaultZoom * 100 + newZoom * 100) / 100;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut(newZoom = 0.1) {
      this.defaultZoom = Math.floor(this.defaultZoom * 100 - newZoom * 100) / 100;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        throw new Error("The zoom ratio cannot be less than 0.2");
      }
      if (newZoom > 4) {
        throw new Error("The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(newZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
    },
    processRestart() {
      this.recoverable = false;
      this.revocable = false;
      this.createNewDiagram(null).then(() => this.bpmnModeler.get("canvas").zoom(1, "auto"));
    },
    /*-----------------------------    方法结束     ---------------------------------*/
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml;
        this.previewType = "xml";
        this.previewModelVisible = true;
      });
    },
    previewProcessJson() {
      let definitions = this.bpmnModeler.get('canvas').getRootElement().businessObject;
      console.log(definitions.$attrs)
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = convert.xml2json(xml, { spaces: 2 });
        this.previewType = "json";
        this.previewModelVisible = true;
      });
    },
      createElement (elementConfig,element) {
          debugger
          const elementFactory = this.bpmnModeler.get('elementFactory')
          const elementRegistry = this.bpmnModeler.get('elementRegistry')
          const modeling = this.bpmnModeler.get('modeling');
          const processId=elementRegistry.getAll()[0].id
          const process = elementRegistry.get(processId)
          const startEvent = elementRegistry.get(element.id);
          // const targetEvent = elementRegistry.get(element.target.id);
          const length=element.outgoing.length
          const task = elementFactory.createShape(elementConfig)

          const x=element.x+(element.width)/2*(length+1)+elementConfig.width*length
          // (4) 将新 task 添加到图中
          modeling.createShape(task, { x:x, y: element.y+element.height+100 }, process);
          // (5) 连线
          // const currentEvent= elementRegistry.get(task.id)
          modeling.connect(startEvent, task);
          // modeling.connect(currentEvent, targetEvent);
          //隐藏弹框
          this.$bus.$emit("hiddenContext")
      },
  },
  watch: {
    value: {
      handler: function(val) {
        debugger
        this.createNewDiagram(val);
      }
    }
  }
};
</script>
