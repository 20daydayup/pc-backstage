 <template>
  <div>
    <el-card style="margin-top: 20px">
      <!--
      表单校验：
        1. 整体form表单中
        2. 通过prop属性来定义表单项名称
        3. 定义表单校验规则
          - 在data中定义rules
          - 绑定给form
        4. 校验表单
          - 给form绑定ref
          - this.$refs.spuForm.validate 校验表单
     -->
      <el-form :model="spu" label-width="80px" :rules="rules" ref="spuForm">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spu.spuName"
          ></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="tmId" inline>
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :value="tm.id"
              :label="tm.tmName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            prop="description"
            placeholder="请输入SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="SPU图片" prop="imageList">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="formatImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>

        <!--
        prop="saleAttrId" 将来作为表单校验
       -->
        <el-form-item prop="sale" label="销售属性" style="margin-top: 20px">
          <!--方法一  <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.saleAttrId"
            :disabled="!spu.saleAttrId" 之前的数据
          > 方法二：将需要的数据放v-model (当前选中的数据)-->
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.sale"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :key="sale.id"
              :label="sale.name"
              :value="`${sale.name}-${sale.id}`"
            ></el-option>
          </el-select>

          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addSaleAttr"
            :disabled="!spu.sale"
            >添加属性值</el-button
          >

          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column
              type="index"
              label="序号"
              width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150">
            </el-table-column>

            <el-table-column label="属性列表值">
              <template v-slot="{ row }">
                <el-tag
                  @close="delTag(row, i)"
                  closable
                  style="margin-left: 5px"
                  v-for="(attrVal, i) in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  >{{ attrVal.saleAttrValueName }}</el-tag
                >
                <el-input
                  v-if="row.edit"
                  v-model="saleAttrValueText"
                  @blur="editCompleted(row)"
                  @keyup.enter.native="editCompleted(row)"
                  autofocus
                  ref="input"
                  style="width: 80px"
                ></el-input>
                <el-button
                  v-else
                  icon="el-icon-plus"
                  size="mini"
                  @click="edit(row)"
                  >添加</el-button
                >
              </template>
            </el-table-column>

            <el-table-column label="操作" width="260">
              <template v-slot="{ row, $index }">
                <el-popconfirm
                  @onConfirm="delSaleAttr($index)"
                  :title="`确定删除${row.saleAttrName}吗？`"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    slot="reference"
                    size="mini"
                  ></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="this.$emit('showList')">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 图片放大对话框 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item, //行数据
      trademarkList: [], //所有品牌数据
      imageList: [], // 所有图片列表
      dialogImageUrl: "", //图片的地址
      dialogVisible: false, //显示图片预览
      saleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], //当前SPU销售属性列表
      saleAttrValueText: "", //input
      rules: {
        spuName: [{ required: true, message: "请输入品牌名称" }],
        tmId: [{ required: true, message: "请选择品牌" }],
        description: [{ required: true, message: "请输入描述" }],
        imageList: [{ required: true, validator: this.imageListValidator }],
        sale: [{ required: true, validator: this.saleValidator }],
      },
    };
  },
  computed: {
    // 格式化图片数据
    formatImageList() {
      return this.imageList.map((img) => {
        // 一上来请求回来的数据只有id
        // 新添加的数据不能设置id（由后台设置），所以写的是uid
        // 总之，id一定由后台服务器生成
        return {
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        // this.spuSaleAttrList.indexOf() // 只适用于数组中是基本类型
        // 找到了返回{}  没有找到返回undefined
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        ); // 适用于数组中是引用类型
      });
    },
  },
  /*图片上传的res，file
 res: {code: 200, message: "成功",
  data: "http://182.92.128.115:8080/group1/M00/00/B1/rBFUDF_YQayAE0FnAAAH8DFDLcM384.png",
   ok: true}
   code: 200
  file:{…}
  name: "brand_05.png"
  percentage: 100
  raw: File
  response: {code: 200, message: "成功", data: "http://182.92.128.115:8080/group1/M00/00/B1/rBFUDF_YQk-AR3XaAAAH8DFDLcM226.png", ok: true}
  size: 2032
  status: "success"
  uid: 1608008274191
  url: "blob:http://localhost:9528/4a2378e5-28d6-485e-b8c4-6eb4a
  */
  methods: {
    //收集数据，保存
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log("校验通过~");
          /* 数据：          {
              "category3Id": 0,  // 三级分类id
              "description": "string", // SPU描述
              "id": 0, // SPU id
              "spuImageList": [ // 图片列表
                {
                  "id": 0,
                  "imgName": "string",
                  "imgUrl": "string",
                  "spuId": 0
                }
              ],
              "spuName": "string", // SPU名称
              "spuSaleAttrList": [ // SPU销售属性列表
                {
                  "baseSaleAttrId": 0,
                  "id": 0,
                  "saleAttrName": "string",
                  "spuId": 0,
                  "spuSaleAttrValueList": [
                    {
                      "baseSaleAttrId": 0,
                      "id": 0,
                      "isChecked": "string",
                      "saleAttrName": "string",
                      "saleAttrValueName": "string",
                      "spuId": 0
                    }
                  ]
                }
              ],
              "tmId": 0 // 品牌id
            } */

          // 收集数据
          const spu = {
            ...this.spu,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };

          //发送请求
          let result;

          if (this.spu.id) {
            result = await this.$API.spu.updateSpuInfo(spu);
          } else {
            result = await this.$API.spu.saveSpu(spu);
          }

          if (result.code === 200) {
            // 切换回showList，
            // this.$emit("showList", this.spu.category3Id);
            this.$emit("showList");
            // this.$nextTick(() => {
            //   this.$bus.$emit("change", { category3Id: this.spu.category3Id });
            // });//可以放在list组件中
            this.$message.success("更新SPU成功~");
          } else {
            this.$message.error("更新SPU失败~");
          }
        }
      });
    },
    //删除当前SPU销售行
    delSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    // 删除单个销售属性值
    delTag(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 显示和删除输入框
    edit(row) {
      this.$set(row, "edit", true); //对象添加新属性（响应式数据）
      this.$nextTick(() => {
        //在dom创建之后
        this.$refs.input.focus(); //给input框设置聚焦属性
      });
    },
    // 添加销售属性值
    editCompleted(row) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        this.saleAttrValueText = "";
      }
      row.edit = false;
    },
    //添加销售属性
    addSaleAttr() {
      /*  // 方法一：find，
      // 选中的销售属性id
      const { saleAttrId, id } = this.spu;
       // 去所有销售属性列表找到某个销售属性
    const sale = this.saleAttrList.find((sale) => sale.id === saleAttrId);
      // {
      //       "baseSaleAttrId": 0, // 所有销售属性id
      //       "id": 0, // 由后台生成
      //       "saleAttrName": "string",  // 所有销售属性名称
      //       "spuId": 0, // SPU id
      //       "spuSaleAttrValueList": [
      //         {
      //           "baseSaleAttrId": 0,
      //           "id": 0,
      //           "isChecked": "string",
      //           "saleAttrName": "string",
      //           "saleAttrValueName": "string",
      //           "spuId": 0
      //         }
      //       ]
      //     }
      // 将销售属性添加到商品中
        this.spuSaleAttrList.push({
        baseSaleAttrId: sale.id, // 所有销售属性id
        saleAttrName: sale.name, // 所有销售属性名称
        spuId: id, // SPU id
        spuSaleAttrValueList: [], //销售属性值列表
      });
      // 清空选中的销售属性id
      this.spu.saleAttrId = ""; */
      // 方法二：将数据放在v-model中，切割的速度比查找快
      const { sale, id } = this.spu;

      const [saleAttrName, baseSaleAttrId] = sale.split("-");
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId, // 所有销售属性id
        saleAttrName, // 所有销售属性名称
        spuId: id, // SPU id
        spuSaleAttrValueList: [], //销售属性值列表
      });
      this.spu.sale = "";
    },

    //保存时验证表单，通过prop收集到验证项
    imageListValidator(rule, value, callback) {
      if (this.imageList.length > 0) {
        // 校验通过 调用callback
        callback();
        return;
      }
      //校验失败
      callback(new Error("请选择至少一个图片~~~"));
    },

    // 判断至少选择一个销售属性
    saleValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请选择至少一个销售属性~"));
        return;
      }
      // 判断SPU销售属性列表至少添加一个销售属性值
      const isNot = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (isNot) {
        callback(new Error("销售属性至少添加一个销售属性值, 请添加~"));
        return;
      }
      callback();
    },

    // 获取当前SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        this.$message.success("请求所有品牌数据成功");
      } else {
        this.$message.error(result.message);
      }
    },

    // 获取销售品牌数据
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.saleAttrList = result.data;
        this.$message.success("请求所有品牌数据成功");
      } else {
        this.$message.error(result.message);
      }
    },

    // 上传图片成功的回调
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      this.imageList.push({
        uid: file.uid, //必传
        imgName: file.name, // 文件名称
        imgUrl: res.data, // 图片地址
        spuId: this.spu.id, // SPU id
      });
    },

    // 上传图片之前触发的回调
    beforeAvatarUpload(file) {
      // console.log(file);
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      // 检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      // 检测文件大小
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 50 kb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return isValidType && isLt;
    },

    // 删除图片
    handleRemove(file, fileList) {
      // console.log(file, fileList); //id自动生成的使用图片地址删除
      this.imageList = this.imageList.filter((img) => img.imgUrl !== file.url);
    },

    // 处理图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // [{name: '', url: ''}]
        /*   this.imageList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.url,
          };
        }); 不改变元数据，手机图片数据上传服务器的时候用，放到计算属性里*/
        this.imageList = result.data;
        this.$message.success("请求所有品牌数据成功");
      } else {
        this.$message.error(result.message);
      }
    },

    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.trademarkList = result.data;
        console.log(result.data);
        this.$message.success("请求所有品牌数据成功");
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    // id由后台生成，修改的时候才会有id标识
    if (this.spu.id) {
      this.getSpuImageList();
      this.getSpuSaleAttrList();
    }
    //添加只需要品牌，和销售属性
    this.getTrademarkList();
    this.getSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>


