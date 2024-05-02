import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Category extends BaseController {
  _list = ApiUrls.inventory.category.index;

  _get = ApiUrls.inventory.category.get;

  _post = ApiUrls.inventory.category.create;

  _put = ApiUrls.inventory.category.update;

  _delete = ApiUrls.inventory.category.delete;
}

const categoryInstance = new Category();
export default categoryInstance;
