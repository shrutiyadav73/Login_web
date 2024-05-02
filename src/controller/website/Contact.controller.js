import RestApiClient from "src/utils/RestApiClient";

import ApiUrls from "src/routes/api";

const api = new RestApiClient();

class Contact {
  static async list() {
    return new Promise((resolve, reject) => {
      api
        .get(ApiUrls.website.contact.index)
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
    return api.get(ApiUrls.website.contact.get(id));
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      api
        .post(ApiUrls.website.contact.create, data)
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
        .put(ApiUrls.website.contact.update(data.id), data)
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
      if (!id) reject({ message: "To delete a contact id is required" });
      api
        .delete(ApiUrls.website.contact.delete(id))
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

export default Contact;
