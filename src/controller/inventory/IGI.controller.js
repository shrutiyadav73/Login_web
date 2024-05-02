import ApiUrls from "src/routes/api";
import RestApiClient from "src/utils/RestApiClient";
import BaseController from "../BaseController";

const api = new RestApiClient();

class IGI extends BaseController {
  _list = ApiUrls.inventory.igi.index;

  _get = ApiUrls.inventory.igi.get;

  _post = ApiUrls.inventory.igi.create;

  _put = ApiUrls.inventory.igi.update;

  _delete = ApiUrls.inventory.igi.delete;

  async changeStatus(data) {
    return new Promise((resolve, reject) => {
      console.log(this._get);
      if (!data.id) reject({ message: "IGI should have id" });
      api
        .put(ApiUrls.inventory.igi.changeStatus(data.id, data.status), data)
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

const IGIInstance = new IGI();
export default IGIInstance;
