import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

class TermsAndCondition extends BaseController {
  _list = ApiUrls.settings.termsAndCondition.index;

  _get = ApiUrls.settings.termsAndCondition.get;

  _post = ApiUrls.settings.termsAndCondition.create;

  _put = ApiUrls.settings.termsAndCondition.update;

  _delete = ApiUrls.settings.termsAndCondition.delete;
}

export default new TermsAndCondition();
