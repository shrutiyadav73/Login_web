import RestApiClient from "src/utils/RestApiClient";
import ApiUrls from "../../routes/api";
import BaseController from "../BaseController";

const api = new RestApiClient();

class User extends BaseController {
  _list = ApiUrls.userManagement.user.index;

  _get = ApiUrls.userManagement.user.get;

  _post = ApiUrls.userManagement.user.create;

  _put = ApiUrls.userManagement.user.update;

  _delete = ApiUrls.userManagement.user.delete;

  async updatePassword(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Update data should have id" });
      api
        .put(ApiUrls.userManagement.user.updatePassword(data.id), data)
        .then((res) => {
          if (res.result) {
            resolve("ok");
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }
}

export default new User();
