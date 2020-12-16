<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="$emit('showUpdataList', { category3Id: category.category3Id })"
        >添加属性</el-button
      >
      <!-- 有没有三级id时禁用按钮 -->
      <el-table :data="spuList" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" width="130" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU名称"> </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$emit('showUpdataList', { category3Id: category.category3Id })"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('showUpdataList', row)"
            ></el-button>
            <!-- 数据spuUpdateList 也需要使用-->
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-popconfirm title="确定删除吗？"
              ><el-button
                type="danger"
                icon="el-icon-delete"
                slot="reference"
                size="mini"
              ></el-button
            ></el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 10px"
        class="trademark-pagination"
        @size-change="getPageList(page, $event)"
        @current-change="getPageList($event, limit)"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-page="page"
        layout="prev, pager, next,jumper,sizes,total"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { TimeSelect } from "element-ui";
export default {
  name: "SpuShowList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      spuList: [], //商品列表
    };
  },
  methods: {
    // 当选中1级或2级分类触发
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
    // 处理category的change（当选中三级分类时触发）
    handelCategoryChange(category) {
      //将函数从$on中提取出来
      //触发事件,会将分类id传递过来
      this.category = category;
      this.getPageList(this.page, this.limit);
    },
    //获取SPU分页列表
    async getPageList(page, limit) {
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        // console.log(result);
        this.spuList = result.data.records;
        this.total = result.data.total;
        // this.limit = result.data.limit;
        this.$message.success("获取SPU分页列表成功");
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.$bus.$on("change", this.handelCategoryChange);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    //切换组件是会卸载，连续切换会一直绑定、触发事件
    // 通常情况下：清除绑定的全局事件
    this.$bus.$off("change", this.handelCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style lang="less" scoped>
</style>
