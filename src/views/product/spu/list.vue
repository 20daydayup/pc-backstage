<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <Category />
    <SpuShowList v-if="isShowList" @showUpdataList="showUpdataList" />
    <SpuUpdateList v-else :item="item" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import { Row } from "element-ui";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
    showUpdataList(row) {
      this.isShowList = false; //点击编辑按钮，显示编辑页面
      this.item = { ...row }; //将show组件的数据传到updata组件
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
