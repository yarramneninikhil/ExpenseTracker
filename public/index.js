const premium = document.querySelector(".premium");
const showLeaderBoard = document.querySelector(".leaderboard");
const leaderBoard = document.querySelector(".leader-board");
const form = document.querySelector(".myForm");
const expenseTableBody = document.querySelector("#expense-table-body");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const obj = {
    amount: form.querySelector("#amount").value,
    description: form.querySelector("#description").value,
    category: form.querySelector("#category").value,
  };
  const token = localStorage.getItem("accesstoken");
  async function postExpenses(obj) {
    try {
      const response = await axios.post("/userexpense", obj, {
        headers: {
          Authorization: `${token}`,
        },
      });
      createExpenseList(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  postExpenses(obj);
  form.reset();
});
function createExpenseList(obj) {
  const newRow = expenseTableBody.insertRow();
  const amountCell = newRow.insertCell();
  amountCell.textContent = obj.amount;
  const descriptionCell = newRow.insertCell();
  descriptionCell.textContent = obj.description;
  const categoryCell = newRow.insertCell();
  categoryCell.textContent = obj.category;
  const deleteCell = newRow.insertCell();
  const delbtn = document.createElement("button");
  delbtn.textContent = "Delete";
  delbtn.classList.add("delete-btn");
  delbtn.addEventListener("click", () => {
    deleteExpense(obj, newRow);
  });
  deleteCell.append(delbtn);
}

async function deleteExpense(obj, row) {
  try {
    const { status, data } = await axios.delete(`/deleteexpense/${obj.id}`);
    if (status === 200) {
      const finalTotalExpense = await axios.post("/reducetotalexpense", obj);
      console.log(`reduced totalexpenses by ${obj.amount}`);
    }
    row.remove();
  } catch (err) {
    console.log("error in deleting object");
  }
}

const buyPremium = document.querySelector(".payment");
buyPremium.addEventListener("click", async () => {
  const token = localStorage.getItem("accesstoken");
  const amount = 100;
  const orderResponse = await axios.post(
    "/buypremiumaccount",
    {
      amount,
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  const options = {
    key: "rzp_test_kkpElblAGj237S",
    amount: amount,
    currency: "INR",
    name: "Premium Subscription",
    description: "Access premium features",
    order_id: orderResponse.data.orderId,
    handler: async function (response) {
      console.log(response.razorpay_payment_id);
      const { data } = await axios.post("/premiumpayment", {
        order_id: orderResponse.data.orderId,
        payment_id: response.razorpay_payment_id,
      });

      if (data.status === "success") {
        alert("Payment Successfull");
        localStorage.setItem(`isPremiumUser_${data.userId}`, true);
        premium.textContent = "Your are Premium Member";
        showLeaderBoard.classList.remove("hidden");
        leaderBoard.classList.remove("hidden");
        buyPremium.remove();
      } else {
        localStorage.setItem(`isPremiumUser_${data.userId}`, false);
        alert("Payment failed");
      }
    },
  };
  const rzp = new Razorpay(options);
  rzp.open();
});
const download = document.querySelector(".download");

function isPremiumUser() {
  const token = localStorage.getItem("accesstoken");
  const [head, payload, signature] = token.split(".");
  const decodedpayload = JSON.parse(atob(payload));
  const isPremium = localStorage.getItem(
    `isPremiumUser_${decodedpayload.userId}`
  );
  return isPremium;
}

window.addEventListener("load", () => {
  if (isPremiumUser()) {
    premium.textContent = "Your are Premium Member";
    showLeaderBoard.classList.remove("hidden");
    leaderBoard.classList.remove("hidden");
    buyPremium.remove();
    download.classList.remove("hidden");
  }
});

showLeaderBoard.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("accesstoken");
    const { data } = await axios.get("/leaderboard", {
      headers: {
        Authorization: `${token}`,
      },
    });
    data.sort((a, b) => {
      return b.totalExpenses - a.totalExpenses;
    });
    data.forEach((element) => {
      createLeaderBoard(element);
    });
  } catch (err) {
    console.log(err);
  }
});

function createLeaderBoard(obj) {
  const leaderBoard = document.querySelector("#leaderboard-table-body");
  const row = leaderBoard.insertRow();
  const userName = row.insertCell();
  userName.textContent = obj.name;
  const userSum = row.insertCell();
  userSum.textContent = obj.totalExpenses;
}
const downloadBtn = document.querySelector(".downloadbtn");
downloadBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("accesstoken");
  const { data } = await axios.get("/download", {
    headers: {
      Authorization: `${token}`,
    },
  });
  const fileurl = data.fileurl;
  const link = document.createElement("a");
  link.href = fileurl;
  link.click();
});

function displayFiles(f, c) {
  const fileBody = document.querySelector(".file-body");
  const row = fileBody.insertRow();
  const time = row.insertCell();
  time.textContent = f.date;
  const url = row.insertCell();
  const link = document.createElement("a");
  link.href = f.url;
  link.textContent = `File-${c}`;
  url.append(link);
}

async function filesUserDownloaded() {
  try {
    const token = localStorage.getItem("accesstoken");
    const { data } = await axios.get("/files", {
      headers: {
        Authorization: `${token}`,
      },
    });
    let c = 1;
    data.files.forEach((file) => {
      displayFiles(file, c);
      c++;
    });
  } catch (err) {
    console.log(err);
  }
}
if (isPremiumUser()) {
  const files = document.querySelector(".files");
  files.classList.remove("hidden");
  filesUserDownloaded();
}

const pages = document.querySelector(".pages");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const pageNumber = document.querySelector(".page-number");

previous.addEventListener("click", handlePreviousClick);
next.addEventListener("click", handleNextClick);

async function getExpensesPerPage(p) {
  try {
    const token = localStorage.getItem("accesstoken");
    const pagenum = +p.textContent;
    const { data } = await axios.get("/expensesperpage", {
      params: {
        pageSize: window.innerWidth,
        pageNumber: pagenum,
      },
      headers: {
        Authorization: `${token}`,
      },
    });
    expenseTableBody.innerHTML = "";
    data.forEach((obj) => {
      createExpenseList(obj);
    });
  } catch (err) {
    console.log(err);
  }
}

getExpensesPerPage(pageNumber);

function handlePreviousClick() {
  const currentPage = parseInt(pageNumber.textContent);

  if (currentPage === 1) {
    alert("It is the starting of the page");
  } else {
    pageNumber.textContent = currentPage - 1;
  }

  updateButtonVisibility();
  getExpensesPerPage(pageNumber);
}

function handleNextClick() {
  const currentPage = parseInt(pageNumber.textContent);

  if (currentPage < 10) {
    pageNumber.textContent = currentPage + 1;
    updateButtonVisibility();
  } else {
    alert("End of the page");
  }
  getExpensesPerPage(pageNumber);
}

function updateButtonVisibility() {
  const currentPage = parseInt(pageNumber.textContent);

  previous.textContent = currentPage === 1 ? "start" : "prev";
  next.textContent = currentPage === 10 ? "end" : "next";
}

updateButtonVisibility();
