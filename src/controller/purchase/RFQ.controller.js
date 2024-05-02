import RestApiClient from "src/utils/RestApiClient";
import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

const api = new RestApiClient();

class RFQ extends BaseController {
  _list = ApiUrls.purchase.rfq.index;

  _get = ApiUrls.purchase.rfq.get;

  _post = ApiUrls.purchase.rfq.create;

  _put = ApiUrls.purchase.rfq.update;

  _delete = ApiUrls.purchase.rfq.delete;

  async sendMail(data) {
    return new Promise((resolve, reject) => {
      api
        .post(ApiUrls.purchase.rfq.sendMail(data.id), data)
        .then((res) => {
          if (res.result) {
            resolve(res.data);
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }
}

export default new RFQ();
