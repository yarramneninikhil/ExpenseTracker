const form = document.querySelector("#myForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const obj = {
    email: document.querySelector(".email").value,
    password: document.querySelector(".password").value,
  };
  checkUser(obj);
  form.reset();
});

async function checkUser(obj) {
  try {
    const response = await axios.post(`/login`, obj);
    const { status, data } = response;
    const accessKey = data.accessKey;
    if (status === 200) {
      localStorage.setItem("accesstoken", accessKey);
      alert("User logged in successfully");
      window.location.href = "./index.html";
    }
  } catch (err) {
    if (err.response && err.response.status === 409) {
      alert("invalid details");
    } else if (err.response.status === 404) {
      alert("First user needs to sign up");
    }
  }
}
