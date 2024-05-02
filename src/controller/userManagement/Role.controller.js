import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Role extends BaseController {
  _list = ApiUrls.userManagement.role.index;

  _get = ApiUrls.userManagement.role.get;

  _post = ApiUrls.userManagement.role.create;

  _put = ApiUrls.userManagement.role.update;

  _delete = ApiUrls.userManagement.role.delete;
}

export default new Role();
