<template>
  <div class="select-eventListener">
    <el-dialog :visible.sync="visible" title='修改"事件监听器"的值' :before-close="close" top="5vh" :close-on-click-modal="false">
        <el-main width="100%">
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
               >
              </el-table-column>
              <el-table-column
                prop="implementation"
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
          <el-row v-if="executionListener" class="eventDetail">
             <el-form >
               <el-form-item label="事件">
                 <div v-for="(event,index) in selectEventArr">
                   <el-select  size="mini" v-model="event.value"  value-key="event" @change="selectEvent(event,index)">
                     <el-option
                       v-for="item in eventOptions"
                       :value="item.value"
                       :label="item.label"
                       :key="item.value"
                       :title="item.title"
                     >
                     </el-option>
                   </el-select>
                   <span><i class="el-icon-plus"></i> <i v-show="index>0" class="el-icon-minus"></i></span>
                 </div>


               </el-form-item>
             </el-form>
            <el-form label-position="right"  label-width="100px" ref="executionListener"  :model="executionListener">
              <el-form-item label="类">
                <el-input size="mini" v-model="executionListener.implementation" placeholder="请输入类名" @input="handelData"></el-input>
              </el-form-item>
              <el-form-item label="代理表达式">
                <el-input size="mini" v-model="executionListener.delegateExpression"  @input="handelData" placeholder="请输入代理表达式"></el-input>
              </el-form-item>
              <el-form-item label="实体类型">
                <el-input size="mini" v-model="executionListener.businessAddress"  @input="handelData" placeholder="请输入业务服务地址"></el-input>
              </el-form-item>
            </el-form>
          </el-row>
          <span v-else>未选择事件监听器</span>
        </el-main>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close()" >取消</el-button>
        <el-button size="small" @click="save()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  @Component({
    name: "select-eventListener"
  })
  export default class eventListener extends Vue {
    visible = false;
    data = [] as any;
    active = false;
    searchForm={
    };
    tableData=[{}];
    iconSubGuid=""
    appOptions=[] as any;
    eventTableData=[
      {
        expression: "",
        implementation: "org.activiti.listener.ProcessEndListener",
        event: "ACTIVITY_COMPENSATE,ACTIVITY_COMPLETED",
        className: "org.activiti.listener.ProcessEndListener",
        delegateExpression: "",
        businessAddress:""
      }
    ] as any;
    executionListener={} as any;
    eventOptions=[{
      label:"ACTIVITY_COMPENSATE",
      value:"ACTIVITY_COMPENSATE",
      title:"活动将做为其他活动的补偿执行，事件将以活动的补偿执行为目标"
    },{
      label:"ACTIVITY_COMPLETED",
      value:"ACTIVITY_COMPLETED",
      title:"活动已成功完成"
    }]
    selectEventArr=[] as any
    async show() {
      this.visible = true;
      this.executionListener="";
    }
    created() {


    }
    //选中监听器
    handleEvent( row, column, rowIndex, columnIndex){
      this.executionListener=row
      this.selectEventArr=[]
      this.executionListener.event?.split(',').forEach((item,index)=>{
        const  obj={value:item}
        this.selectEventArr.push(obj)
      })
    }
    eventRow ({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    }
    //上移事件
    upEvent(){
      const index= this.executionListener.index;
      if (this.eventTableData.length > 1 && index !== 0) {
        this.eventTableData = this.swapItems(this.eventTableData, index, index - 1)
      }
    }
    //下移事件
    downEvent(){
      const index= this.executionListener.index;
      if (this.eventTableData.length > 1 && index !== (this.eventTableData.length - 1)) {
        this.eventTableData = this.swapItems(this.eventTableData, index, index + 1)
      }
    }
    //添加事件
    addEvent() {
      const obj={
        expression: "",
        implementation: "",
        event: "",
        className: "",
        delegateExpression: "",
        businessAddress:""
      }
      this.eventTableData.push(obj)
    }
    deleteEvent(){
      this.eventTableData=this.eventTableData.slice(0,-1)
    }
    //移动
    swapItems(arr, index1, index2){
      arr[index1] = arr.splice(index2,1,arr[index1])[0]
      return arr
    }
    //关闭/取消
    close() {
      this.visible = false;
    }
    //保存
    save(){
      //  处理数据
    }
  //  选中事件
    selectEvent(event,index){
      //字符串转数组
      const arr=this.executionListener.event.split(',');
      arr.splice(index,1,event.value)
      //数组转字符串
      const eventString=arr.toString();
      this.executionListener.event=eventString
      this.eventTableData[this.executionListener.index]=this.executionListener
    }
    handelData(){
      this.eventTableData[this.executionListener.index]=this.executionListener
    }
  }
</script>

<style lang="scss">
  .select-eventListener{
    .el-dialog {
      text-align: left;
      height: 90vh!important;
      width: 70% !important;
      .el-dialog__body{
        height:calc(100% - 110px) ;
        .el-main{
          padding: 10px;
          height: 100%;
        }
      }
      .eventWrap{
        height: calc(50% - 70px);
      }
      .eventButtons{
        margin: 10px 0;
      }
      .eventDetail{
        display: flex;
        .el-form{
          width: 50%;
        }
      }
      .execution-listener{
        min-height: 200px;
      }
    }

  }
</style>
