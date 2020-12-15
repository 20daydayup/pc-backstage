 <template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="spu" label-width="80px">
        <el-form-item label="SPU名称" prop="spuName" inline>
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
              :label="tm.tmNam"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            prop="description"
            placeholder="请输入SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="SPU图片">
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
        <el-form-item
          label="销售属性"
          prop="saleAttrId"
          style="margin-top: 20px"
        >
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.saleAttrId"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :key="sale.id"
              :label="sale.name"
              :value="sale.id"
            ></el-option>
          </el-select>

          <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>

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
            <el-table-column prop="saleAttrName" label="属性名称">
            </el-table-column>

            <el-table-column label="属性列表值">
              <template v-slot="{ row }">
                <el-tag
                  style="margin-left: 5px"
                  v-for="attrVal in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  >{{ attrVal.saleAttrValueName }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <!-- <template v-slot="{ row }"> -->
              <template>
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
                <!-- <el-popconfirm @onConfirm="delAttr(row)" :title="`确定删除吗？`" >-->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                  size="mini"
                ></el-button>
                <!-- </el-popconfirm> -->
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <!-- <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="isShowList = true">取消</el-button> -->
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
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
    };
  },
  computed: {
    // 格式化图片数据
    formatImageList() {
      this.imageList.map((img) => {
        // 一上来请求回来的数据只有id
        // 新添加的数据不能设置id（由后台设置），所以写的是uid
        // 总之，id一定由后台服务器生成
        return {
          uid: img.uid || img.id,
          name: img.name,
          url: img.url,
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
  /*
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
    // 上传图片成功的回调
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      this.imageList.push({
        imgName: file.name, // 文件名称
        imgUrl: res.data, // 图片地址
        spuId: this.spu.id, // SPU id
        uid: file.uid, //必传
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
    // 获取所有品牌数据
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.saleAttrList = result.data;
        this.$message.success("请求所有品牌数据成功");
      } else {
        this.$message.error(result.message);
      }
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
        this.$message.success("请求所有品牌数据成功");
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSaleAttrList();
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>


