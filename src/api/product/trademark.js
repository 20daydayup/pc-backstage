import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  /*
  获取品牌分页列表
  page当前页码，limit每页条数
  */
  getPageList(page, limit) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`
    });
  },
  /*
  新增BaseTrademark
  */
  addTrademark(data) {
    return request({
      method: "POST",
      url: `${api_name}/save`,
      data,//传什么用什么
    });
  },
  /*
  删除 BaseTrademark
  */
  delTrademark(id) {
    return request({
      method: "DELETE",
      url: `${api_name}/remove/${id}`
    });
  },
  /*
  修改BaseTrademark
  */
  updataTrademark(data) {
    return request({
      method: "PUT",
      url: `${api_name}/updata`,
      data,
    });
  }
};
