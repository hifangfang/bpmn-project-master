<template>
  <div class="panel-tab__content element-rules">
    <div class="add-rule-button">
      <el-button type="primary" plain size="mini"  @click="onTaskRule"><i class="iconfont zwpt_add"></i>新增绑定规则</el-button>
    </div>
    <div class="title">
      <span>校验规则</span>
    </div>
    <!--<taskRulePage ref="taskRulePage"></taskRulePage>-->
    <el-table
      :data="tableData">
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column prop="ruleName" label="规则名"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="delRule">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  // import taskRulePage from "../../../../base/pages/processrule/taskrule-page.vue";
  // import {ProcessRuleApi} from "@/api/base/module/ProcessRule-api";
  import {Message} from "element-ui";
  @Component({
    name: "ElementRules",
    components:{
      // taskRulePage
    }
  })
  export default class ElementRules extends Vue {
    @Prop() bpmnModeler;
    @Prop() elementId;
    taskArray;
    tableData = [] as any;
    onTaskRule(){
      (this.$refs.taskRulePage as any).show();
      const response = (this.$refs.taskRulePage as any).initTable(this.taskArray);
      (this.$refs.taskRulePage as any).init(this.taskArray,response.data);
    }
    async initPage(){
      this.taskArray = [];
      const element = this.bpmnModeler.get("elementRegistry").get(this.elementId);
      let taskObj = {
        "id": this.elementId,
        "proKey":  element.parent.id,
        "caption": element.businessObject.name,
        "parentId":  element.parent.id
      };
      this.taskArray.push(taskObj);
      // const response = await ProcessRuleApi.getProcessRuleByAid(this.taskArray);
      // this.tableData = response.data;
    }
    delRule(data){
      // const response = ProcessRuleApi.delProcessRuleByAid(this.elementId) as any;
      // if (response.status != 200) {
      //   this.$message({
      //     message: "绑定规则删除失败",
      //     type: 'error',
      //     duration: 3 * 1000
      //   });
      // }else{
      //   this.$message({
      //     message: "绑定规则删除成功",
      //     type: 'error',
      //     duration: 3 * 1000
      //   });
      //   let newTableData = [] as any ;
      //   this.tableData.forEach((item)=>{
      //     if(data.ruleId !== item.ruleId){
      //       newTableData.push(item);
      //     }
      //   })
      //   this.tableData = newTableData;
      // }
    }
  }
</script>

<style>

</style>
