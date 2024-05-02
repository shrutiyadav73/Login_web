import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Manufacture extends BaseController {
  _list = ApiUrls.inventory.manufacture.index;

  _get = ApiUrls.inventory.manufacture.get;

  _post = ApiUrls.inventory.manufacture.create;

  _put = ApiUrls.inventory.manufacture.update;

  _delete = ApiUrls.inventory.manufacture.delete;
}

const manufactureInstance = new Manufacture();
export default manufactureInstance;
