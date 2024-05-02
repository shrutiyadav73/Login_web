import RestApiClient from "src/utils/RestApiClient";
import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

const api = new RestApiClient();

class Tax extends BaseController {
  _list = ApiUrls.settings.tax.index;

  _get = ApiUrls.settings.tax.get;

  _post = ApiUrls.settings.tax.create;

  _put = ApiUrls.settings.tax.update;

  _delete = ApiUrls.settings.tax.delete;

  async updateTax(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Update data should have id" });
      data.status = data.status === "inactive" ? "active" : "inactive";
      api
        .put(ApiUrls.settings.tax.updateTax(data.id), data)
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

async slablist(query = "") {
  return new Promise((resolve, reject) => {
    api
      .get(ApiUrls.settings.tax.list + query)
      .then((res) => {
        if (res.result) {
          resolve(res.data);
        } else {
          this.handleError(res,reject)
        }
      })
      .catch((err) => reject(err));
  });
}
}

export default new Tax();
