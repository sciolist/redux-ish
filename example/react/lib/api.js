export function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      username === password ? resolve({ username }) : resolve(null);
    }, 500 + (Math.random() * 1000));
  })
}