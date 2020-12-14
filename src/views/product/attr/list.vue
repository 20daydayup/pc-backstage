<template>
  <div>
    <Category @change="getAttrList" :disabled="!isShowList" />

    <el-card v-show="isShowList" style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="isShowList = false"
        >添加属性</el-button
      >

      <el-table :data="attrList" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" width="130" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称"> </el-table-column>

        <el-table-column label="属性列表值">
          <template v-slot="{ row }">
            <el-tag
              style="margin-left: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="warning" icon="el-icon-edit" @click="update(row)"
              >修改</el-button
            >
            <el-popconfirm
              @onConfirm="delAttr(row)"
              :title="`确定删除 ${row.valueName} 吗？`"
              ><el-button type="danger" icon="el-icon-delete" slot="reference"
                >删除</el-button
              ></el-popconfirm
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShowList" style="margin-top: 20px">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName" inline>
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-button @click="isShowList = true">取消</el-button>

      <el-table
        v-show="!isShowList"
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0 20px"
      >
        <el-table-column type="index" label="序号" width="130" align="center">
        </el-table-column>

        <!--
              事件修饰符：
                .native
                专门给组件绑定事件使用的
                会给组件中的第一个标签绑定相应的原生DOM事件
         -->
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="row.edit = false"
              autofocus
              ref="input"
              size="mini"
            ></el-input>
            <!-- 直接给对象添加新属性不是响应式数据, 通过this.$set添加的属性才是响应式 -->
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确定 ${row.valueName} 删除吗？`"
              @onConfirm="delAttrValue($index)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
/*
attrName: "手机分类"
attrValueList: Array(3)
categoryId: 61
categoryLevel: 3
id: 3621 */
import Category from "./category";
export default {
  name: "AttrList",
  data() {
    return {
      attrList: [],
      isShowList: true, //显示属性列表
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    async delAttr(row) {
      const result = await this.$API.attrs.deleteAttr(row.id); //获取数据发送请求
      if (result.code === 200) {
        this.getAttrList(this.category); //刷新数据
      } else {
        this.$message.error(result.message);
      }
    },
    editCompleted(row, index) {
      //如果添加的是空数据 ，就不添加一行
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    async save() {
      //保存
      const result = await this.$API.attrs.saveAttr(this.attr); //获取数据发送请求
      if (result.code === 200) {
        this.$message.success("更新数据成功");
        this.isShowList = true; //显示
        this.getAttrList(this.category); //刷新数据
      } else {
        this.$message.error(result.message);
      }
    },
    delAttrValue(index) {
      //删除属性
      this.attr.attrValueList.splice(index, 1);
    },
    addAttrValue() {
      // 添加新的一行，思路：数据放入一个对象（不能为空），添加数据时同步的，渲染dom是异步的
      this.attr.attrValueList.push({
        edit: true,
      }); //input框显示
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    edit(row) {
      // console.log(row);
      this.$set(row, "edit", true); //对象添加新属性（响应式数据）
      this.$nextTick(() => {
        //在dom创建之后
        this.$refs.input.focus(); //给input框设置聚焦属性
      });
    },
    update(attr) {
      // 深度克隆：防止对象中对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },

    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attrs.getAttrList(category);
      if (result.code === 200) {
        // console.log(result.data);
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  components: {
    Category,
  },
};
</script>
