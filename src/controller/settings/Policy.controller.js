import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Policy extends BaseController {
  _list = ApiUrls.settings.policy.index;

  _get = ApiUrls.settings.policy.get;

  _post = ApiUrls.settings.policy.create;

  _put = ApiUrls.settings.policy.update;

  _delete = ApiUrls.settings.policy.delete;
}

export default new Policy();
