import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Indentor extends BaseController {
  _list = ApiUrls.purchase.indentor.index;

  _get = ApiUrls.purchase.indentor.get;

  _post = ApiUrls.purchase.indentor.create;

  _put = ApiUrls.purchase.indentor.update;

  _delete = ApiUrls.purchase.indentor.delete;
}

const indentorInstance = new Indentor();
export default indentorInstance;
