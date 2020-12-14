import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取1级列表
  */
  getCategory1() {
    return request({
      method: "GET",
      url: `${api_name}/getCategory1`
    });
  },
  /*
  获取2级列表
  */
  getCategory2(category1Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory2/${category1Id}`
    });
  },
  /*
  获取3级列表
  */
  getCategory3(category2Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory3/${category2Id}`
    });
  },
  /*
  获取属性分类
  */
  getAttrList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },
  /*
  获取属性的属性值列表
  */
  getAttrValueLis(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    });
  },

  /*
  删除属性
  */
  deleteAttr(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: "DELETE"
    });
  },
  /*
  保存属性
  */
  saveAttr(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data: attr
    });
  }
};
