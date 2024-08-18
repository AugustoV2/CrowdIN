export function loginCheck() {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem('token')) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}