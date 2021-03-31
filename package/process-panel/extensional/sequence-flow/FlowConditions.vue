<template>
  <el-dialog title="连接线条件" :visible="visible" @close="close" :close-on-click-modal="false">
    <el-form label-width="90px">
      <el-form-item label="条件表达式">
        <el-input type="textarea" v-model="formalExpression">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close()">取消</el-button>
      <el-button size="small" @click="save()" type="primary">保存</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Ref} from "vue-property-decorator";

  @Component({
    name: "FlowConditions"
  })
  export default class FlowConditions extends Vue {
    visible = false;
    formalExpression = "";
    conditionExpression = {
      $type: "bpmn:FormalExpression",
      body:""
    } as any;

    initPage(obj) {
      this.conditionExpression = obj;
      this.visible = true;
      this.formalExpression = obj.body;
    }

    close() {
      this.visible = false;
    }

    save() {
      this.conditionExpression.body = this.formalExpression;
      this.$emit("updateBaseInfo","conditionExpression",this.conditionExpression);
      this.$emit("updateFlowConditions",this.formalExpression);
      this.close();
    }
  }
</script>

<style lang="scss">

</style>
