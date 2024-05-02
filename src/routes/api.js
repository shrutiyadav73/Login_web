const API_HOST = process.env.REACT_APP_API_URL ?? "http://localhost:5000/api/";

function path(sublink) {
  return `${API_HOST}${sublink}`;
}

const ApiUrls = {
  auth: {
    login: path("auth/login"),
    register: path("auth/register"),
    forgetPassword: path("auth/forget-password"),
    changePassword: path("auth/change-password"),
  },
};

export default ApiUrls;
