<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
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
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="update(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="open(row, scope.row.id)"
            >删除</el-button
          >
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

    <!-- messagebox会频繁的卸载，样式复杂，dialog 样式是显示隐藏切换 -->
    <el-dialog
      :title="`${trademarkFrom.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
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
        <el-button @click="visible = false">取 消</el-button>
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
      page: 1, // 页码
      limit: 3, // 每页条数
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
    //添加
    add() {
      this.$refs.trademarkFrom && this.$refs.trademarkFrom.clearValidate(); // 清空表单的校验
      this.visible = true; //显示弹窗
      this.trademarkFrom = {}; //让数据为空
    },
    //修改
    update(row) {
      // 清空表单的校验 （点击取消后再次打开）
      this.$refs.trademarkFrom && this.$refs.trademarkFrom.clearValidate();

      this.visible = true; //弹框显示，在判断标题显示内容
      // this.trademarkFrom = row; //地址值一样，修改trademarkForm会导致trademarkList发生变化
      // this.trademarkForm = JSON.parse(JSON.stringify(row));//如果数据类型比较复杂
      this.trademarkFrom = { ...row };
    },
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

    //提交表单  发送请求
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          // 表单校验
          const { trademarkFrom } = this;

          // 代表是否是更新 有id就是更新
          const isUpdate = !!trademarkFrom.id;

          // 如果是修改需要验证
          if (isUpdate) {
            const tm = this.trademarkList.find(
              (tm) => tm.id === trademarkFrom.id
            );

            if (
              tm.tmName === trademarkFrom.tmName &&
              tm.logoUrl === trademarkFrom.logoUrl
            ) {
              this.$message.warning("不能提交与之前一样的数据");
              return;
            }
          }

          // 表单校验通过
          // console.log(this.trademarkForm);
          // 发送请求
          let result;

          if (isUpdate) {
            result = await this.$API.trademark.updataTrademark(trademarkFrom);
          } else {
            result = await this.$API.trademark.addTrademark(trademarkFrom);
          }

          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌成功~`);
            this.visible = false; // 隐藏对话框
            this.getPageList(this.page, this.limit); // 请求加载新数据
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    //删除
    open(row, id) {
      console.log(row, id);
      const hh = this.$confirm(
        `确定永久删除 ${row.tmName} , 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const result = await this.$API.trademark.delTrademark(id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getPageList(this.page, this.limit); // 请求加载新数据
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
  height: 100px

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
