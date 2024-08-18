import axios from "axios";

export default function loginRequest(username, password) {
  return axios.post("https://412c-103-209-253-33.ngrok-free.app/user/login", {
    "username":username,
    "password":password
  })
  .then(response => {
    if (response.data.status === "success") {
      localStorage.setItem("token", response.data.status);
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
