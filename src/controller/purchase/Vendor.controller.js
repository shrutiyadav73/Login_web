import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Vendor extends BaseController {
  _list = ApiUrls.purchase.vendor.index;

  _get = ApiUrls.purchase.vendor.get;

  _post = ApiUrls.purchase.vendor.create;

  _put = ApiUrls.purchase.vendor.update;

  _delete = ApiUrls.purchase.vendor.delete;
}

export default new Vendor();
