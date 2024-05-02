import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Currency extends BaseController {
  _list = ApiUrls.settings.currency.index;

  _get = ApiUrls.settings.currency.get;

  _post = ApiUrls.settings.currency.create;

  _put = ApiUrls.settings.currency.update;

  _delete = ApiUrls.settings.currency.delete;
}

export default new Currency();
