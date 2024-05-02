import RestApiClient from "src/utils/RestApiClient";

import ApiUrls from "src/routes/api";
const api = new RestApiClient();

class Profile {
  static async list(q = "") {
    return new Promise((resolve, reject) => {
      api
        .get(ApiUrls.customer.profile.index + q)
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

  static async get(id, q = "") {
    return new Promise((resolve, reject) => {
      api
        .get(ApiUrls.customer.profile.get(id) + q)
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

  static async create(data) {
    return new Promise((resolve, reject) => {
      api
        .post(ApiUrls.customer.profile.create, data)
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
        .put(ApiUrls.customer.profile.update(data.id), data)
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
      if (!id) reject({ message: "To delete a profile id is required" });
      api
        .delete(ApiUrls.customer.profile.delete(id))
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

export default Profile;
