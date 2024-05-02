const { default: ApiUrls } = require("src/routes/api");
const { Api } = require("src/utils");

export const dropFileHandler = (files, options, cb) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  let headers = {};

  if (options.namespace) headers.namespace = options.namespace;
  if (options.filePrefix) headers.filePrefix = options.filePrefix;

  Api.postWithMedia(ApiUrls.storage.upload, formData, {
    headers,
  })
    .then((res) => cb(null, res.data))
    .catch((err) => cb({ message: "file upload fail", err }), null);
};

export const filePreview = (file) => {
  return ApiUrls.storage.preview(file);
};
