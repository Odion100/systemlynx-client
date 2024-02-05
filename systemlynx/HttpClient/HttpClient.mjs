import axios from "axios";
import FormData from "form-data";

export default function createHttpClient() {
  const Client = {};
  Client.request = async ({ method = "get", url, body: data, headers }) => {
    method = method.toLowerCase();
    console.log("url--->", url, method);
    const res = await axios({ url, method, headers, data });
    if (res.status >= 400) {
      throw res.data;
    } else return res.data;
  };

  Client.upload = async ({ url, formData, headers }) => {
    const { file, files, __arguments } = formData;
    const form = new FormData();
    if (file) form.append("file", file, file.name);
    if (files) {
      files.forEach((file) => {
        form.append("files", file, file.name);
      });
    }
    if (__arguments) form.append("__arguments", JSON.stringify(__arguments));

    const res = await axios.post(url, form, {
      headers: { ...headers, "Content-Type": "multipart/form-data" },
    });
    if (res.status >= 400) {
      throw res.data;
    } else return res.data;
  };

  return Client;
}
