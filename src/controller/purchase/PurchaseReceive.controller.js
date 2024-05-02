import RestApiClient from "src/utils/RestApiClient";
import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

const api = new RestApiClient();

class PurchaseReceive extends BaseController {
  _list = ApiUrls.purchase.receive.index;

  _get = ApiUrls.purchase.receive.get;

  _post = ApiUrls.purchase.receive.create;

  _put = ApiUrls.purchase.receive.update;

  _delete = ApiUrls.purchase.receive.delete;

  async changeStatus(data) {
    return new Promise((resolve, reject) => {
      console.log(this._get);
      if (!data.id) reject({ message: "PR Request should have id" });
      api
        .put(ApiUrls.purchase.receive.changeStatus(data.id), data)
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

export default new PurchaseReceive();
