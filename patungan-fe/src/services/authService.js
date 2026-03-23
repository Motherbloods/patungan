import apiClient from "../api/index";

const client = apiClient();

//dibungkus {} karena biar ada nama key nya kalau tanpa {} itu ngirim string aja
//contoh {idToken : idToken} tanpa "idToken"
// dikasih () => itu tidak hanya untuk mengirimkan parameter tapi mengatasi rute yang langsung kepanggil
// ketika di refresh dalam artian lain rute ini akan di jalankan jika ditrigger

const authService = {
  verifyAuth: () => client.get("/auth/verify"),
  requestLogin: () => client.post("/auth/request-login"),
  loginGoogle: (idToken) => client.post("/auth/login/google", { idToken }),
  verifyLoginToken: (loginToken) =>
    client.post("/auth/verify-login", { loginToken }),
  logout: () => client.post("/auth/logout"),

  linkGoogle: (idToken) => client.post("/auth//link/google", { idToken }),
  requestLinkTelegram: () => client.post("/auth/link/telegram/request"),
  verifyLinkToken: (linkToken) =>
    client.post("/auth/link/telegram/verify", { linkToken }),
};

export default authService;
