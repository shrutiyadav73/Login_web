import ApiUrls from "src/routes/api";
import BaseController from "../BaseController";

class Item extends BaseController {
  _list = ApiUrls.inventory.item.index;

  _get = ApiUrls.inventory.item.get;

  _post = ApiUrls.inventory.item.create;

  _put = ApiUrls.inventory.item.update;

  _delete = ApiUrls.inventory.item.delete;
}

const itemInstance = new Item();
export default itemInstance;
