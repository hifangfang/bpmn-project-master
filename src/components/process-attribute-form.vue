<template>
    <div class="process-attribute-form">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="流程标识">
                <el-input v-model="form.id" size="small"
                          @keyup.native="updateBaseInfo('id', form.id)"
                          @change="updateBaseInfo('id', $event)"
                ></el-input>
            </el-form-item>
            <el-form-item label="流程分类id">
                <el-input v-model="form.modelId" size="small"></el-input>
            </el-form-item>
            <el-form-item label="流程分类">
                <el-input v-model="form.id" size="small"></el-input>
            </el-form-item>
            <el-form-item label="流程名称">
                <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "process-attribute-form",
        props: {
            bpmnModeler: {
                type: Object,
                default: () => ({})
            },
        },
        data(){
            return{
                element:"",
                form:{

                },
                modeling:"",
                moddle:"",
                eventBus:"",
                bpmnFactory:"",
                elementRegistry:"",
                replace:"",
                selection:"",
                timer:""
            }
        },
        created(){

        },
        mounted(){

        },
        methods:{
            initData(element){
              this.element=element
              this.form=element.businessObject
              this.modeling = this.bpmnModeler.get("modeling");
              this.moddle = this.bpmnModeler.get("moddle");
              this.eventBus = this.bpmnModeler.get("eventBus");
              this.bpmnFactory = this.bpmnModeler.get("bpmnFactory");
              this.elementRegistry = this.bpmnModeler.get("elementRegistry");
              this.replace = this.bpmnModeler.get("replace");
              this.selection = this.bpmnModeler.get("selection");
            },
            updateBaseInfo(key, value){
                const shape = this.elementRegistry.get(this.element.id);
                let attrObj = {};
                attrObj[key] = value;
                this.modeling.updateProperties(shape, attrObj);
            }
        }
    }
</script>

<style lang="scss">
   .process-attribute-form{
       width: 15%;
       padding: 10px;
       background-color:#0B111E ;
       color: #ffffff;
       box-sizing: border-box;
       .el-form{
           .el-form-item{
               margin-bottom: 10px;
               .el-form-item__label{
                   color: #ffffff;
               }
           }
       }
   }
</style>
