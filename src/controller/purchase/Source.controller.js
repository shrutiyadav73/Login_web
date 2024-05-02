import ApiUrls from "src/routes/api";
import BaseController from "../BaseController";

class Source extends BaseController {
  _list = ApiUrls.purchase.source.index;

  _get = ApiUrls.purchase.source.get;

  _post = ApiUrls.purchase.source.create;

  _put = ApiUrls.purchase.source.update;

  _delete = ApiUrls.purchase.source.delete;
}

export default new Source();
