import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Project extends BaseController {
  _list = ApiUrls.purchase.project.index;

  _get = ApiUrls.purchase.project.get;

  _post = ApiUrls.purchase.project.create;

  _put = ApiUrls.purchase.project.update;

  _delete = ApiUrls.purchase.project.delete;
}

export default new Project();
