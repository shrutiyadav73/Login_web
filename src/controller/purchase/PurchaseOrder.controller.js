import RestApiClient from "src/utils/RestApiClient";
import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

const api = new RestApiClient();

class PurchaseOrderController extends BaseController {
  _list = ApiUrls.purchase.order.index;

  _get = ApiUrls.purchase.order.get;

  _post = ApiUrls.purchase.order.create;

  _put = ApiUrls.purchase.order.update;

  _delete = ApiUrls.purchase.order.delete;

  _correction = ApiUrls.purchase.order.correction;

  async changeStatus(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Purchase Order should have id" });
      api
        .put(ApiUrls.purchase.order.changeStatus(data.id), data)
        .then((res) => {
          if (res.result) {
            resolve("ok");
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  async correction(id, data) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "Correction required Purchase Order Id" });
      api
        .put(ApiUrls.purchase.order.correction(id), data)
        .then((res) => {
          if (res.result) {
            resolve("ok");
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  async verification(id, data) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "Purchase Order Id required to proceed" });
      api
        .put(ApiUrls.purchase.order.verify(id), data)
        .then((res) => {
          if (res.result) {
            resolve(res);
          } else {
            this.handleError(res, reject);
          }
        })
        .catch((err) => reject(err));
    });
  }

  async approval(id, data) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "Purchase Order Id required to proceed" });
      api
        .put(ApiUrls.purchase.order.approve(id), data)
        .then((res) => {
          if (res.result) {
            resolve(res);
          } else {
            this.handleError(res, reject);
          }
        })
        .catch((err) => reject(err));
    });
  }
}


const PurchaseOrder = new PurchaseOrderController();

export default PurchaseOrder;
