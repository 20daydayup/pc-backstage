<template>
  <div>
    <!--自定义事件
      <Category
      @change="getAttrList" 当三级分类修改的时候触发。得到所有分类id
      @clearList="clearList"  当1级分类和2级分类触发的时候触发，清空列表
      :disabled="!isShowList" 决定select是否可以使用
    /> -->
    <Category :disabled="!isShowList" />

    <el-card v-show="isShowList" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="addAttr"
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
/*请求列表的参数
attrName: "手机分类"
attrValueList: Array(3)
categoryId: 61
categoryLevel: 3
id: 3621 */
import Category from "@/components/Category";
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
      category: {
        category1Id: "", // 请求参数设为响应式
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    clearList() {
      //重新选择一级分类的时候，清空列表

      this.attrList = []; // 清空数据
      this.category.category3Id = ""; // 禁用按钮
    },
    addAttr() {
      // 显示添加属性列表
      this.isShowList = false;
      this.attrName = "";
      this.attrValueList = [];
    },
    async delAttr(row) {
      // 删除属性
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
    //保存
    async save() {
      // 判断是否是添加
      const isAdd = !this.attr.id;

      const data = this.attr;

      if (isAdd) {
        // this.attr里面只有attrName和attrValueList
        // 还需要categoryId和categoryLevel
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }

      // 修改
      const result = await this.$API.attrs.saveAttr(data); //获取数据发送请求

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
  mounted() {
    //三级联动多个组件使用
    this.$bus.$on("change", this.getAttrList);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.getAttrList);
    this.$bus.$off("clearList", this.clearList);
  },
  components: {
    Category,
  },
};
</script>
