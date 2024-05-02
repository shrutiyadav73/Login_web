import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class Email extends BaseController {
  _list = ApiUrls.settings.email.index;

  _get = ApiUrls.settings.email.get;

  _post = ApiUrls.settings.email.create;

  _put = ApiUrls.settings.email.update;

  _delete = ApiUrls.settings.email.delete;
}

export default new Email();
