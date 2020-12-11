<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="trademarkList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="130" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>

      <el-table-column>
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="trademark-pagination"
      :page-sizes="[3, 6, 9]"
      :page-size="3"
      layout="prev, pager, next,jumper,sizes,total"
      :total="1000"
    >
    </el-pagination>

    <!-- 不会频繁的卸载，所以用这个，样式是显示隐藏切换 -->
  </div>
</template>

<script>
import { mounted } from "v-charts/lib/core";
// import {trademark} from "@api"//在main文件中经api挂载到原型上，可以不用引入直接使用
export default {
  name: "tradmark",
  data() {
    return {
      trademarkList: [], //所有数据
    };
  },
  methods: {
    async getPageList(page, limit) {
      //$API暴露的是个对象
      const result = await this.$API.trademark.getPageList(page, limit);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取品牌分页成功");
        this.trademarkList = result.data.records;
      } else {
        this.$message.error("获取分页失败");
      } //拦截器处理过了，不用try
    },
  },
  mounted() {
    this.getPageList(1, 3);
  },
};
</script>

<style lang="sass">
.trademark-img
  width: 150px

.trademark-pagination
  text-align: right

.el-pagination__sizes
  margin-left: 260px

.el-button
  margin-bottom: 30px
</style>
