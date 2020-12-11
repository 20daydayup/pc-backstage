<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
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
          <el-button type="danger" icon="el-icon-delete" @click="del">删除</el-button>
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

    <!-- messagebox会频繁的卸载，样式是显示隐藏切换 -->
    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <el-form
        :model="trademarkFrom"
        :rules="rules"
        ref="trademarkFrom"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkFrom.logoUrl"
              :src="trademarkFrom.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkFrom')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {trademark} from "@api"//在main文件中经api挂载到原型上，可以不用引入直接使用
export default {
  name: "tradmark",
  data() {
    return {
      trademarkList: [], //所有数据
      visible: false, //添加数据弹框
      trademarkFrom: {
        // 表单数据
        tmName: "",
        logoUrl: "",
      },
      rules: {
        // 表单校验规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  methods: {
    //获取数据列表
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

    //上传图片的成功回调
    handleAvatarSuccess(file) {
      // console.log(file.data);// 图片地址
      this.trademarkFrom.logoUrl = file.data;
    },

    //上传图片之前的回调
    beforeAvatarUpload(file) {
      const imgTypes = ["image/jpeg", "image/png"];
      const isValidType = imgTypes.indexOf(file.type) > -1;

      const isLt2M = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 50kb!");
      }
      //返回true，可以上传
      return isValidType && isLt2M;
    },

    //提交表单
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          // 表单校验通过
          // console.log(this.trademarkFrom);
          const result = await this.$API.trademark.addTrademark(
            this.trademarkFrom
          );
          if (result.code === 200) {
            this.$message.success("添加品牌成功");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
  },
  mounted() {
    this.getPageList(1, 3);
  },
};
</script>

<style lang="sass" scoped>
.trademark-img
  width: 150px

.trademark-pagination
  text-align: right

.el-pagination__sizes
  margin-left: 260px

.el-button
  margin-bottom: 30px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
