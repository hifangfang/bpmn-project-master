<template>
  <div class="processAttribute" v-show="show">
    <ul class="attrTitle">
      <li>流程属性</li>
      <span @click="operateLock">
         <i  v-if="isLock" title="解锁" class="iconfont el-icon-lock"></i>
         <i  v-else title="锁定" class="iconfont el-icon-unlock"></i>
      </span>
    </ul>
    <div class="attrContent">
      <el-form ref="form" :model="form" label-width="105px">
        <el-form-item label="流程标识">
          <el-input v-model="process_id" size="small" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="流程分类ID">
          <el-input v-model="targetNamespace" size="small"></el-input>
        </el-form-item>
        <el-form-item label="流程分类">
          <el-input v-model="process_categoryname" size="small" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input v-model="process_name" size="small" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.documentation" size="small"></el-input>
        </el-form-item>
        <el-form-item label="办理时限">
          <el-input-number size="mini" v-model="day" controls-position="right" @change="handleChange" :min="0"
                           :max="10"></el-input-number>
          <span>天</span>
          <el-input-number size="mini" v-model="hour" controls-position="right" @change="handleChange" :min="0"
                           :max="59"></el-input-number>
          <span>时</span>
          <el-input-number size="mini" v-model="minute" controls-position="right" @change="handleChange" :min="0"
                           :max="59"></el-input-number>
          <span>分</span>
        </el-form-item>
        <el-form-item label="流程创建者">
          <el-input v-model="form.process_author" size="small"></el-input>
        </el-form-item>
        <el-form-item label="流程版本字符串(仅文档)" class="fold_label">
          <el-input v-model="form.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否自动派件">
          <el-switch v-model="form.selfmotiondelivery" size="small"></el-switch>
        </el-form-item>
        <el-form-item label="是否按登记类型派件" class="fold_label">
          <el-switch v-model="form.categorydelivery" size="small"></el-switch>
        </el-form-item>
        <el-form-item label="是否按序办件">
          <el-switch v-model="form.sortdothing" size="small"></el-switch>
        </el-form-item>
        <el-form-item label="执行监听器">
          <el-button size="small" type="primary" @click="openWindow()">{{taskListener}}</el-button>
        </el-form-item>
        <el-form-item label="事件监听器">
          <el-button size="small" type="primary" @click="openEventWindow()">0个事件监听器</el-button>
        </el-form-item>
      </el-form>
      <el-collapse v-model="activeName">
        <el-collapse-item title="表单配置" name="form">

          </el-collapse-item>
        </el-collapse>
      </div>
      <SelectProcessLisener ref="selectProcessLisener" :bpmnModeler="bpmnModeler" @updateProcessLisener="updateProcessLisener" :element-id="process_id" :listeners="extensionElements"></SelectProcessLisener>
      <selectEventListener ref="selectEventListener" ></selectEventListener>
    </div>
</template>

<script>
    import SelectProcessLisener from "./selectProcessLisener.vue";
    import  selectEventListener from "./selectEventListener";
    export default {
        name: "processAttributeForm",
        props: {
            bpmnModeler: {
                type: Object,
                default: () => ({})
            },
        },
        components:{
          SelectProcessLisener,
          selectEventListener
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
                timer:"",
                activeName:"form",
                day: 0,
                hour: 0,
                minute: 0,
                processListeners:"",
                listenerLength:0,
                targetNamespace:"", //流程分类id
                process_namespace:"",//流程分类名称
                process_name:"",//流程名称
                process_id:"",//流程定义key
                taskListener:"未配置执行监听器",//监听按钮value
                extensionElements:{},
                process_categoryname:"",
                isLock:true,  //锁定侧边栏流程属性
                show:true
            }
        },
        created(){
          this.$bus.$on("showProcessAttr",(element)=>{
            console.log(element)
            this.showProcessAttribute(element)
          })

    },
    mounted() {

    },
    methods: {
      initData(element) {
        this.element = element
        this.form = element.businessObject.$attrs;
        this.modeling = this.bpmnModeler.get("modeling");
        this.moddle = this.bpmnModeler.get("moddle");
        this.eventBus = this.bpmnModeler.get("eventBus");
        this.bpmnFactory = this.bpmnModeler.get("bpmnFactory");
        this.elementRegistry = this.bpmnModeler.get("elementRegistry");
        this.replace = this.bpmnModeler.get("replace");
        this.selection = this.bpmnModeler.get("selection");
        let timeLimit = this.form.timelimit;
        this.targetNamespace = element.businessObject.$parent.targetNamespace;
        this.process_categoryname = "流程分类";
        this.process_name = "流程名称";
        this.process_id = element.businessObject.id;
        this.day = timeLimit.substring(0,timeLimit.indexOf("d"));
        this.hour = timeLimit.substring(timeLimit.indexOf("d")+1,timeLimit.indexOf("h"));
        this.minute = timeLimit.substring(timeLimit.indexOf("h")+1,timeLimit.length-1);
        const extensionElements = element.businessObject.extensionElements;
        if(extensionElements){
          this.extensionElements = extensionElements;
        }
        if(this.extensionElements){
          let values = this.extensionElements.values;
          if(values != null && values.length>0){
            this.taskListener = values.length+"个执行监听";
          }else{
            this.taskListener = "未配置执行监听器";
          }
        }else{
          this.taskListener = "未配置执行监听器";
        }


      },
      updateBaseInfo(key, value) {
        const shape = this.elementRegistry.get(this.element.id);
        let attrObj = {};
        attrObj[key] = value;
        this.modeling.updateProperties(shape, attrObj);
      },
      handleChange() {
        let timeLimit = this.day + "d" + this.hour + "h" + this.minute + "m";
        this.form.timelimit = timeLimit;
      },
      //执行监听器
      openWindow() {
        this.$refs.selectProcessLisener.show();
      },
      //事件监听器
      openEventWindow(){
        this.$refs.selectEventListener.show();
      },
      //更新流程监听
      updateProcessLisener(extensionElements){
        this.element.businessObject.extensionElements =  extensionElements;
        let values = extensionElements.values;
        if(values != null && values.length>0){
          this.taskListener = values.length+"个执行监听";
        }else{
          this.taskListener = "未配置执行监听器";
        }
    },
      //锁定
      operateLock(){
        this.isLock=!this.isLock
      },
      showProcessAttribute(element){
        debugger
        if(element.type=="bpmn:Process"){
          this.show=true
        }
        if(!this.isLock&&element.type!="bpmn:Process"){
          this.show=false
        }
      }
    }
  }
</script>

<style lang="scss">
   .processAttribute{
       width: 300px;
       height:100%;
       background-color:#0B111E ;
       color: #ffffff;
       box-sizing: border-box;
       .attrTitle{
         width: 100%;
         padding: 5px;
         display: flex;
         background-color: #222B36;
         font-size: 18px;
         font-family: "SourceHanSansSC-Normal";
         font-weight: 400;
         color: #FFFFFF;
         box-sizing: border-box;
         position: relative;
         li{
           height: 30px;
           line-height: 30px;
         }
         span{
           display: inline-block;
           height: 30px;
           line-height: 30px;
           position: absolute;
           right: 10px;
           i{
             color: #00FBC4;
           }
         }
       }
     .attrContent{
       height: calc(100% - 80px);
       overflow: auto;
       .el-form{
         padding: 5px 10px;
         .el-form-item{
           margin-bottom: 10px;
           .el-form-item__label{
             color: #ffffff;
             padding:0 5px 0 0;
           }
           .el-form-item__content{
             background-color: #010913;
             .el-input__inner{
               background-color: #010913;
               font-size: 14px;
               font-family: "SourceHanSansSC-Normal";
               font-weight: 400;
               color: #FFFFFF;
             }
           }
         }
         .fold_label .el-form-item__label{
           line-height: 20px;
         }
       }

       .el-collapse{
         border: none;
         .el-collapse-item{
           background-color: #010913;
           .el-collapse-item__header{
             height: 30px;
             line-height: 30px;
             padding: 5px;
             border: none;
             background-color: #222B36;
             font-size: 18px;
             font-family: "SourceHanSansSC-Normal";
             font-weight: 400;
             color: #FFFFFF;
           }
           .el-collapse-item__wrap{
             background-color: #010913;
             border: none;
           }
         }
       }
       .el-input{
         .el-input__inner{
           border: 1px solid #4E5053;
         }
       }
       .el-input-number{
         margin-right: 5px;
       }
       .el-button{
         width: 100%;
         background: #061C22;
         border-radius: 4px;
         border: 1px solid #0C605C;
         color: #00FBC4;
         cursor: pointer;
       }
     }


  }

  .attrContent::-webkit-scrollbar {
    width: 0px !important;
  }
</style>
