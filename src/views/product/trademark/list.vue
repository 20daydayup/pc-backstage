<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="130" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logo" alt="logo" />
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
  </div>
</template>

<script>
export default {
  name: "tradmark",
  data() {
    return {
      tableData: [
        {
          name: "王小虎",
          logo:
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1331594225,2237786756&fm=26&gp=0.jpg",
        },
      ],
    };
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
