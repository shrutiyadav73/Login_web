import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Warehouse extends BaseController {
  _list = ApiUrls.inventory.warehouse.index;

  _get = ApiUrls.inventory.warehouse.get;

  _post = ApiUrls.inventory.warehouse.create;

  _put = ApiUrls.inventory.warehouse.update;

  _delete = ApiUrls.inventory.warehouse.delete;
}

const warehouseInstance = new Warehouse();
export default warehouseInstance;
