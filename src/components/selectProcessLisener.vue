<template>
  <div class="select-processLisnener">
    <el-dialog :visible.sync="visible" :title="'修改'+lisnenerName+'的值'" :before-close="close" top="5vh"
               :close-on-click-modal="false">
      <el-container>
        <el-aside width="50%">
          <el-row class="eventWrap">
            <el-table
              :data="eventTableData"
              :header-cell-style="{background:'#DDDFE5'}"
              :row-class-name="eventRow"
              @row-click="handleEvent"
              highlight-current-row
              height="100%"
              style="width: 100%">
              <el-table-column
                prop="event"
                label="事件"
                width="150">
              </el-table-column>
              <el-table-column
                prop="class"
                label="实现">
              </el-table-column>
            </el-table>
          </el-row>
          <el-row class="eventButtons">
            <el-button-group>
              <el-button type="primary" title="上移" icon="el-icon-top" @click="upEvent()"></el-button>
              <el-button type="primary" title="下移" icon="el-icon-bottom" @click="downEvent()"></el-button>
              <el-button type="primary" title="添加" icon="el-icon-plus" @click="addEvent()"></el-button>
              <el-button type="primary" title="删除" icon="el-icon-minus" @click="deleteEvent()"></el-button>
            </el-button-group>
          </el-row>
          <el-row class="fieldsWrap">
            <el-table
              :data="executionListener?executionListener.fields:[]"
              :header-cell-style="{background:'#DDDFE5'}"
              :row-class-name="fieldRow"
              @row-click="handleField"
              highlight-current-row
              height="100%"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="stringValue"
                label="实现">
              </el-table-column>
            </el-table>
          </el-row>
          <el-row class="fieldsButtons">
            <el-button-group>
              <el-button type="primary" title="上移" icon="el-icon-top" @click="upField()"></el-button>
              <el-button type="primary" title="下移" icon="el-icon-bottom" @click="downField"></el-button>
              <el-button type="primary" title="添加" icon="el-icon-plus" @click="addField"></el-button>
              <el-button type="primary" title="删除" icon="el-icon-minus" @click="deleteField"></el-button>
            </el-button-group>
          </el-row>
        </el-aside>
        <el-main>
          <el-row class="execution-listener">
            <el-form label-position="right" v-if="executionListener" label-width="100px" ref="executionListener"
                     :model="executionListener">
              <el-form-item label="事件">
                <el-select size="mini" v-model="executionListener.event">
                  <el-option
                    v-for="item in eventOptions"
                    :value="item.value"
                    :label="item.label"
                    :key="item.value"
                    @click.native="selectEvent(item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类">
                <!--<el-input size="mini" v-model="executionListener.class" placeholder="请输入类名"></el-input>-->
                <el-select size="mini" v-model="executionListener.class" filterable allow-create>
                  <el-option
                    v-for="item in classOptions"
                    :value="item.value"
                    :label="item.label"
                    :key="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="表达式">
                <el-input size="mini" v-model="executionListener.expression" placeholder="请输入表达式"></el-input>
              </el-form-item>
              <el-form-item label="代理表达式">
                <el-input size="mini" v-model="executionListener.delegateExpression" placeholder="请输入代理表达式"></el-input>
              </el-form-item>
              <el-form-item label="业务服务">
                <el-input size="mini" v-model="executionListener.businessAddress" placeholder="请输入业务服务地址"></el-input>
              </el-form-item>
            </el-form>
            <span v-else>未选择{{lisnenerName}}</span>
          </el-row>
          <el-row class="property">
            <el-form label-position="right" v-if="fieldDetail" label-width="100px" ref="fieldDetail"
                     :model="fieldDetail">
              <el-form-item label="名称">
                <el-input size="mini" v-model="fieldDetail.name" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="字符串值">
                <el-input size="mini" v-model="fieldDetail.stringValue" placeholder="请输入字符串值"></el-input>
              </el-form-item>
              <el-form-item label="表达式">
                <el-input size="mini" v-model="fieldDetail.expression" placeholder="请输入表达式"></el-input>
              </el-form-item>
              <el-form-item label="字符串">
                <el-input type="textarea" :rows="2" v-model="fieldDetail.string" placeholder="请输入字符串"></el-input>
              </el-form-item>
            </el-form>
            <span v-else>未选择属性</span>
          </el-row>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close()">取消</el-button>
        <el-button size="small" @click="save()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";

  @Component({
    name: "select-processLisnener"
  })
  export default class processLisnener extends Vue {
    @Prop() listeners: any;
    @Prop() bpmnModeler: any;
    @Prop() elementId: any;
    @Prop({default: 'activiti'})
    prefix: any;
    @Watch('listeners')
    handler(newVal) {
      debugger
      if (newVal?.length) {
        this.ownerListenersObjectList = newVal;
        this.ownerListenersList = newVal.map(li => {
          let listenerType;
          if (li.class) listenerType = "classListener";
          if (li.expression) listenerType = "expressionListener";
          if (li.delegateExpression) listenerType = "delegateExpressionListener";
          if (li.script) listenerType = "scriptListener";
          return {
            ...li,
            listenerType: listenerType
          };
        });
      } else {
        this.ownerListenersObjectList = [];
        this.ownerListenersList = [];
      }
    }

    visible = false;
    data = [] as any;
    active = false;
    searchForm = {};
    tableData = [{}];
    iconSubGuid = ""
    appOptions = [] as any;
    eventTableData = [] as any;
    executionListener = {} as any;
    isProcess = false;
    eventOptions = [] as any;
    classOptions = [] as any;
    processEvent = [{
      label: "start",
      value: "start",
      classOptions: [
        {
          label: "org.activiti.listener.ProcessDueDateListener",
          value: "org.activiti.listener.ProcessDueDateListener",
        },
        {
          label: "org.activiti.listener.ProcessStartListener",
          value: "org.activiti.listener.ProcessStartListener",
        },
        {
          label: "org.activiti.listener.TimerDueDateListener",
          value: "org.activiti.listener.TimerDueDateListener",
        }
      ]
    },
      {
        label: "end",
        value: "end",
        classOptions: [
          {
            label: "org.activiti.listener.ProcessEndListener",
            value: "org.activiti.listener.ProcessEndListener",
          }
        ]
      },
      {
        label: "take",
        value: "take",
        classOptions: [
          {
            label: "org.activiti.listener.ProcessStartListener",
            value: "org.activiti.listener.ProcessStartListener",
          }
        ]
      }
    ];
    elementEvent = [{
      label: "create",
      value: "create",
      classOptions: [
        {
          label: "org.activiti.listener.TaskAssignListener",
          value: "org.activiti.listener.TaskAssignListener",
        },
        {
          label: "org.activiti.listener.TaskCreateListener",
          value: "org.activiti.listener.TaskCreateListener",
        },
        {
          label: "org.activiti.listener.TaskDueDateListener",
          value: "org.activiti.listener.TaskDueDateListener",
        }
      ]
    },
      {
        label: "assignment",
        value: "assignment",
        classOptions: [
          {
            label: "org.activiti.listener.TaskAssignmentListener",
            value: "org.activiti.listener.TaskAssignmentListener",
          }
        ]
      },
      {
        label: "beforecomplete",
        value: "beforecomplete",
        classOptions: [
          {
            label: "org.activiti.listener.TaskBeforeCompleteListener",
            value: "org.activiti.listener.TaskBeforeCompleteListener",
          }
        ]
      },
      {
        label: "complete",
        value: "complete",
        classOptions: [
          {
            label: "org.activiti.listener.TaskCompleteListener",
            value: "org.activiti.listener.TaskCompleteListener",
          }
        ]
      },
      {
        label: "delete",
        value: "delete",
        classOptions: [
          {
            label: "org.activiti.listener.TaskDueDateListener",
            value: "org.activiti.listener.TaskDueDateListener"
          }
        ]
      }
    ];
    fieldDetail = {} as any;
    lisnenerName = "" as String;
    ownerListenersList = [] as any;
    ownerListenersObjectList = [] as any;
    listenerIndex = 0;

    async show() {
      debugger
      this.visible = true;
      this.fieldDetail = "";
      this.executionListener = "";
      this.isProcess = this.elementId.startsWith("pid-");
      if (this.isProcess) {
        this.lisnenerName = "执行监听器";
        this.eventOptions = this.processEvent
      } else {
        this.lisnenerName = "环节监听器";
        this.eventOptions = this.elementEvent
      }
      //初始化监听器列表
      if(this.listeners && this.listeners.values){
        console.log("=========listeners=========");
        console.log(this.listeners);
        this.listeners.values.forEach((item) =>{
          let obj ={
            expression: item.expression,
            implementation: item.implementation,
            event: item.event,
            class: item.class,
            delegateExpression: item.delegateExpression,
            businessAddress: item.businessAddress
          };
          this.eventTableData.push(obj);
        })

      }else{
        this.listeners = {};
      }
    }

    created() {


    }

    //选中监听器
    handleEvent(row, column, rowIndex, columnIndex) {
      this.executionListener = row
      //根据事件获取字段
      this.executionListener.fields = row.fields ? row.fields : []
      this.fieldDetail = ""
      this.listenerIndex = row.index;
      //得到事件的类
      var eventValue = this.isProcess ? (this.processEvent.filter(item => item.value == this.executionListener.event)) : (this.elementEvent.filter(item => item.value == this.executionListener.event))
      this.classOptions = eventValue[0]?.classOptions
    }

    eventRow({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    }

    //上移事件
    upEvent() {
      if (this.executionListener) {
        const index = this.executionListener.index;
        if (this.eventTableData.length > 1 && index !== 0) {
          this.eventTableData = this.swapItems(this.eventTableData, index, index - 1)
        }
      }
    }

    //下移事件
    downEvent() {
      if (this.executionListener) {
        const index = this.executionListener.index;
        if (this.eventTableData.length > 1 && index !== (this.eventTableData.length - 1)) {
          this.eventTableData = this.swapItems(this.eventTableData, index, index + 1)
        }
      }
    }

    //添加事件
    addEvent() {
      if (this.isProcess) {
        var obj = {
          expression: "",
          implementation: "org.activiti.listener.ProcessEndListener",
          event: "start",
          class: "org.activiti.listener.ProcessEndListener",
          delegateExpression: "",
          businessAddress: ""
        }
      } else {
        var obj = {
          expression: "",
          implementation: "",
          event: "create",
          class: "",
          delegateExpression: "",
          businessAddress: ""
        }
      }
      this.eventTableData.push(obj)
      this.listenerIndex = -1
    }

    deleteEvent() {
      this.eventTableData = this.eventTableData.slice(0, -1)
    }

    //选择事件select框
    selectEvent(item) {
      this.classOptions = item.classOptions
    }

    //选中字段
    handleField(row, event, column) {
      this.fieldDetail = row
    }

    //上移字段
    upField() {
      if (this.executionListener) {
        const index = this.fieldDetail.index
        if (this.executionListener.fields.length > 1 && index !== 0) {
          this.executionListener.fields = this.swapItems(this.executionListener.fields, index, index - 1)
        }
      }

    }

    //下移字段
    downField() {
      if (this.executionListener) {
        const index = this.fieldDetail.index
        if (this.executionListener.fields.length > 1 && index !== (this.executionListener.fields.length - 1)) {
          this.executionListener.fields = this.swapItems(this.executionListener.fields, index, index + 1)
        }
      }

    }

    fieldRow({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    }

    addField() {
      if (this.executionListener) {
        const obj = {
          name: "fieldName",
          implementation: "",
          stringValue: "",
          expression: "",
          string: ""
        } as any;
        this.executionListener.fields.push(obj)
      }
    }

    deleteField() {
      this.executionListener.fields = this.executionListener.fields.slice(0, -1)
    }

    //移动
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr
    }

    //关闭/取消
    close() {
      this.visible = false;
      this.executionListener = {};
      this.eventTableData = []
    }

    //保存
    save() {
      debugger;
      this.ownerListenersObjectList = [];
      const element = this.bpmnModeler.get("elementRegistry").get(this.elementId);
      const businessObject = element.businessObject;
      let listenerModelObj ={};
      const moddle = this.bpmnModeler.get("moddle");
      this.eventTableData.forEach((item, index) => {
       /* if (item.fields) {
          item.fields = item.fields.map(field => {
            return moddle.create(`${this.prefix}:Field`, field);
          })
        }*/
        let listenerModel :any;
        this.isProcess = this.elementId.startsWith("pid-");
        if(this.isProcess){
          const element = this.bpmnModeler.get("elementRegistry").get(this.elementId);
          listenerModel = moddle.create(`${this.prefix}:ExecutionListener`, item);
        }else{
          listenerModel = moddle.create(`${this.prefix}:TaskListener`, item);
        }
        this.ownerListenersObjectList.push(listenerModel);
      });

      const extensions = moddle.create("bpmn:ExtensionElements", {
        values:  this.ownerListenersObjectList
      });
      console.log("===========extensions=================")
      console.log(extensions)
      element.businessObject.extensionElements = extensions;
      // 3. 更新事件监听器列表到父组件
      this.$emit("updateProcessLisener", element.businessObject.extensionElements);
      this.visible = false;
    }
  }
</script>

<style lang="scss">
  .select-processLisnener {
    .el-dialog {
      text-align: left;
      height: 90vh !important;
      width: 70% !important;

      .el-dialog__body {
        height: calc(100% - 110px);

        .el-container {
          height: 100%;

          .el-aside {
            height: 100%;
          }

          .el-main {
            .el-form {
              .el-form-item {
                margin-bottom: 10px;
              }
            }
          }
        }
      }

      .eventWrap, .fieldsWrap {
        height: calc(50% - 60px);

        th, td {
          padding: 9px 0;
        }

        .el-table__body-wrapper {
          cursor: pointer;
        }

      }

      .eventButtons {
        margin: 10px 0;
      }

      .fieldsButtons {
        margin: 10px 0 0 0;
      }

      .execution-listener {
        min-height: 200px;
      }
    }

  }
</style>
