import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Client extends BaseController {
  _list = ApiUrls.purchase.client.index;

  _get = ApiUrls.purchase.client.get;

  _post = ApiUrls.purchase.client.create;

  _put = ApiUrls.purchase.client.update;

  _delete = ApiUrls.purchase.client.delete;
}

const clientInstacne = new Client();
export default clientInstacne;
