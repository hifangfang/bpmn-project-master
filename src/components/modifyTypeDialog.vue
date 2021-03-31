<template>
    <el-dialog
            title="修改组件类型"
            :visible.sync="dialogFormVisible"
            append-to-body
            width="50%"
            class="modify-type-dialog"
            :close-on-click-modal="false"
    >
        <el-table
                :data="tableList"
                stripe
                height="300"
                :header-cell-style="{background:'#DDDFE5'}"
                @row-click="handle"
                class="type-table"
                highlight-current-row
                >
            <!--<el-table-column-->
                    <!--v-for="(data,index) in cols"-->
                    <!--:key="index"-->
                    <!--:prop="data.zdmc"-->
                    <!--:label="data.liemc">-->
            <!--</el-table-column>-->
            <el-table-column prop="icon" label="图例">
                <template slot-scope="scope">
                  <div :class="scope.row.icon +' img'"></div>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="名称" show-overflow-tooltip sortable>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="cancel()" >取消</el-button>
            <el-button size="small" @click="choose()" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>

    export default {
        name: "modify-type-dialog",
        props: {
            modeler: {
                type: Object,
                default: () => ({})
            }
        },
        data(){
            return{
                dialogFormVisible:false,
                tableList:[{
                    type: 'bpmn:UserTask',
                    title:'用户环节',
                    icon:"iconfont zwpt_yhhj"
                },
                {
                    type: 'bpmn:ExclusiveGateway',
                    title:'包容分支',
                    icon:"iconfont zwpt_brfz"
                },
                {
                    type: 'bpmn:EndEvent',
                    title:'结束节点',
                    icon:"iconfont zwpt_jssj"
                },
                {
                    type: 'bpmn:Task',
                    title:'普通任务',
                    icon:"bpmn-icon-task"
                },
                {
                    type: 'bpmn:BusinessRuleTask',
                    title:'businessRule任务',
                    icon:"bpmn-icon-business-rule"
                },
                {
                    type: 'bpmn:DataObjectReference',
                    title: '变量',
                    icon:"bpmn-icon-data-object"
                },
                {
                    type: 'bpmn:TextAnnotation',
                    title: '注释',
                    icon:"iconfont zwpt_wbzs"
                },
                ],
                cols:[{
                    zdmc:"",
                    liemc:"图例"
                },{
                    zdmc:"title",
                    liemc:"名称"
                }],
                element:"",
                row:""
            }
        },
        created(){

        },
        mounted(){

        },
        methods:{
            show(msg){
              debugger
               this.dialogFormVisible=true;
               this.element=msg
            },
            handle(row, event, column) {
              console.log(row, event, column);
              this.row=row
            },
            cancel(){
                this.dialogFormVisible=false
            },
            choose(){
                const { modeler, element } = this;
                const value = this.row.type;
                const bpmnReplace = modeler.get('bpmnReplace')
                bpmnReplace.replaceElement(element, {
                    type: value
                });
                this.dialogFormVisible=false
            },
        }
    }
</script>

<style lang="scss">
.modify-type-dialog{
    .el-dialog__header{
        border: 1px solid #dcdfe6;
    }
    .type-table{
        cursor: pointer;
        tr.current-row > td {
            background-color: #c9dde1 !important;
        }
        .img{
            width: 20px;
            height: 20px;
        }
    }
  .el-dialog__footer .dialog-footer{
    text-align: right!important;
  }
}

</style>
