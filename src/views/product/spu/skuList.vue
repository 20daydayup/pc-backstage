<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="sku" label-width="80px" :rules="rules" ref="skuForm">
        <el-form-item label="SPU名称">
          <span>{{ spu.spuName }}</span>
        </el-form-item>

        <el-form-item label="SKU名称" prop="skuName">
          <el-input
            placeholder="请输入SKU名称"
            v-model="sku.skuName"
          ></el-input>
        </el-form-item>

        <el-form-item label="价格(元)" prop="price">
          <el-input-number
            align="left"
            style="width: 300px"
            placeholder="请输入价格"
            controls-position="right"
            :min="0"
            :max="20000000"
            v-model="sku.price"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="重量(千克)" prop="weight">
          <el-input-number
            style="width: 300px"
            placeholder="请输入重量"
            controls-position="right"
            :min="0"
            :max="20000000"
            v-model="sku.weight"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="规格描述" prop="skuDesc">
          <el-input
            type="textarea"
            placeholder="请输入规格描述"
            v-model="sku.skuDesc"
          ></el-input>
        </el-form-item>

        <el-form-item label="平台属性" prop="skuAttrValueList">
          <div
            class="spulist-select-container"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-form-item :label="attr.attrName" style="display: inline-block">
              <el-select
                placeholder="请选择"
                v-model="sku.skuAttrValueList[index]"
                @change="clearValidate('skuAttrValueList')"
              >
                <el-option
                  v-for="attrVal in attr.attrValueList"
                  :key="attrVal.id"
                  :value="`${attr.id}-${attrVal.id}`"
                  :label="attrVal.valueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="销售属性" prop="skuSaleAttrValueList">
          <div
            class="spulist-select-container"
            v-for="(sale, index) in spuSaleAttrList"
            :key="sale.id"
          >
            <el-form-item :label="sale.saleAttrName">
              <el-select
                placeholder="请选择"
                v-model="sku.skuSaleAttrValueList[index]"
                @change="clearValidate('skuSaleAttrValueList')"
              >
                <el-option
                  v-for="Value in sale.spuSaleAttrValueList"
                  :key="Value.id"
                  :value="Value.id"
                  :label="Value.saleAttrValueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="图片列表" prop="skuImageList">
          <el-table
            border
            ref="multipleTable"
            :data="imageList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            row-key="id"
          >
            <el-table-column
              prop="isCheck"
              reserve-selection
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img
                  style="display: inline-block; width: 100%; height: 100px"
                  :src="scope.row.imgUrl"
                  :alt="scope.row.imgName"
                />
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  v-if="!row.isDefault"
                  type="primary"
                  size="mini"
                  @click="setDefault(row.id)"
                  >设为默认</el-button
                >
                <el-tag v-else type="success">默认</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SkuList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem,
      imageList: [], // 图片列表
      spuSaleAttrList: [], // 销售属性数据
      attrList: [], // 平台属性数据
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      rules: {
        // 表单验证规则
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入sku价格", trigger: "change" },
        ],
        weight: [
          { required: true, message: "请输入sku重量", trigger: "change" },
        ],
        skuDesc: [
          { required: true, message: "请输入sku描述", trigger: "change" },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
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

    cancel() {
      this.$emit("showList");
    },
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          const { category3Id, id: spuId, tmId } = this.spu;

          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });

          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );

          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;

          const result = await this.$API.sku.saveSku({
            ...this.sku,
            category3Id,
            spuId,
            tmId,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg,
          });

          if (result.code === 200) {
            this.$message.success("保存sku成功~");
            this.$emit("showList");
          } else {
            this.$message.error(result.message);
          }
        }
      });
      /*
      "category3Id": 0,
      "id": 0,
      "isSale": 0,
      "price": 0,2q1
      "skuAttrValueList": [
        {
          "attrId": 0,
          "id": 0,
          "skuId": 0,
          "valueId": 0
        }
      ],
      "skuDefaultImg": "string",
      "skuDesc": "string",
      "skuImageList": [
        {
          "id": 0,
          "imgName": "string",
          "imgUrl": "string",
          "isDefault": "string",
          "skuId": 0,
          "spuImgId": 0
        }
      ],
      "skuName": "string",
      "skuSaleAttrValueList": [
        {
          "id": 0,
          "saleAttrValueId": 0,
          "skuId": 0,
          "spuId": 0
        }
      ],
      "spuId": 0,
      "tmId": 0,
      "weight": "string"
      */
    },
    //清空表单验证
    clearValidate(prop) {
      //清空表单校验
      this.$refs.skuForm.clearValidate(prop);
    },
    //表单校验
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;

      if (
        skuAttrValueList.length !== attrList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error("请对所有平台属性进行选择"));
        return;
      }
      callback();
    },
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      //只选最后一个，length也会相等

      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error("请对所有销售属性进行选择"));
        return;
      }
      callback();
    },
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
      } = this;

      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张图片"));
        return;
      }
      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请设置一张默认图片"));
        return;
      }
      callback();
    },
    //设置默认图片
    setDefault(id) {
      this.clearValidate("skuImageList");

      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
    },
    //获取勾选图片
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList;
    },
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // [{name: '', url: ''}]
        this.imageList = result.data.map((img) => {
          return {
            ...img,
            ischeck: true,
          };
        });
        // console.log(this.imageList);
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
      const result = await this.$API.attrs.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("获取所有平台属性列表成功~");
        // 处理数据
        // console.log(result);
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
