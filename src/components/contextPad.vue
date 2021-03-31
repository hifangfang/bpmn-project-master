<template>
    <div class="contextPad" :class="show?'replaceStyle':'normalStyle'">
        <el-cascader-panel ref="cascader"    @visible-change="visibleChange" :options="options">
            <template slot-scope="{ node, data }">
                <span @click="handleChange(data.value)">{{ data.label }}</span>
            </template>
        </el-cascader-panel>
    </div>
</template>

<script>
    import {bus} from '../utils/bus'
    // import createAction from "../views/bpmn/customBpmn/context-pad/CustomContextPadProvider"
    export default {
        name: "contextPad",
        data(){
            return{
                options: [
                    {
                        label: '开始事件',
                        children: [ {
                            label: '计时器事件',
                            className: 'icon-custom bpmn-icon-start-event-timer',
                            type: 'bpmn:TimerEventDefinition'
                        }]
                    },
                    {
                        label: '环节',
                        children: [{
                            label: '用户环节',
                            className: 'icon-custom icon-custom-task',
                            type: 'bpmn:Task',
                        }]
                    },
                    {
                        label: '子流程',
                        children: []
                    },
                    {
                        label: '分支',
                        children: [{
                        }]
                    },
                    {
                        label: '边界事件',
                        children: [{
                        }]
                    },
                    {
                        label: '中间捕获事件',
                        children: [{
                        }]
                    },
                    {
                        label: '中间抛出事件',
                        children: [{
                        }]
                    },
                    {
                        label: '结束事件',
                        children: [{
                        }]
                    },
                    {
                        label: '永道',
                        children: [{
                        }]
                    },
                    {
                        label: '自定义',
                        children: [{
                        }]
                    }
                ],
                element:"",
                show:false,
                selectedIds:[]
            }
        },
        created(){
        this.initData()
        },
        mounted(){
            this.$bus.$on("changeElement",(element)=>{
                this.show=true
                this.element=element
            })
            this.$bus.$on("hiddenContext",()=>{
                debugger
                this.show=false

            })
        },
        methods:{
            initData(){
              this.options.forEach((item,index)=>{
                  item.children.forEach((child,childIndex)=>{
                      const obj={
                          label:child.label,
                          className:child.className,
                          type:child.type
                      }
                      child.value=obj
                  })
              })
            },
            handleChange(value){
                console.log(value,this.parentElement)
                bus.$emit('create',value,this.element)

            },
            visibleChange(value){
                debugger
                if(!value){
                    debugger
                    console.log(this.$refs.cascader)
                    // 清空选中的节点
                    this.$refs.cascader.$refs.panel.clearCheckedNodes();
                    // 设置为空可以让节点不高亮显示
                    this.$refs.cascader.$refs.panel.activePath = [];
                }
            }
        }
    }
</script>

<style lang="scss">
    .normalStyle{
        position: fixed;
        left: -1000px;
    }
    .djs-overlays{
       margin-left: 20px;
    }
    .contextPad{
       z-index: 1000;
       background-color: white;
       margin-left: 30px;
    }
    .djs-visual{
        border: 1px solid red;
    }
</style>
