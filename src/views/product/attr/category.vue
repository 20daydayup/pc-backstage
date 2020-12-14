<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="category" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="SelectCategroy1"
            :disabled="disabled"
          >
            <el-option
              v-for="c1 in category1List"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="SelectCategroy2"
            :disabled="disabled"
          >
            <el-option
              v-for="c2 in category2List"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="SelectCategroy3"
            :disabled="disabled"
          >
            <el-option
              v-for="c3 in category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Categroy",
  props: ["disabled"], //添加修改等操作时，三级分类禁用
  data() {
    return {
      category: {
        category1Id: "", // 1级分类id
        category2Id: "",
        category3Id: "",
      },
      category1List: [], // 1级分类数据
      category2List: [],
      category3List: [],
    };
  },
  methods: {
    // 处理输入框的change事件
    async SelectCategroy1(category1Id) {
      // 重新选择时将数据为空
      this.category2List = [];
      this.category3List = [];
      this.category.category2Id = "";
      this.category.category3Id = "";
      const result = await this.$API.attrs.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async SelectCategroy2(category2Id) {
      this.category3List = [];
      this.category.category3Id = "";
      const result = await this.$API.attrs.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async SelectCategroy3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      // console.log(category);

      // 子组件给父组件传递参数 自定义事件 ,由父组件发送请求（因为父组件修改完成后需要重新请求数据）
      this.$emit("change", category);
    },
  },
  async mounted() {
    const result = await this.$API.attrs.getCategory1();
    // console.log(result);
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>

<style lang="less" scoped>
</style>
