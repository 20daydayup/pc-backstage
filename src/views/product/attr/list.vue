<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="categroy" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select v-model="categroy.categroy1Id" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="categroy.categroy2Id" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="categroy.categroy3Id" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table
        v-loading="loading"
        :data="trademarkList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="130" align="center">
        </el-table-column>
        <el-table-column prop="tmName" label="属性名称"> </el-table-column>
        <el-table-column label="属性列表值">
          <template> </template>
        </el-table-column>

        <el-table-column label="操作">
          <template>
            <el-button type="warning" icon="el-icon-edit">修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="open(row, scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      categroy: {
        categroy1Id: "",
        categroy2Id: "",
        categroy3Id: "",
      },
    };
  },
};
</script>
