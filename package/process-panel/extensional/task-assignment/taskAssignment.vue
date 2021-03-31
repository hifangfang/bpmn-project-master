<template>
  <div class="task-assignment-page ">
    <el-dialog title="任务分配" :visible="visible" @close="close">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色" name="role">
          <div class="dataDisplay">
            <div class="Frame-tree">
              <span class="frame-c">所有角色</span>
              <div class="filter-tree">
                <el-tree
                  ref="tree"
                  :props="defaultProps"
                  node-key="id"
                  :load="loadNode"
                  @node-click="handleNodeClick"
                  show-checkbox
                  lazy>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <svg class="icon myIconStyle" aria-hidden="true" style="color: red">
            <use :xlink:href="data.icon"></use>
          </svg>
          {{ data.name }}
        </span>
                </el-tree>
              </div>
            </div>
            <div class="change">
              <el-button type="info" plain @click="addNewRole"> >></el-button>
              <br/>
              <el-button style="margin-top: 10px" type="info" plain @click="removeExistRole"> <<</el-button>
            </div>
            <div class="Frame-table">
              <span class='frame-c'>已选角色<span class='frame-d'></span></span>
              <div class="filter-table">
                <!--<role-table :tableColumnList="tableColumnList" @getTableData="getTableData" ref="roleTable"-->
                            <!--:primaryColumnName="primaryColumnName" :pageDisplay="false"-->
                            <!--:dataTableHeight="dataTableHeight"></role-table>-->
              </div>
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="人员" name="user"></el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="saveTaskRole">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Ref} from "vue-property-decorator";
  import {TableColumn} from "element-ui";
  // import RoleTable from "@/components/component/TablePage.vue";
  // import {WorkflowApi} from "@/api/base/module/Workflow-api";
  // import {ProcessModelApi} from "@/views/bpmn/model/ProcessModel-Api";

  @Component({
    name: "task-assignment",
    components: {
      // RoleTable
    }

  })

  export default class taskAssignment extends Vue {
    visible = false;
    defaultProps = {
      label: 'name',
      children: 'children',
      isLeaf: 'leaf',
      id: 'id'
    };
    activeName = "role";
    tableColumnList: Partial<{ [key in keyof TableColumn]?: any }>[] = [
      {prop: 'ROLE_ID', type: 'selection', width: '40'},
      {prop: "ROLE_NAME", label: "角色名称", width: "150"},
      {prop: 'ROLE_GROUP_NAME', label: '角色组', width: ''},
    ];

    primaryColumnName = 'ROLE_ID';

    dataTableHeight = "400px"

    rootNode:any;

    //关闭窗口
    close() {
      this.visible = false;
    }

    //切换tab
    handleClick(tab, event) {

    }

    //添加角色到选定
   async addNewRole() {
      const nodes = (this.$refs.tree as any).getCheckedNodes();// 获得已选的节点集合
      let roleGroupArray = new Array();// 保存角色组的id
      let roleSelectedArray = new Array();// 保存已选角色的id
      let gridRows = (this.$refs.roleTable as any).tableData;// 已选角色集合
      if (gridRows) {
        for (let index = 0; index < gridRows.length; index++) {
          roleSelectedArray.push(gridRows[index].ROLE_ID);
        }
      }

      if (nodes.length > 0) {
        for (let i = 0; i < nodes.length; i++) {
          if ("rolegroup" == nodes[i].type) {// 是角色组
            if (typeof (nodes[i].children) == "undefined") {
              roleGroupArray.push(nodes[i].id);// 未展开的角色组id
            }
          } else if ("role" == nodes[i].type) {// 角色信息
            let roleid = nodes[i].id;
            let rolename = nodes[i].name;
            let pnode = (this.$refs.tree as any).getNode(nodes[i].pid);
            let rolegroupname = pnode.name;

            let isExist = false;// 判断添加的是否已经存在
            for (let j = 0; j < roleSelectedArray.length; j++) {
              if (roleid == roleSelectedArray[j]) {
                isExist = true;
                break;
              }
            }
            if (isExist) {
              continue;
            }
            let datarow = {
              "ROLE_ID": roleid,
              "ROLE_NAME": rolename,
              "ROLE_GROUP_NAME": rolegroupname
            };

            (this.$refs.roleTable as any).tableData.push(datarow)

          }
        }
        // 存在未展开的角色组
        if (roleGroupArray.length > 0) {
          // const roles = await WorkflowApi.getRolesByGroupIds(roleGroupArray)
          // let datasize = roles.length;
          // let roleSelectedArray1 = new Array();
          // let gridRows1 = (this.$refs.roleTable as any).tableData;// 已选角色集合
          // if (gridRows1) {
          //   for (let n = 0; n < gridRows1.length; n++) {
          //     roleSelectedArray1.push(gridRows1[n].ROLE_ID);
          //   }
          // }
          // for (let k = 0; k < datasize; k++) {
          //   let roleid = roles[k].ROLE_ID;
          //   let rolename = roles[k].ROLE_NAME;
          //   let rolegroupname = roles[k].ROLE_GROUP_NAME;
          //
          //   let isExist = false;// 判断添加的是否已经存在
          //   for (let m = 0; m < roleSelectedArray1.length; m++) {
          //     if (roleid == roleSelectedArray1[m]) {
          //       isExist = true;
          //       break;
          //     }
          //   }
          //   if (isExist) {
          //     continue;
          //   }
          //   let datarow1 = {
          //     "ROLE_ID": roleid,
          //     "ROLE_NAME": rolename,
          //     "ROLE_GROUP_NAME": rolegroupname
          //   };
          //
          //   (this.$refs.roleTable as any).tableData.push(datarow1)
          // }
        }
      } else {
        this.$message({
          message: '请选择需要添加的角色',
          type: 'warning'
        });
      }
    }

    //删除选定角色
    removeExistRole() {
      let checkStatus = (this.$refs.roleTable as any).$refs.multipleTable.selection;// 选中的行
      if (checkStatus.length == 0) {
        return this.$message({
          message: '请选择需要移除的角色',
          type: 'warning'
        });
      }
      let tableData = (this.$refs.roleTable as any).tableData;// 所有的数据

      for (let i = 0; i < checkStatus.length; i++) {
        let index = tableData.indexOf(checkStatus[i]);
        if (index > -1) {
          tableData.splice(index, 1);
        }
      }
    }

    //保存环节关联角色
    saveTaskRole() {
      let tableData = (this.$refs.roleTable as any).tableData;
      let value = "";
      if(tableData != null && tableData.length>0){
        tableData.forEach(item => {
          value += item.ROLE_ID+",";
        })
      }
      if(value.length>0){
        value = value.substring(0,value.length-1);
      }
      this.$emit("updateBaseInfo","candidateGroups",value);
      this.$emit("updateTaskAllocation",value);
      this.close();
    }
    async initTree(id) {
      const response = await ProcessModelApi.getRolesGroupTree("1449ef90-0033-11e5-82fe-40167e774587",id);
      let tree = [] as any[];
      response.forEach(item => {
        let icon;
        if (item.type == "rolegroup") {
          icon = "#zwpt_nav-jsgl-L1";
        } else if (item.type == "role") {
          icon = "#zwpt_nav-jsgl-L2";
        }
        let o = {
          id: item.id, name: item.name, icon: icon,
          pid: item.pid, type: item.type, leaf: !item.isParent
        } as any;
        tree.push(o);
      });
      return tree;
    }

    async loadNode(node, resolve) {
      let id;
      if (node.level === 0) {
        id = null;
        this.rootNode = node;
      } else {
        id = node.data.id;
      }
      // setTimeout(async () => {
      //   const response = await this.initTree(id);
      //   resolve(response);
      // }, 500);
    }

    async getTableData(roles) {
      let roleArray = roles?.split(',');
      const response = await ProcessModelApi.getRolesByIds(roleArray);
      (this.$refs.roleTable as any).initData(response);
    }

    handleNodeClick(){}

    initPage(data){
     this.getTableData(data);
    }
  }
</script>

<style lang="scss">
  .task-assignment-page {
    .zt_table {
      margin-top: 0px !important;
      height: 350px !important;
    }

    .dataDisplay {
      line-height: 100%;
      height: calc(100%);
      display: flex;
      font-size: 14px;

      .change {
        margin: 20% 10px;
      }

      .Frame-tree {
        height: 100%;
        text-align: left !important;

        .frame-c {
          height: 20px;
          display: block
        }

        .filter-tree {
          border: solid 1px #c7c7c7;;
          height: calc(100% - 20px);
          overflow: auto;
        }

        width: calc((100% - 90px) / 2);
      }

      .Frame-table {
        text-align: left !important;

        .frame-c {
          height: 20px;
          display: block
        }

        .frame-d {
          display: inline-block;
          width: calc(100% - 60px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: red;
        }

        .filter-table {
          width: 100%;
          height: calc(100% - 20px);

          .table-page {
            height: 100%;

            .main {
              height: 100%;

              .zt_table {
                height: 100%;
              }
            }
          }
        }

        width: calc((100% - 150px) / 2);;
      }
    }

    .foot-button {
      margin-top: 10px;
    }

    .el-dialog {
      height: 600px;
      position: relative;
      margin: 0 auto 50px;
      background: #FFFFFF;
      border-radius: 2px;
      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 60%;
      .el-dialog__body{
        height: calc(100% - 110px);
        .el-tabs{
          height:100%;
          .el-tabs__header{
            border: 1px solid #E4E8ED;
          }
          .el-tabs__content{
            height: calc(100% - 80px);
            margin: 0px;
            padding: 10px;
            border: 1px solid #E4E8ED;
            border-top: none;
            .el-tab-pane{
              height: 100%;
            }
          }
        }
      }

    }

    .foot-button {
      margin-top: 10px;
      float: right;
    }

    .el-tree {
      position: relative;
      cursor: default;
      background: #FFFFFF;
      color: #606266;
      height: 350px;
    }
  }
</style>
