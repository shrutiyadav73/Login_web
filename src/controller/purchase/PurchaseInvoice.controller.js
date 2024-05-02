import RestApiClient from "src/utils/RestApiClient";
import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

const api = new RestApiClient();

class PurchaseInvoice extends BaseController {
  _list = ApiUrls.purchase.invoice.index;

  _get = ApiUrls.purchase.invoice.get;

  _post = ApiUrls.purchase.invoice.create;

  _put = ApiUrls.purchase.invoice.update;

  _delete = ApiUrls.purchase.invoice.delete;

  async changeStatus(data) {
    return new Promise((resolve, reject) => {
      console.log(this._get);
      if (!data.id) reject({ message: "PI Request should have id" });
      api
        .put(ApiUrls.purchase.invoice.changeStatus(data.id, data.status), data)
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
        .put(ApiUrls.purchase.invoice.correction(id), data)
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

export default new PurchaseInvoice();
