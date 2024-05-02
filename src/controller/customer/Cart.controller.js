import ApiUrls from "src/routes/api";
import { Api } from "src/utils";

class Cart {
  static async get(id) {
    return new Promise((resolve, reject) => {
      Api.get(ApiUrls.customer.cart.get(id))
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
      if (!data.customerId)
        reject({ message: "Customer id required to update the cart" });
      Api.put(ApiUrls.customer.cart.update(data.id), data)
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

export default Cart;
