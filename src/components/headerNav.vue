<template>
    <div class="headerNav">
        <div class="header-logo"></div>
        <span>{{platformTitle}}</span>
      <div class="tool">
        <template v-for="(item,index) in iconData">
          <el-tooltip class="item" effect="dark" :content="item.content" placement="bottom">
            <i @click="item.click()"  :class="item.className"></i>
          </el-tooltip>
        </template>
      </div>
    </div>
</template>

<script>
    export default {
       name: "headerNav",
       props:{'parent':Object},
       data(){
          return{
            platformTitle:"工作流设计器",
            iconData:[{
              content:"保存",
              click:this.saveModel,
              className:"iconfont el-icon-s-management"

            }, {
              content:"下载为XML文件",
              click:this.downloadProcessAsXml,
              className:"iconfont zwpt_complete"

            }, {
                content:"下载为SVG文件",
                click:this.downloadProcessAsSvg,
                className:"iconfont zwpt_sort"

              },
              {
                content:"下载为BPMN文件",
                click:this.downloadProcessAsBpmn,
                className:"iconfont zwpt_download1"

              },
              {
                content:"打开文件",
                click:this.importLocalFile,
                className:"el-icon-folder-opened"

              }, {
                content:"预览XML",
                click:this.previewProcessXML,
                className:"el-icon-view"

              }, {
                content:"预览JSON",
                click:this.previewProcessJson,
                className:"iconfont zwpt_nodeIcon_jsonshuju"

              },{
                content:"缩小视图",
                click:this.processZoomOut,
                className:"el-icon-zoom-out"

              },{
                content:"放大视图",
                click:this.processZoomIn,
                className:"el-icon-zoom-in"

              },{
                content:"重置视图并居中",
                click:this.processReZoom,
                className:"el-icon-c-scale-to-original"

              }, {
                content:"撤销",
                click:this.processUndo,
                className:"el-icon-refresh-left"

              },
              {
                content:"恢复",
                click:this.processRedo,
                className:"el-icon-refresh-right"

              },{
                content:"重新绘制",
                click:this.processRestart,
                className:"el-icon-refresh"

              }
              ],
          }
       },
      created(){

      },
      methods:{
        saveModel(){
          this.parent.saveModel()
        },
        downloadProcessAsXml(){
          this.parent.downloadProcessAsXml()
        },
        downloadProcessAsSvg(){
          this.parent.downloadProcessAsSvg()
        },
        downloadProcessAsBpmn(){
          this.parent.downloadProcessAsBpmn()
        },
        importLocalFile(){
          this.parent.$refs.refFile.click()
        },
        previewProcessXML(){
          this.parent.previewProcessXML()
        },
        previewProcessJson(){
          this.parent.previewProcessJson()
        },
        processZoomOut(){
          this.parent.processZoomOut()
        },
        processZoomIn(){
          this.parent.processZoomIn()
        },
        processReZoom(){
          this.parent.processReZoom()
        },
        processUndo(){
          this.parent.processUndo()
        },
        processRedo(){
          this.parent.processRedo()
        },
        processRestart(){
          this.parent.processRestart()
        }

      }
    }
</script>

<style lang="scss">
.headerNav{
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color:#0B111E ;
    display: flex;
    .header-logo{
        padding-top: 0px;
        line-height: 50px;
        height: 50px;
        background: url(../assets/images/header-logo.png) no-repeat 10px center;
        width: 50px;
    }
    span{
        display: inline-block;
        width: 150px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
    }
  .tool{
    margin-left: 150px;
    display: flex;
    i{
      display: inline-block;
      margin-right: 20px;
      color: #00FBC4;
      font-size: 18px;
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
