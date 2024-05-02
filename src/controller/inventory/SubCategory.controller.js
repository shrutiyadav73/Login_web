import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class SubCategory extends BaseController {
  _list = ApiUrls.inventory.subcategory.index;

  _get = ApiUrls.inventory.subcategory.get;

  _post = ApiUrls.inventory.subcategory.create;

  _put = ApiUrls.inventory.subcategory.update;

  _delete = ApiUrls.inventory.subcategory.delete;
}

const Subcategory = new SubCategory();
export default Subcategory;
