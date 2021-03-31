<template>
  <div class="elementAttributes">
    <el-form size="mini" label-width="180px" label-suffix="：">
      <el-form-item label="批量转出">
        <el-switch
          v-model="activeElementBusinessObject.masstransfer"
          @change="updateBaseInfo('masstransfer', activeElementBusinessObject.masstransfer)"
          clearable>
        </el-switch>
      </el-form-item>
      <el-form-item label="退件">
        <el-switch v-model="activeElementBusinessObject.returnstep"
                   @change="updateBaseInfo('returnstep', activeElementBusinessObject.returnstep)"
                   clearable></el-switch>
      </el-form-item>
      <el-form-item label="撤销">
        <el-switch v-model="activeElementBusinessObject.revocation"
                   @change="updateBaseInfo('revocation', activeElementBusinessObject.revocation)"
                   clearable></el-switch>
      </el-form-item>
      <el-form-item label="跨环节退回">
        <el-switch v-model="activeElementBusinessObject.acrosslinkback"
                   @change="updateBaseInfo('acrosslinkback', activeElementBusinessObject.acrosslinkback)"
                   clearable></el-switch>
      </el-form-item>
    <!--  <el-form-item label="以行政区显示">
        <el-switch v-model="activeElementBusinessObject.displaybydepartmentshow"
                   @change="updateBaseInfo('displaybydepartmentshow', activeElementBusinessObject.displaybydepartmentshow)"
                   clearable></el-switch>
      </el-form-item>-->
      <el-form-item label="自动派件">
        <el-switch v-model="activeElementBusinessObject.automatictosend"
                   @change="updateBaseInfo('automatictosend', activeElementBusinessObject.automatictosend)"
                   clearable></el-switch>
      </el-form-item>
      <el-form-item label="按登记类型派件">
        <el-switch v-model="activeElementBusinessObject.registrationtypeautomatic"
                   @change="updateBaseInfo('registrationtypeautomatic', activeElementBusinessObject.registrationtypeautomatic)"
                   clearable></el-switch>
      </el-form-item>
      <el-form-item label="按序办件">
        <el-switch v-model="activeElementBusinessObject.sortdothing"
                   @change="updateBaseInfo('sortdothing', activeElementBusinessObject.sortdothing)"
                   clearable></el-switch>
      </el-form-item>
      <el-form-item label="退回重新办理">
        <el-switch v-model="activeElementBusinessObject.sendbacknewtransaction"
                   @change="updateBaseInfo('sendbacknewtransaction', activeElementBusinessObject.sendbacknewtransaction)"
                   clearable></el-switch>
      </el-form-item>
      <el-form-item label="超时自动转出">
        <el-switch v-model="activeElementBusinessObject.overtimeautomaticrollout"
                   @change="updateBaseInfo('overtimeautomaticrollout', activeElementBusinessObject.overtimeautomaticrollout)"
                   clearable></el-switch>
      </el-form-item>
      <el-form-item label="自动挂起">
        <el-switch
          v-model="activeElementBusinessObject.autosuspension"
          @change="updateBaseInfo('autosuspension', activeElementBusinessObject.autosuspension)"
          clearable></el-switch>
      </el-form-item>
      <el-form-item label="默认退还环节">
        <el-select
          v-model="activeElementBusinessObject.defaultbacktask"
          @change="updateBaseInfo('defaultbacktask', activeElementBusinessObject.defaultbacktask)"
          clearable>
          <el-option
            v-for="item in options"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="移交时人员必须选择">
        <el-select
          v-model="activeElementBusinessObject.transferselectperson"
          @change="updateBaseInfo('transferselectperson', activeElementBusinessObject.transferselectperson)"
          clearable>
          <el-option label="全局" value="global"/>
          <el-option label="是" value="true"/>
          <el-option label="否" value="false"/>
        </el-select>
      </el-form-item>
      <el-form-item label="多实例类型">
        <el-select
          v-model="loopCharacteristics.isSequential"
          @change="updateMultiInstance('isSequential',loopCharacteristics.isSequential)"
          clearable>
          <el-option label="无" value=""/>
          <el-option label="并行" value="false"/>
          <el-option label="串行" value="true"/>
        </el-select>
      </el-form-item>
      <el-form-item label="基数(多实例)">
        <el-input
          v-model="loopCharacteristics.loopCardinality.body"
          @change="updateMultiInstance('loopCardinality', loopCharacteristics.loopCardinality.body)"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="集合(多实例)">
        <el-input
          v-model="loopCharacteristics.collection"
          @change="updateMultiInstance('collection',loopCharacteristics.collection)"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="元素变量(多实例)">
        <el-input
          v-model="loopCharacteristics.elementVariable"
          @change="updateMultiInstance('elementVariable', loopCharacteristics.elementVariable)"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="完成条件(多实例)">
        <el-input
          v-model="loopCharacteristics.completionCondition.body"
          @change="updateMultiInstance('completionCondition',loopCharacteristics.completionCondition.body)"
          clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Ref,Watch} from "vue-property-decorator";
  import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper.js'

  @Component({
    name: "elementAttributes",
  })
  export default class ElementAttributes extends Vue {
    @Prop() bpmnModeler;
    @Prop() elementId;
    @Prop() activeElementBusinessObject;
    @Prop() options;
    masstransfer = false;
    loopCharacteristics = {
      completionCondition:{},
      loopCardinality:{}
    } as any;
    @Watch('activeElementBusinessObject', { deep: true })
    handleWatch() {
      console.log('监听上面数组的内容')
    }

      // 更新常规信息
    updateBaseInfo(key, value) {
      const shape = this.bpmnModeler.get("elementRegistry").get(this.elementId);
      debugger;
      let attrObj = {};
      attrObj[key] = value;
      this.bpmnModeler.get("modeling").updateProperties(shape, attrObj);
    }

    updateMultiInstance(){
      const element = this.bpmnModeler.get("elementRegistry").get(this.elementId);
      const moddle = this.bpmnModeler.get('moddle');
      let multiInstanceLoopCharacteristics = moddle.create('bpmn:MultiInstanceLoopCharacteristics');
      let isSequentialObj = this.loopCharacteristics.isSequential;
      if(isSequentialObj){
        let isSequential = false;
        if(isSequentialObj == "true"){
          isSequential = true
        }
        multiInstanceLoopCharacteristics['isSequential'] = isSequential;
        multiInstanceLoopCharacteristics['collection'] = this.loopCharacteristics.collection;
        multiInstanceLoopCharacteristics['elementVariable'] = this.loopCharacteristics.elementVariable;
        let loopCardinality =  elementHelper.createElement('bpmn:FormalExpression', { body: this.loopCharacteristics.loopCardinality.body }, multiInstanceLoopCharacteristics, this.bpmnModeler.get("bpmnFactory"));
        multiInstanceLoopCharacteristics['loopCardinality'] = loopCardinality;
        let completionCondition =  elementHelper.createElement('bpmn:FormalExpression', { body: this.loopCharacteristics.completionCondition.body }, multiInstanceLoopCharacteristics, this.bpmnModeler.get("bpmnFactory"));
        multiInstanceLoopCharacteristics['completionCondition'] = completionCondition;
      }else{
        multiInstanceLoopCharacteristics['isSequential'] = "";
      }

      this.bpmnModeler.get("modeling").updateProperties(element, { loopCharacteristics: multiInstanceLoopCharacteristics });
    }

    //初始化
    initPage(){
        if(this.activeElementBusinessObject.loopCharacteristics){
          this.loopCharacteristics = this.activeElementBusinessObject.loopCharacteristics
          console.log("============loopCharacteristics=============");
          console.log(this.loopCharacteristics);
          if(this.loopCharacteristics.isSequential){
            this.loopCharacteristics.isSequential = "true"
          }else{
            this.loopCharacteristics.isSequential = "false"
          }
        }else{
          this.loopCharacteristics.isSequential = "";
        }
    }
  }

</script>
<style lang="scss">
  .elementAttributes {

  }
</style>
