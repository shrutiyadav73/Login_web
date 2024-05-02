// User auth related functions
export const isUserLoggedIn = () => {
  return Boolean(localStorage.getItem("user-access-token"));
};

export const getLoggedInUser = () => {
  if (isUserLoggedIn()) {
    let useDetailsJsonString = localStorage.getItem("user-details") ?? "{}",
      user = {};
    try {
      user = JSON.parse(useDetailsJsonString);
    } catch (error) {}
    return user;
  }
};

export const saveUser = (data) => {
  if (data.token) {
    localStorage.setItem("user-access-token", data.token);
    localStorage.setItem("user-details", JSON.stringify(data));
  }
  return Boolean(localStorage.getItem("user-access-token"));
};

export const logoutUser = () => {
  localStorage.clear("user-access-token");
  localStorage.clear("user-details");
  window.location.reload();
};

export const authorizedUserOnly = () => {
  if (!isUserLoggedIn()) window.location.href = "/";
};
