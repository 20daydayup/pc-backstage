import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取SPU分页列表
  */
  getSpuList({ category3Id, page, limit }) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`,
      params: {
        category3Id
      }
    });
  },
  /*
  获取所有品牌数据
  */
  getTrademarkList() {
    return request({
      method: "GET",
      url: `${api_name}/baseTrademark/getTrademarkList`
    });
  },
  /*
  获取SPU的图片列表
  */
  getSpuImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },
  /*
  获取SPU的销售属性列表
  */
  getSpuSaleAttrList(spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET"
    });
  },

  /*
  获取所有销售属性列表
  */
  getSaleAttrList() {
    return request({
      method: "GET",
      url: `${api_name}/baseSaleAttrList`
    });
  },
  /*
  获取spu信息
  */
  getSpuInfo(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/getSpuById/${spuId}`
    });
  },
  /*
  DELETE商品
  */
  deleteSpu(spuId) {
    return request({
      method: "DELETE",
      url: `${api_name}/deleteSpu/${spuId}`
    });
  },
  /*
保存商品
  */
  saveSpu(spu) {
    return request({
      method: "POST",
      url: `${api_name}/saveSpuInfo`,
      data: spu
    });
  },
  /*
更改spu信息
  */
  updateSpuInfo(spu) {
    return request({
      method: "POST",
      url: `${api_name}/updateSpuInfo`,
      data: spu
    });
  }
};
