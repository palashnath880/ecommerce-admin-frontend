import instance from "./config";

const authApi = {
  login: (data: { user_login: string; user_pass: string }) =>
    instance.post("/auth/login", data),
  register: (data: object) => instance.post("/auth/register", data),
  verifyAdmin: () => instance.get("/auth/verifyAdmin"),
};

export default authApi;
