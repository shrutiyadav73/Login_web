import ApiUrls from "src/routes/api";
import RestApiClient from "src/utils/RestApiClient";

const api = new RestApiClient();

class Gst {
  static async list() {
    return new Promise((resolve, reject) => {
      api
        .get(ApiUrls.settings.gst.index)
        .then((res) => {
          if (res.result) {
            resolve(res.data);
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  async get(id) {
    return api.get(ApiUrls.settings.gst.get(id));
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      api
        .post(ApiUrls.settings.gst.create, data)
        .then((res) => {
          if (res.result) {
            resolve(res.data);
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  static async update(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Update data should have id" });
      api
        .put(ApiUrls.settings.gst.update(data.id), data)
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

  static async delete(id) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "To delete a gst id is required" });
      api
        .delete(ApiUrls.settings.gst.delete(id))
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

export default Gst;
