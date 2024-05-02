import BaseController from "src/controller/BaseController";
import RestApiClient from "src/utils/RestApiClient";
import ApiUrls from "../../routes/api";

const api = new RestApiClient();

class PurchaseRequestController extends BaseController {
  _list = ApiUrls.purchase.request.index;

  _get = ApiUrls.purchase.request.get;

  _post = ApiUrls.purchase.request.create;

  _put = ApiUrls.purchase.request.update;

  _delete = ApiUrls.purchase.request.delete;

  _correction = ApiUrls.purchase.order.correction;

  async changeStatus(data) {
    return new Promise((resolve, reject) => {
      console.log(this._get);
      if (!data.id) reject({ message: "PR Request should have id" });
      api
        .put(ApiUrls.purchase.request.changeStatus(data.id, data.status), data)
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
      if (!id) reject({ message: "Correction required Purchase Request Id" });
      api
        .put(ApiUrls.purchase.request.correction(id), data)
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

  async approval(id, data) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "Purchase Request Id required to proceed" });
      api
        .put(ApiUrls.purchase.request.approve(id), data)
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

  async withdraw(id) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "To withdraw a record, Id is required" });
      api
        .delete(ApiUrls.purchase.request.withdraw(id))
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
}
const PurchaseRequest = new PurchaseRequestController();
export default PurchaseRequest;
