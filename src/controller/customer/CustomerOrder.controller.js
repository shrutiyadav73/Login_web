import ApiUrls from "../../routes/api";
import { Api } from "../../utils";

class CustomerOrder {
  static async list(q = "") {
    return new Promise((resolve, reject) => {
      Api.get(ApiUrls.customer.order.index + q)
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
      Api.get(ApiUrls.customer.order.get(id) + q)
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
      Api.post(ApiUrls.customer.order.create, data)
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
      if (!data.id) reject(new Error("Update data should have an id"));
      Api.put(ApiUrls.customer.order.update(data.id), data)
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
      if (!id) reject(new Error("Update data should have an id"));
      Api.delete(ApiUrls.customer.order.delete(id))
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

export default CustomerOrder;
