const form = document.querySelector("#myForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const obj = {
    email: document.querySelector(".email").value,
  };
  resetPassword(obj);
  form.reset();
});

async function resetPassword(obj) {
  try {
    const { status, data } = await axios.post(
      "http://localhost:3000/password/forgotpassword",
      obj
    );
    if (status == 200) {
      alert("successfully password reset link send to email");
    }
  } catch (err) {
    if (err.response.status === 400) {
      alert(err.response.data);
    } else alert(err.response.data);
  }
}
