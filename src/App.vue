<template>
  <div id="bpmn-index">
    <my-process-designer
            :additional-model="labelEditing"
            process-type="activiti"
            ref="processDesigner"
            @element-click="elementClick"
            @init-finished="initModeler"
    />
    <my-process-panel :bpmn-modeler="modeler" :parent="this" prefix="activiti" class="process-panel" v-show="showPanl" />

  </div>
</template>

<script>
    import translations from "./translations";
    import MyProcessPanel from "../package/process-panel/ProcessPanel";

    export default {
        name: "App",
        components: {
            MyProcessPanel,
        },
        data() {
            return {
                xmlString: "",
                modeler: null,
                translationsSelf: translations,
                labelEditing: [{ labelEditingProvider: ["value", ""] }],
                showPanl:false,
            };
        },
        created() {
            // console.log(this.translationsSelf);
        },
        mounted(){

        },
        methods: {
            initModeler(modeler) {
                this.modeler = modeler;
                // console.log(this.modeler);
            },
            //画布监听事件点击
            elementClick(element) {
                if(element.type == 'bpmn:Process') {
                    this.showPanl=false
                }else{
                    this.element = element;
                    this.showPanl=true
                }
                console.log(element);
                // console.log(this.modeler.getDefinitions());
            },
            //隐藏右侧节点属性
            hiddenPanel(){
                this.showPanl=false
            },
            ProcessChanged(xml) {
                this.xmlString = xml;
            },
            testFunc() {
                this.$refs.processDesigner.processZoomIn(0.5);
            }
        }
    };
</script>

<style lang="scss">
  @import "./package/theme/element-variables.scss";
  body {
    overflow: hidden;
    margin: 0;
    padding: 0px;
    box-sizing: border-box;
  }
  #app {
    width: 100%;
    height: calc(100vh);
    box-sizing: border-box;
    display: inline-grid;
    grid-template-columns: auto max-content;
  }
  .my-process-designer {
    overflow: auto;
  }
  body,
  body * {
    /* 滚动条 */
    &::-webkit-scrollbar-track-piece {
      background-color: #fff; /*滚动条的背景颜色*/
      -webkit-border-radius: 0; /*滚动条的圆角宽度*/
    }
    &::-webkit-scrollbar {
      width: 10px; /*滚动条的宽度*/
      height: 8px; /*滚动条的高度*/
    }
    &::-webkit-scrollbar-thumb:vertical {
      /*垂直滚动条的样式*/
      height: 50px;
      background-color: rgba(153, 153, 153, 0.5);
      -webkit-border-radius: 4px;
      outline: 2px solid #fff;
      outline-offset: -2px;
      border: 2px solid #fff;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条的hover样式*/
      background-color: rgba(159, 159, 159, 0.3);
      -webkit-border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      /*滚动条的hover样式*/
      background-color: rgba(159, 159, 159, 0.5);
      -webkit-border-radius: 4px;
    }
  }
</style>
