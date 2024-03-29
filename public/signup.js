const form = document.querySelector("#myForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const obj = {
    name: document.querySelector(".name").value.trim(),
    email: document.querySelector(".email").value.trim(),
    password: document.querySelector(".password").value.trim(),
  };
  postData(obj);
  form.reset();
});

async function postData(obj) {
  try {
    const userData = await axios.post("/signup", obj);
    console.log(userData.data);
    alert("Successfully you have registered please login");
  } catch (err) {
    if (err.response && err.response.status === 409)
      alert("you have already registered please login");
    else alert("You have error in your registration please register again");
  }
}
