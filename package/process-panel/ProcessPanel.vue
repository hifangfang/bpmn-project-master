<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <ul class="element-title">
      <li>节点属性</li>
      <span @click="hiddenPanel"><i class="iconfont zwpt_xzzbjd"></i></span>
    </ul>
    <el-tabs v-model="activeTab">
      <el-tab-pane name="base">
        <div slot="label" class="panel-tab__title"><i class="iconfont zwpt_jbsx"></i>基本属性</div>
        <div class="panel-tab__content">
          <el-form size="mini" label-width="90px" label-suffix=":">
            <el-form-item v-if="elementType === 'bpmn:UserTask'" label="环节标识">
              <el-input
                v-model="activeElementBusinessObject.id"
                :disabled="idEditDisabled"
                clearable
                @keyup.native="updateBaseInfo('id', activeElementBusinessObject.id)"
                @change="updateBaseInfo('id', $event)"
              />
            </el-form-item>
            <el-form-item v-else label="编号(Id)">
              <el-input
                v-model="activeElementBusinessObject.id"
                :disabled="idEditDisabled"
                clearable
                @keyup.native="updateBaseInfo('id', activeElementBusinessObject.id)"
                @change="updateBaseInfo('id', $event)"
              />
            </el-form-item>
            <el-form-item label="名称">
              <el-input
                v-model="activeElementBusinessObject.name"
                clearable
                @keyup.native="updateBaseInfo('name', activeElementBusinessObject.name)"
                @change="updateBaseInfo('name', $event)"
              />
            </el-form-item>
            <el-form-item v-if="elementType === 'bpmn:IntermediateCatchEvent'" label="持续时间">
              <el-input-number
                v-model="timerDay"
                controls-position="right"
                @change="handleChange"
                :min="0" :max="10"></el-input-number>
              <span>天</span>
              <el-input-number
                v-model="timerHour"
                controls-position="right"
                @change="handleChange"
                :min="0"
                :max="59"></el-input-number>
              <span>时</span>
              <el-input-number
                v-model="timerMinute"
                controls-position="right"
                @change="handleChange"
                :min="0"
                :max="59"></el-input-number>
              <span>分</span>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                type="textarea"
                clearable
                v-model="activeElementBusinessObject.Documentation"
                @change="updateBaseInfo('Documentation', activeElementBusinessObject.Documentation)"
              />
            </el-form-item>
            <el-form-item v-if="elementType === 'bpmn:SequenceFlow'" label="流条件">
              <el-button
                type="primary"
                @click="onConditionSequenceFlow(activeElementBusinessObject.conditionExpression)"
                v-model="activeElementBusinessObject.conditionExpression"
                @change="updateBaseInfo('conditionExpression', activeElementBusinessObject.conditionExpression)"
              >{{flowConditions}}
              </el-button>
            </el-form-item>
            <el-form-item v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:StartEvent'" label="表单键值">
              <el-input
                clearable
                v-model="activeElementBusinessObject.formKey"
                @change="updateBaseInfo('formKey', activeElementBusinessObject.formKey)"
              />
            </el-form-item>
            <el-form-item v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:ReturnTask'" label="任务分配">
              <el-button
                type="primary"
                @click="onCandidateGroups(activeElementBusinessObject.candidateGroups)"
                v-model="activeElementBusinessObject.candidateGroups"
                @change="updateBaseInfo('candidateGroups', activeElementBusinessObject.candidateGroups)">
                {{taskAllocation}}
              </el-button>
            </el-form-item>
            <el-form-item v-if="elementType !== 'bpmn:InclusiveGateway'" label="执行监听器">
              <el-button
                type="primary"
                @click="openWindow"
                v-model="activeElementBusinessObject.taskListeners"
                @change="updateBaseInfo('taskListeners', activeElementBusinessObject.taskListeners)">
                {{taskListener}}
              </el-button>
            </el-form-item>
            <el-form-item v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:ReturnTask'" label="办理时限">
              <el-input-number
                v-model="day"
                controls-position="right"
                @change="handleChange"
                :min="0"
                :max="10"></el-input-number>
              <span>天</span>
              <el-input-number
                v-model="hour"
                controls-position="right"
                @change="handleChange"
                :min="0"
                :max="59"></el-input-number>
              <span>时</span>
              <el-input-number
                v-model="minute"
                controls-position="right"
                @change="handleChange"
                :min="0"
                :max="59"></el-input-number>
              <span>分</span>
            </el-form-item>
            <template v-if="elementType === 'bpmn:UserTask'">
              <div class="element-property input-property">
                <div class="element-property__label">绑定方式</div>
                <div class="element-property__value">
                  <el-select
                    v-model="activeElementBusinessObject.bindtype"
                    size="mini"
                    @change="updateBaseInfo('bindtype', activeElementBusinessObject.bindtype)">
                    <el-option label="无" value=""/>
                    <el-option label="人员" value="user"/>
                    <el-option label="部门" value="dept"/>
                    <el-option label="行政区" value="xzq"/>
                  </el-select>
                </div>
              </div>
              <div class="element-property input-property">
                <div class="element-property__label">绑定环节</div>
                <div class="element-property__value">
                  <el-select
                    v-model="activeElementBusinessObject.bindtask"
                    size="mini"
                    @change="updateBaseInfo('bindtask', activeElementBusinessObject.bindtask)">
                    <el-option
                      v-for="item in options"
                      :label="item.name"
                      :value="item.id"
                      :key="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="element-property input-property">
                <div class="element-property__label">办理地</div>
                <div class="element-property__value">
                  <el-select
                    v-model="activeElementBusinessObject.bindarchive"
                    size="mini"
                    @change="updateBaseInfo('bindarchive', activeElementBusinessObject.bindarchive)">
                    <el-option label="--请选择--" value=""/>
                    <el-option label="办件受理地" value="1"/>
                    <el-option label="档案归属地" value="2"/>
                  </el-select>
                </div>
              </div>
            </template>
          </el-form>
          <!--连接线的基础配置-->
          <condition-config v-if="flowTypeViewable" v-bind="$props" :conditions="sequenceFlowCondition"
                            :element-id="elementId"/>
        </div>
      </el-tab-pane>
      <!--扩展属性-->
      <el-tab-pane name="extensions">
        <div slot="label" class="panel-tab__title"><i class="iconfont zwpt_kzsx"></i>扩展属性</div>
        <element-attributes ref="elementAttributes" v-bind="$props" :element-id="elementId"
                            :activeElementBusinessObject="activeElementBusinessObject"
                            :options="options"
                            @change="updateElementAttributes"/>
      </el-tab-pane>
      <!--规则-->
      <el-tab-pane name="rules">
        <div slot="label" class="panel-tab__title"><i class="iconfont zwpt_jygz"></i>校验规则</div>
        <element-rules v-bind="$props" :element-id="elementId" ref="elementRules"/>
      </el-tab-pane>
      <!--档案袋-->
      <el-tab-pane name="filebags">
        <div slot="label" class="panel-tab__title"><i class="iconfont zwpt_dadpz"></i>档案袋配置</div>
        <filebag-config v-bind="$props" :element-id="elementId"/>
        <!--<filebagIndex></filebagIndex>-->
      </el-tab-pane>
      <!-- 外置表单配置-->
      <template v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:StartEvent'">
        <el-tab-pane name="form">
          <div slot="label" class="panel-tab__title"><i class="el-icon-s-order"></i>表单</div>
          <element-form-config
            v-bind="$props"
            :element-id="elementId"
            :element-business-object="activeElementBusinessObject"
            @change-form-key="updateBaseInfo('formKey', $event)"
          />
        </el-tab-pane>
      </template>
      <el-tab-pane name="listeners">
        <div slot="label" class="panel-tab__title"><i class="el-icon-message-solid"></i>监听器</div>
        <element-listener v-bind="$props" :element-id="elementId" :listeners="elementListeners"
                          @change="updateElementListener"/>
      </el-tab-pane>
      <el-tab-pane name="other">
        <div slot="label" class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
        <div class="panel-tab__content">
          <div class="element-property input-property">
            <div class="element-property__label">元素文档</div>
            <div class="element-property__value">
              <el-input
                type="textarea"
                v-model="documentation"
                size="mini"
                resize="vertical"
                :autosize="{ minRows: 2, maxRows: 4 }"
                @input="updateDocumentation"
                @blur="updateDocumentation"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <taskAssignment ref="taskAssignment" @updateBaseInfo="updateBaseInfo"></taskAssignment>
    <selectProcessLisener ref="selectProcessLisener" :bpmnModeler="bpmnModeler"
                          @updateProcessLisener="updateTaskLisener" :element-id="elementId"
                          :listeners="extensionElements"></selectProcessLisener>
    <!--流条件-->
    <FlowConditions ref="FlowConditions" @updateBaseInfo="updateBaseInfo" @updateFlowConditions="updateFlowConditions"></FlowConditions>
  </div>
</template>
<script>
  // import { debounce } from "@/utils";
  import ConditionConfig from "./condition-config/ConditionConfig";
  import ElementListener from "./extensional/listeners/ElementListener";
  import ElementAttributes from "./extensional/attrbutes/ElementAttributes";
  import ElementFormConfig from "./form-config/ElementFormConfig";
  import ElementRules from "./rules-checking/ElementRules"
  import FilebagConfig from "./filebag-config/FilebagConfig"
  // import filebagIndex from "../../../bizmodel/pages/definition/sub/filebag/filebag-index-page"
  import taskAssignment from "./extensional/task-assignment/taskAssignment"
  import selectProcessLisener from "../../src/components/selectProcessLisener"
  import FlowConditions from "./extensional/sequence-flow/FlowConditions"
  import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
  } from 'tiny-svg';
  import {
    isArray,
    isFunction,
    forEach
  } from 'min-dash'

  export default {
    name: "MyProcessPanel",
    components: {
      ElementFormConfig,
      ElementAttributes,
      ElementListener,
      ConditionConfig,
      ElementRules,
      FilebagConfig,
      taskAssignment,
      selectProcessLisener,
      FlowConditions
    },
    componentName: "MyProcessPanel",
    props: {
      bpmnModeler: Object,
      prefix: {
        type: String,
        default: "activiti"
      },
      width: {
        type: Number,
        default: 480
      },
      idEditDisabled: {
        type: Boolean,
        default: true
      },
      parent: Object,
    },
    provide() {
      return {
        prefix: this.prefix,
        width: this.width
      };
    },
    data() {
      return {
        activeTab: "base",
        activeElementBusinessObject: {},
        documentation: "", // 元素文档 对应的字符串
        sequenceFlowCondition: {}, // 连线条件实例（包含需要的类型字段）
        elementListeners: [], //  监听器实例集合
        listenerLength: 0,
        elementAttributes: [],// 扩展属性 -- 自定义字段属性实例集合
        day: 0,
        hour: 0,
        minute: 0,
        timerDay: 0,// 公告持续时间 天 时 分
        timerHour: 0,
        timerMinute: 0,
        options: [],
        taskAllocation: "未选择角色或经办人",
        flowConditions: "未配置条件",
        taskListener: "未配置执行监听",
        extensionElements: {},
        element:"",
      };
    },
    computed: {
      elementType() {
        if (this.activeElementBusinessObject) return this.activeElementBusinessObject.$type;
        return null;
      },
      elementId() {
        if (this.activeElementBusinessObject) return this.activeElementBusinessObject.id;
        return null;
      },
      flowTypeViewable() {
        if (this.elementType !== "bpmn:SequenceFlow") return false;
        return this.activeElementBusinessObject.sourceRef && this.activeElementBusinessObject.sourceRef.$type !== "bpmn:StartEvent";
      },
      taskLoopViewable() {
        return this.elementType && this.elementType.indexOf("Task") !== -1;
      }
    },
    watch: {
      elementType(type) {
        console.log("selectionElementType: ", type);
      },
      elementId(id) {
        console.log("selectionElementId: ", id);
      }
    },
    created() {
      this.initModels();

    },
    mounted() {
      // this.initModels();
    },
    beforeDestroy() {
      // clearTimeout(this.timer);
    },
    methods: {
      hiddenPanel() {
        this.parent.hiddenPanel()
      },
      getElementByAttr(tag, attr, value) {
        let aElements = document.getElementsByTagName(tag);
        let aEle = [];
        for (let i = 0; i < aElements.length; i++) {
          if (aElements[i].getAttribute(attr) == value)
            aEle.push(aElements[i]);
        }
        return aEle;
      },
      initModels() {
        // 初始化 modeler 以及其他 moddle
        if (!this.bpmnModeler) {
          // 避免加载时 流程图 并未加载完成
          this.timer = setTimeout(() => this.initModels(), 10);
          return;
        }
        if (this.timer) clearTimeout(this.timer);
        this.modeling = this.bpmnModeler.get("modeling");
        this.moddle = this.bpmnModeler.get("moddle");
        this.eventBus = this.bpmnModeler.get("eventBus");
        this.bpmnFactory = this.bpmnModeler.get("bpmnFactory");
        this.elementRegistry = this.bpmnModeler.get("elementRegistry");
        this.replace = this.bpmnModeler.get("replace");
        this.selection = this.bpmnModeler.get("selection");
        this.$nextTick(() => this.getActiveElement());
        this.getElements();

        const extensions = this.moddle.create("bpmn:ExtensionElements", {
          values: []
        });
        console.log("===========extensions===============");
        console.log(extensions);
      },
      getElements() {
        setTimeout(() => {
          let elements = this.elementRegistry._elements;
          for (let key in elements) {
            let data = elements[key];
            let ModdleElement = data.element.businessObject;
            if (ModdleElement.$type === "bpmn:UserTask") {
              let obj = {"id": ModdleElement.id, "name": ModdleElement.name};
              this.options.push(obj);
            }
          }
        }, 500)
      },
      getActiveElement() {
        this.bpmnModeler.on("element.changed", ({element}) => {
          // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
          if (element && element.id === this.activeElementBusinessObject.id) {
            this.initFormOnChanged(element.id);
          }
        });
        // // 监听元素选中
        this.bpmnModeler.on('element.click', ({element}) => {
          this.$bus.$emit("showProcessAttr",element)
          this.element=element
          this.initFormOnChanged(element.id);
          if (this.activeElementBusinessObject.$type === "bpmn:IntermediateCatchEvent") {
            let timer = this.activeElementBusinessObject.eventDefinitions[0].timeDuration.body;
            this.timerDay = timer.substring(1, timer.indexOf("DT"));
            this.timerHour = timer.substring(timer.indexOf("DT") + 2, timer.indexOf("H"));
            this.timerMinute = timer.substring(timer.indexOf("H") + 1, timer.length - 1);
          }
          if (this.activeElementBusinessObject.$type === "bpmn:UserTask" ||
            this.activeElementBusinessObject.$type === "bpmn:Process") {
            let timeLimit = this.activeElementBusinessObject.timelimit;
            this.extensionElements = this.activeElementBusinessObject.extensionElements;
            let candidateGroups = this.activeElementBusinessObject.candidateGroups;
            if (timeLimit) {
              this.day = timeLimit.substring(0, timeLimit.indexOf("d"));
              this.hour = timeLimit.substring(timeLimit.indexOf("d") + 1, timeLimit.indexOf("h"));
              this.minute = timeLimit.substring(timeLimit.indexOf("h") + 1, timeLimit.length - 1);
            }
            if (this.extensionElements) {
              let values = this.extensionElements.values;
              if (values != null && values.length > 0) {
                this.taskListener = values.length + "个环节监听";
              } else {
                this.taskListener = "未配置环节监听";
              }
            }else{
              this.taskListener = "未配置环节监听";
            }
            if (candidateGroups) {
              let groups = candidateGroups.split(",");
              if (groups != null && groups.length > 0) {
                this.taskAllocation = groups.length + "个角色";
              } else {
                this.taskAllocation = "未选择角色或经办人";
              }
            }
          } else if (this.activeElementBusinessObject.$type === "bpmn:Process") {
            let timeLimit = this.activeElementBusinessObject.timelimit;
            if (timeLimit) {
              this.day = timeLimit.substring(0, timeLimit.indexOf("d"));
              this.hour = timeLimit.substring(timeLimit.indexOf("d") + 1, timeLimit.indexOf("h"));
              this.minute = timeLimit.substring(timeLimit.indexOf("h") + 1, timeLimit.length - 1);
            }
          } else if (this.activeElementBusinessObject.$type === "bpmn:SequenceFlow") {
            let conditionExpression = this.activeElementBusinessObject.conditionExpression;
            this.extensionElements = this.activeElementBusinessObject.extensionElements;
            if (conditionExpression != null) {
              this.flowConditions = conditionExpression.body;
            } else {
              this.flowConditions = "未配置条件";
            }
            if (this.extensionElements) {
              let values = this.extensionElements.values;
              if (values != null && values.length > 0) {
                this.taskListener = values.length + "个环节监听";
              } else {
                this.taskListener = "未配置环节监听";
              }
            }else{
              this.taskListener = "未配置环节监听";
            }
          }
        });
      },
      // 元素更新时更新表单
      initFormOnChanged(elementId) {
        const element = this.elementRegistry.get(elementId); // 元素
        if (!element) return;
        this.activeElementBusinessObject = {...element.businessObject};
        const shapeDoc = element.businessObject?.documentation; // 元素文档
        // 设置文档属性
        this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0]?.text : "";
        // 设置扩展监听
        if (element.businessObject?.extensionElements?.values) {
          this.elementListeners = element.businessObject.extensionElements.values.filter(
            // ex => ex.$type === "camunda:ExecutionListener"
            ex => ex.$type === `${this.prefix}:TaskListener`
          );
          this.elementAttributes = element.businessObject.extensionElements.values.filter(ex => ex.$type === `${this.prefix}:Properties`);
          this.listenerLength = this.elementListeners.length
        } else {
          this.elementListeners = [];
          this.elementAttributes = [];
          this.listenerLength = 0
        }
        // 设置条件属性
        if (element.type.indexOf("SequenceFlow") !== -1) {
          if (element.businessObject.conditionExpression) {
            this.sequenceFlowCondition = {...element.businessObject.conditionExpression};
            this.$set(this.sequenceFlowCondition, "type", "condition");
            return;
          }
          const sourceShape = this.elementRegistry.get(element.businessObject.sourceRef.id);
          if (sourceShape.businessObject.default && sourceShape.businessObject.default.id === elementId) {
            this.$set(this.sequenceFlowCondition, "type", "default");
            return;
          }
          this.$set(this.sequenceFlowCondition, "type", "normal");
        }
      },
      // 更新常规信息
      updateBaseInfo(key, value) {
        debugger;
        const shape = this.elementRegistry.get(this.elementId);
        let attrObj = {};
        attrObj[key] = value;
        this.modeling.updateProperties(shape, attrObj);
      },
      //更新任务分配按钮值
      updateTaskAllocation(value) {
        if (value !== null && value !== "") {
          let array = value.split(",");
          this.taskAllocation = array.length + "个角色";
        } else {
          this.taskAllocation = "未配置角色或经办人";
        }
      },
      //更新流条件按钮值
      updateFlowConditions(value) {
        if (value) {
          this.flowConditions = value;
        } else {
          this.flowConditions = "未配置条件";
        }
      },
      // 更新元素文档
      updateDocumentation() {
        const element = this.elementRegistry.get(this.elementId);
        const documentation = this.bpmnFactory.create("bpmn:Documentation", {text: this.documentation});
        this.modeling.updateProperties(element, {
          documentation: [documentation]
        });
      },
      // 更新事件监听器
      updateElementListener(listeners) {
        const element = this.elementRegistry.get(this.elementId);
        const extensionElements = element.businessObject.get("extensionElements");
        // 截取不是监听器的属性
        const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:ExecutionListener`) || [];
        // 重建扩展属性
        const extensions = this.moddle.create("bpmn:ExtensionElements", {
          values: otherExtensions.concat(listeners)
        });
        this.updateElementExtensions(element, extensions);
      },
      // 更新扩展属性
      updateElementAttributes(attributes) {
        // attributes 是普通数组，需要重新创建实例
        const properties = this.moddle.create(`${this.prefix}:Properties`, {
          values: attributes.map(attr => {
            return this.moddle.create(`${this.prefix}:Property`, {name: attr.name, value: attr.value});
          })
        });
        const element = this.elementRegistry.get(this.elementId);
        const extensionElements = element.businessObject.get("extensionElements");
        // 截取不是扩展属性的属性
        const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:Properties`) || [];
        // 重建扩展属性
        const extensions = this.moddle.create("bpmn:ExtensionElements", {values: otherExtensions.concat([properties])});
        this.updateElementExtensions(element, extensions);
      },
      // 更新扩展配置 extensionElements 到元素
      updateElementExtensions(element, extensions) {
        this.modeling.updateProperties(element, {extensionElements: extensions});
        // 更新表单
        this.initFormOnChanged(this.elementId);
      },
      //配置办理角色
      onCandidateGroups(obj) {
        this.$refs.taskAssignment.visible = true;
        this.$refs.taskAssignment.initPage(obj);
      },
      onConditionSequenceFlow(data) {
        this.$refs.FlowConditions.initPage(data);
      },
      handleChange() {
        let timeLimit = this.day + "d" + this.hour + "h" + this.minute + "m";
        this.updateBaseInfo('timelimit', timeLimit)
      },
      openWindow() {
        this.$refs.selectProcessLisener.show();
      },
      updateTaskLisener(extensionElements) {
        this.element.businessObject.extensionElements = extensionElements;
        let values = extensionElements.values;
        if (values != null && values.length > 0) {
          this.taskListener = values.length + "个执行监听";
        } else {
          this.taskListener = "未配置执行监听器";
        }
      }
    }
  };
</script>
<style>
  .el-input-number--mini {
    width: 80px;
    line-height: 26px;
  }
</style>
