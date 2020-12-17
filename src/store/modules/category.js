import { Message } from "element-ui";
import * as API from "@/api";

export default {
  namespaced: true, //命名空间
  state: {
    category: {
      category1Id: "", // 1级分类id
      category2Id: "",
      category3Id: ""
    },
    category1List: [], // 1级分类数据
    category2List: [],
    category3List: []
  },
  getters: {},
  actions: {
    // 获取1级分类列表
    async getCategory1List({ commit }) {
      const result = await API.attrs.getCategory1();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", result.data);
      } else {
        Message.error(result.message);
      }
    },
    // 获取2级分类列表
    async getCategory2List({ commit }, category1Id) {
      // this.category2List = [];
      // this.category3List = [];
      // this.category.category2Id = "";
      // this.category.category3Id = "";

      const result = await API.attrs.getCategory2(category1Id);
      if (result.code === 200) {
        commit("GET_CATEGORY2_LIST_SUCCESS", {
          category1Id,
          category2List: result.data
        });
      } else {
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
        Message.error(result.message);
      }
    },
    // 获取3级分类列表
    async getCategory3List({ commit }, category2Id) {
      const result = await API.attrs.getCategory3(category2Id);
      if (result.code === 200) {
        commit("GET_CATEGORY3_LIST_SUCCESS", {
          category2Id,
          category3List: result.data
        });
      } else {
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
        Message.error(result.message);
      }
    }
  },
  mutations: {
    GET_CATEGORY1_LIST(state, category1List) {
      // 获取1级分类列表（此时还未选择1级分类）
      state.category1List = category1List;
    },
    GET_CATEGORY2_LIST_SUCCESS(state, { category1Id, category2List }) {
      // 获取2级分类列表（此时选择了1级分类， 清空2级和3级分类）
      state.category2List = category2List;
      state.category.category1Id = category1Id;
      // state.category2List = [];
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      state.category.category1Id = category1Id;
      state.category2List = [];
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_SUCCESS(state, { category2Id, category3List }) {
      // 获取3级分类列表（此时选择了1级分类， 清空2级和3级分类）
      state.category3List = category3List;
      state.category.category2Id = category2Id;

      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      state.category.category2Id = category2Id;
      state.category3List = [];
      state.category.category3Id = "";
    },
    // 选中三级id时不用发请求直接mutations
    SET_CATEGORY3_ID(state, category3Id) {
      state.category.category3Id = category3Id;
    }
  },

};
