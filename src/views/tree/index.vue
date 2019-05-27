<template>
  <el-container style="border: 1px solid #eee">
    <el-header style="text-align: left;">
      <el-button type="warning" style="margin-left: 10px;" icon="el-icon-edit" @click="edit" plain></el-button>
      <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true" plain></el-button>
      <el-dialog title="新增分组" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="formData" label-width="115px" label-position = "left">
          <el-form-item label="逻辑分组名称:">
            <el-input v-model="formData.label"></el-input>
          </el-form-item>
          <el-form-item label="请选择数据模型:">
            <el-select v-model="formData.data_model" placeholder="请选择数据模型">
              <el-option label="ND-Tunnel" value="ND-Tunnel"></el-option>
              <el-option label="ND-Group" value="ND-Group"></el-option>
              <el-option label="ND-PowerRoom" value="ND-PowerRoom"></el-option>
            </el-select>
            （不是监控节点时留空）
          </el-form-item>
          <el-form-item label="排序:">
            <el-input v-model="formData.id"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="formData.state" placeholder="请选择状态">
              <el-option label="开启" value="开启"></el-option>
              <el-option label="关闭" value="关闭"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产绑定:">
            <el-select v-model="formData.assets" placeholder="请选择绑定状态">
              <el-option label="已绑定" value="已绑定"></el-option>
              <el-option label="未绑定" value="未绑定"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述:">
            <el-input v-model="formData.details" type="textarea" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">确定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-button type="danger" style="margin-left: 10px;" icon="el-icon-delete" @click="DeletOprate" plain></el-button>
    </el-header>
    <el-container>
      <el-aside style="height: 880px; background-color: rgb(238, 241, 246)">
        <el-menu>
          <el-tree
            :data="tree_Data"
            show-checkbox
            accordion
            default-expand-all
            render-after-expand
            :check-strictly="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            node-key="id"
            ref="tree"
            :props="defaultProps"
            current-node-key ='1'
            @check-change = "checkChange"
            @node-click = "nodeClick"
          >
          </el-tree>
        </el-menu>
      </el-aside>
      <el-main>
        <el-table :data="tableData" row-key="id">
          <el-table-column prop="label" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="data_model" label="数据模型" align="center">
          </el-table-column>
          <el-table-column prop="state" label="状态" align="center">
          </el-table-column>
          <el-table-column prop="assets" label="资产绑定" align="center">
          </el-table-column>
          <el-table-column prop="details" label="描述" align="center">
          </el-table-column>
          <el-table-column prop="id" label="排序" align="center">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  // let id = 999999
  export default {
    data() {
      return {
        isCheck: true,
        filterText: '',
        tree_Data: [{
          id: 1,
          name: '演示综合管廊',
          data_model: 'fack',
          state: '开启',
          assets: '未绑定',
          details: '11111111',
          label: '演示综合管廊',
          children: [{
            id: 11,
            data_model: 'fack',
            state: '开启',
            assets: '未绑定',
            details: '',
            name: '综合仓',
            label: '综合仓',
            children: [
              {
                id: 111,
                data_model: 'fack',
                state: '开启',
                assets: '未绑定',
                details: '',
                name: '温湿度',
                label: '温湿度',
                children: [
                  {
                    id: 1111,
                    data_model: 'fack',
                    state: '开启',
                    assets: '未绑定',
                    details: '',
                    name: '1# 温湿度',
                    label: '1# 温湿度'
                  },
                  {
                    id: 1112,
                    data_model: 'fack',
                    state: '开启',
                    assets: '未绑定',
                    details: '',
                    name: '2# 温湿度',
                    label: '2# 温湿度'
                  }]
              },
              {
                id: 112,
                data_model: 'fack',
                state: '开启',
                assets: '未绑定',
                details: '',
                label: '风机',
                children: [
                  {
                    id: 1121,
                    data_model: 'fack',
                    state: '开启',
                    assets: '未绑定',
                    details: '',
                    name: '1# 风机',
                    label: '1# 风机'
                  },
                  {
                    id: 1122,
                    data_model: 'fack',
                    state: '开启',
                    assets: '未绑定',
                    details: '',
                    name: '2# 风机',
                    label: '2# 风机'
                  }]
              },
              {
                id: 113,
                label: '水泵',
                children: [
                  {
                    id: 1131,
                    label: '1# 水泵'
                  },
                  {
                    id: 1132,
                    label: '1# 水泵'
                  }]
              },
              {
                id: 114,
                label: '电子井盖',
                children: [
                  {
                    id: 1141,
                    label: '1# 电子井盖'
                  },
                  {
                    id: 1142,
                    label: '2# 电子井盖'
                  }]
              },
              {
                id: 115,
                label: '电控门锁',
                children: [
                  {
                    id: 1151,
                    label: '1# 电控门锁'
                  },
                  {
                    id: 1152,
                    label: '2# 电控门锁'
                  }]
              },
              {
                id: 116,
                label: '照明控制',
                children: [
                  {
                    id: 1161,
                    label: '1# 照明控制'
                  },
                  {
                    id: 1162,
                    label: '2# 照明控制'
                  }]
              },
              {
                id: 117,
                label: '气体检测',
                children: [
                  {
                    id: 1171,
                    label: '1# 气体检测'
                  },
                  {
                    id: 1172,
                    label: '2# 气体检测'
                  }]
              },
              {
                id: 118,
                label: '摄像头',
                children: [
                  {
                    id: 1181,
                    label: '1# 摄像头'
                  },
                  {
                    id: 1182,
                    label: '2# 摄像头'
                  }]
              },
              {
                id: 119,
                label: '红外监控',
                children: [
                  {
                    id: 1191,
                    label: '1# 红外监控'
                  },
                  {
                    id: 1192,
                    label: '2# 红外监控'
                  }]
              },
              {
                id: 110,
                label: '电能表',
                children: [
                  {
                    id: '1100',
                    label: '1# 电能表'
                  },
                  {
                    id: 1101,
                    label: '2# 电能表'
                  }]
              }]
          }, {
            id: 12,
            label: '电力仓',
            children: [
              {
                id: 120,
                label: '气体检测',
                children: [
                  {
                    id: 1201,
                    label: '1# 气体检测'
                  },
                  {
                    id: 1202,
                    label: '2# 气体检测'
                  }]
              },
              {
                id: 121,
                label: '电子井盖',
                children: [
                  {
                    id: 1211,
                    label: '1# 电子井盖'
                  },
                  {
                    id: 1212,
                    label: '2# 电子井盖'
                  }]
              },
              {
                id: 122,
                label: '风机',
                children: [
                  {
                    id: 1221,
                    label: '1# 风机'
                  },
                  {
                    id: 1222,
                    label: '2# 风机'
                  }]
              },
              {
                id: 123,
                label: '摄像头',
                children: [
                  {
                    id: 1231,
                    label: '1# 摄像头'
                  },
                  {
                    id: 1232,
                    label: '2# 摄像头'
                  }]
              },
              {
                id: 124,
                label: 'LED屏',
                children: [
                  {
                    id: 1241,
                    label: '1# LED屏'
                  },
                  {
                    id: 1242,
                    label: '2# LED屏'
                  }]
              },
              {
                id: 125,
                label: '红外监控',
                children: [
                  {
                    id: 1251,
                    label: '1# 红外监控'
                  },
                  {
                    id: 1252,
                    label: '2# 红外监控'
                  }]
              },
              {
                id: 126,
                label: '接地箱',
                children: [
                  {
                    id: 1261,
                    label: '1# 接地箱'
                  },
                  {
                    id: 1262,
                    label: '2# 接地箱'
                  }]
              },
              {
                id: 127,
                label: '智能巡检机器人',
                children: [
                  {
                    id: 1271,
                    label: '1# 智能巡检机器人'
                  },
                  {
                    id: 1272,
                    label: '2# 智能巡检机器人'
                  }]
              },
              {
                id: 128,
                label: '电缆接头',
                children: [
                  {
                    id: 1281,
                    label: '1# 电缆接头'
                  },
                  {
                    id: 1282,
                    label: '2# 电缆接头'
                  }]
              },
              {
                id: 129,
                label: '电控门锁',
                children: [
                  {
                    id: 1291,
                    label: '1# 电控门锁'
                  },
                  {
                    id: 1292,
                    label: '2# 电控门锁'
                  }]
              }]
          }
          ]
        }, {
          id: 2,
          label: '配电室',
          children: [{
            id: 21,
            label: '测试配电室',
            children: [
              {
                id: 210,
                label: '红外设备',
                children: [
                  {
                    id: 2100,
                    label: '1# 红外设备'
                  },
                  {
                    id: 2101,
                    label: '2# 红外设备'
                  }]
              },
              {
                id: 211,
                label: '温湿度设备',
                children: [
                  {
                    id: 2110,
                    label: '1# 温湿度设备'
                  },
                  {
                    id: 2111,
                    label: '2# 温湿度设备'
                  }]
              },
              {
                id: 212,
                label: '风机设备',
                children: [
                  {
                    id: 2120,
                    label: '1# 风机设备'
                  },
                  {
                    d: 2121,
                    label: '2# 风机设备'
                  }]
              },
              {
                id: 213,
                label: '气体检测',
                children: [
                  {
                    id: 2130,
                    label: '1# 气体检测'
                  },
                  {
                    id: 2131,
                    label: '2# 气体检测'
                  }]
              }]
          }, {
            id: 22,
            label: '迪森配电室',
            children: [
              {
                id: 220,
                label: '摄像头',
                children: [
                  {
                    id: 2200,
                    label: '1# 摄像头'
                  },
                  {
                    id: 2201,
                    label: '2# 摄像头'
                  }]
              },
              {
                id: 221,
                abel: '温度',
                children: [
                  {
                    id: 2210,
                    label: '1# 温度'
                  },
                  {
                    id: 2211,
                    label: '2# 温度'
                  }]
              },
              {
                id: 222,
                label: '门禁',
                children: [
                  {
                    id: 2220,
                    label: '1# 门禁'
                  },
                  {
                    id: 2221,
                    label: '2# 门禁'
                  }]
              },
              {
                id: 223,
                label: '风机',
                children: [
                  {
                    id: 2230,
                    label: '1# 风机'
                  },
                  {
                    id: 2231,
                    label: '2# 风机'
                  }]
              },
              {
                id: 224,
                label: '湿度',
                children: [
                  {
                    id: 2240,
                    label: '1# 湿度'
                  },
                  {
                    id: 2241,
                    label: '2# 湿度'
                  }]
              },
              {
                id: 225,
                label: '红外',
                children: [
                  {
                    id: 2250,
                    label: '1# 红外'
                  },
                  {
                    id: 2251,
                    label: '2# 红外'
                  }]
              },
              {
                id: 226,
                label: '温感',
                children: [
                  {
                    id: 2260,
                    label: '1# 温感'
                  },
                  {
                    id: 2261,
                    label: '2# 温感'
                  }]
              },
              {
                id: 227,
                label: '烟感',
                children: [
                  {
                    id: 2270,
                    label: '1# 烟感'
                  },
                  {
                    id: 2271,
                    label: '2# 烟感'
                  }]
              },
              {
                id: 228,
                label: '水侵',
                children: [
                  {
                    id: 2280,
                    label: '1# 水侵'
                  },
                  {
                    id: 2281,
                    label: '2# 水侵'
                  }]
              },
              {
                id: 229,
                label: '六氟化硫'
              }]
          }]
        }],
        tableData: [{
          id: 1,
          name: '演示综合管廊',
          data_model: 'fack',
          state: '开启',
          assets: '未绑定',
          details: '',
          label: '演示综合管廊'
        }],
        dialogFormVisible: false,
        formData: {
          label: '',
          name: '',
          data_model: '',
          state: '',
          assets: '',
          details: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          state: [
            { type: 'date', required: true, message: '请选择状态', trigger: 'change' }
          ]
        },
        formLabelWidth: '120px',
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      // 选中状态发生改变的时候
      checkChange(item, node, self) {
        if (node === true) {
          this.editcheckId = item.id
          this.$refs.tree.setCheckedKeys([item.id])
          // 通过getCheckedNodes()方法获取当前节点的信息
          this.tableData = this.$refs.tree.getCheckedNodes()
          if (this.editcheckId === item.id) {
            this.$refs.tree.setCheckedKeys([item.id])
          }
        }
      },
      // 节点被点击
      nodeClick(item, node, self) {
        this.editcheckId = item.id
        this.$refs.tree.setCheckedKeys([item.id])
      },
      // 增加
      append(data) {
        const newChild = { label: data.label, name: data.name, data_model: data.data_model, state: data.state, details: data.details, children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      // 当前选中的节点的前面增加新的节点
      // insertBefore(data, refNode) {
      //
      // },
      // 删除
      remove(node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      },
      // 修改
      edit(data) {
        // 修改
      },
      // 确认增加
      submitForm(formName) {
        console.log(this.formData)
        this.$refs.tree.append(this.formData)
        this.dialogFormVisible = false
        console.log(this.tree_Data)
        alert('创建成功')
      },
      // 删除
      DeletOprate() {
        if (this.$refs.tree.getCheckedNodes() == '') {
          alert('请选择您要删除的节点')
        } else {
          // console.log(this.$refs.tree.getCheckedNodes()[0])
          this.$refs.tree.remove(this.$refs.tree.getCheckedNodes(), this.$refs.tree.getCheckedNodes()[0])
        }
      }
    }
  }
</script>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
