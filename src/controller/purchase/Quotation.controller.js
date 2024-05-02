import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Quotation extends BaseController {
  _list = ApiUrls.purchase.quotation.index;

  _get = ApiUrls.purchase.quotation.get;

  _post = ApiUrls.purchase.quotation.create;

  _put = ApiUrls.purchase.quotation.update;

  _delete = ApiUrls.purchase.quotation.delete;
}

export default new Quotation();
