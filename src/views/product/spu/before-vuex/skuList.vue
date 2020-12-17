<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="spu" label-width="80px" :rules="rules" ref="spuForm">
        <el-form-item label="SPU名称">
          <span>{{ spu.spuName }}</span>
        </el-form-item>

        <el-form-item label="SKU名称">
          <el-input placeholder="请输入SKU名称" v-model="spuName"></el-input>
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

        <el-form-item label="规格描述">
          <el-input type="textarea" placeholder="请输入规格描述"></el-input>
        </el-form-item>

        <el-form-item label="平台属性">
          <div
            class="spulist-select-container"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <span>{{ attr.attrName }}</span>
            <el-select v-model="spu.attrId" placeholder="请选择">
              <el-option
                v-for="attrVal in attr.attrValueList"
                :key="attrVal.id"
                :value="attrVal.id"
                :label="attrVal.valueName"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="销售属性">
          <div
            class="spulist-select-container"
            v-for="sale in spuSaleAttrList"
            :key="sale.id"
          >
            <span>{{ sale.saleAttrName }}</span>
            <el-select placeholder="请选择">
              <el-option
                v-for="Value in sale.spuSaleAttrValueList"
                :key="Value.id"
                :value="Value.id"
                :label="Value.saleAttrValueName"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="图片列表">
          <el-table
            border
            ref="multipleTable"
            :data="imageList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column prop="isCheck" type="selection" width="55">
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.imgUrl" alt="" />
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini">设为默认</el-button>
              <el-tag type="success">默认</el-tag>
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
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem,
      rules: {}, // 表单验证规则
      imageList: [], // 图片列表
      spuSaleAttrList: [], // 销售属性数据
      attrList: [], // 平台属性数据
    };
  },
  methods: {
    /*  category1Id:2
    category2Id:13
    category3Id:61
    description:"人生苦短及时行乐"
    id:210
    spuImageList:null
    spuName:"在我怀里游泳，简称怀泳"
    spuSaleAttrList:null
    tmId:250 */

    handleSelectionChange() {},
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // [{name: '', url: ''}]
        this.imageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性列表成功~");
        // 处理数据
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有平台属性列表
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList({
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取所有平台属性列表成功~");
        // 处理数据
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    // console.log(this.spu);
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.spulist-select-container
  display: inline-block
  margin-right: 20px
</style>
