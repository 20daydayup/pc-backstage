<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="sku" label-width="80px" :rules="rules" ref="skuForm">
        <el-form-item label="SPU名称">
          <span>{{ 111 }}</span>
        </el-form-item>

        <el-form-item label="SKU名称">
          <el-input placeholder="请输入SKU名称" v-model="sku"></el-input>
        </el-form-item>

        <el-form-item label="价格(元)">
          <el-input-number
            align="left"
            style="width: 300px"
            placeholder="请输入价格"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="重量(千克)">
          <el-input-number
            style="width: 300px"
            placeholder="请输入重量"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="规格描述" prop="desc">
          <el-input type="textarea" v-model="sku"></el-input>
        </el-form-item>

        <el-form-item label="平台属性">
          <div>
            <span>{{ 111 }}</span>
            <el-select v-model="sku" placeholder="请选择">
              <el-option value="111" label="111"></el-option>
              <el-option value="222" label="222"></el-option>
            </el-select>
          </div>
          <div>
            <span>{{ 111 }}</span>
            <el-select v-model="sku" placeholder="请选择">
              <el-option value="111" label="111"></el-option>
              <el-option value="222" label="222"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="销售属性">
          <div>
            <span>{{ 111 }}</span>
            <el-select v-model="sku" placeholder="请选择">
              <el-option value="111" label="111"></el-option>
              <el-option value="222" label="222"></el-option>
            </el-select>
          </div>
          <div>
            <span>{{ 111 }}</span>
            <el-select v-model="sku" placeholder="请选择">
              <el-option value="111" label="111"></el-option>
              <el-option value="222" label="222"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="销售属性">
          <el-table
            border
            ref="multipleTable"
            :data="[]"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.imgUrl" alt="" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="address" label="操作" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      sku: {},
      rules: {},
    };
  },
  methods: {
    handleSelectionChange() {},
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  margin-right: 20px
</style>
