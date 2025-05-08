import request from "@/utils/request";
const purchaseForecastApi = {
  // 分页列表
  queryForecastOrderPageList(data) {
    return request({
      url: "/api/work/forecast_order/queryForecastOrderPageList",
      method: "post",
      data,
    });
  },
  //采购录入
  addForecastOrder(data) {
    return request({
      url: "/api/work/forecast_order/addForecastOrder",
      method: "post",
      data,
    });
  },
  //物料需求分析
  queryItemRequireAnalysePageList(data) {
    return request({
      url: "/api/work/forecast_order/queryItemRequireAnalysePageList",
      method: "post",
      data,
    });
  },
  //校验BOM是否有效
  addForecastOrderCheck(data) {
    return request({
      url: "/api/work/forecast_order/addForecastOrderCheck",
      method: "post",
      data,
    });
  },
}
export default purchaseForecastApi
// // 分页列表
// function list(data) {
//   return request({
//     url: "/api/work/forecast_order/queryForecastOrderPageList",
//     method: "post",
//     data,
//   });
// }
// // 订单增加
// function orderAdd(data) {
//   return request({
//     url: "/api/order/order/add",
//     method: "post",
//     data,
//   });
// }
// // 物料需求分析列表
// function queryItemRequireAnalysePageList(data) {
//   return request({
//     url: "/api/work/forecast_order/queryItemRequireAnalysePageList",
//     method: "post",
//     data,
//   });
// }
// export { list, orderAdd, queryItemRequireAnalysePageList };
