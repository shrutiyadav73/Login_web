import ApiUrls from "../../routes/api";
import RestApiClient from "../../utils/RestApiClient";
import BaseController from "../BaseController";

const api = new RestApiClient();

class StockController extends BaseController {
  _list = ApiUrls.inventory.stock.index;

  _get = ApiUrls.inventory.stock.get;

  _post = ApiUrls.inventory.stock.create;

  _put = ApiUrls.inventory.stock.update;

  _delete = ApiUrls.inventory.stock.delete;

  async history(query = "", ipn, warehouseId) {
    return new Promise((resolve, reject) => {
      api
        .get(ApiUrls.inventory.stock.history(ipn, warehouseId) + query)
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

  async assign(data) {
    return new Promise((resolve, reject) => {
      api
        .post(ApiUrls.inventory.stock.assign,data)
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

const Stock = new StockController();
export default Stock;
