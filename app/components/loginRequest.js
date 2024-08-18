import axios from "axios";

export default function loginRequest(username, password) {
  return axios.post("https://e8b9-136-232-57-110.ngrok-free.app/user/login", {
    username,
    password
  })
  .then(response => {
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      return true;
    } else {
      return Promise.reject(new Error("No token returned"));
    }
  })
  .catch(error => {
    console.error("Login failed:", error);
    return Promise.reject(error);
  });
}
