<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <SkuList v-if="isShowSkuList" :spuItem="spuItem" />

    <div v-else>
      <Category :disabled="!isShowList" />
      <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @showSpuList="showSpuList"
      />
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
      isShowSkuList: false,
      spuItem: {},
    };
  },
  methods: {
    //点击+按钮显示SkuList组件
    showSpuList(row) {
      this.isShowSkuList = true;
      this.spuItem = { ...row };
    },
    showUpdateList(row) {
      this.isShowList = false; //点击编辑按钮，显示编辑页面
      this.item = { ...row }; //将show组件的数据传到updata组件
    },
    showList(category3Id) {
      //   this.isShowList = true;
      //   // 等ShowList组件加载完成，在触发事件 重新获取SpuShowList数据
      //   //v-if组件会卸载,重新挂载需重新渲染，所以异步加载渲染数据
      //   this.$nextTick(() => {
      //     this.$bus.$emit("change", { category3Id });
      //   });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
  beforeDestroy() {
    //页面来回切换三级未变，清除3级id 解决方法；在beforeDestroy之前，或者路由守卫
    this.$store.commit("category/RESET_CATEGORY_ID");
  },
};
</script>
