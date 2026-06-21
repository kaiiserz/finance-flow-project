//form
const inputDescription = document.querySelector("#description");
const inputAmount = document.querySelector("#amount");
const formType = document.querySelector("#type");
const addButton = document.querySelector("#add-btn")

//card
const entryDisplay = document.querySelector("#entries-display");
const outflowDisplay = document.querySelector("#outflows-display");
const balanceDisplay = document.querySelector("#balance-display");

//transactions history
const transactionList = document.querySelector(".transactions-list")


let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

addButton.addEventListener("click", (event) => {
    event.preventDefault();

    const description = inputDescription.value;
    const amount = inputAmount.value;
    const type = formType.value;

    if (description.trim() === "" || amount.trim() === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const amountNumber = Number(amount);

    const newTransaction = {
        id: Date.now(),
        description: description,
        amount: amountNumber,
        type: type
    };

    transactions.push(newTransaction);

    saveToLocalStorage();

    inputDescription.value = "";
    inputAmount.value = "";
    formType.value = "income"; 

    updateDisplay();
});

function updateDisplay() {
    transactionList.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            totalIncome = totalIncome + transaction.amount;
        } else if (transaction.type === "expense") {
            totalExpense = totalExpense + transaction.amount;
        }   
    });

    const totalBalance = totalIncome - totalExpense;

    entryDisplay.textContent = `R$ ${totalIncome.toFixed(2)}`;
    outflowDisplay.textContent = `R$ ${totalExpense.toFixed(2)}`;
    balanceDisplay.textContent = `R$ ${totalBalance.toFixed(2)}`;

    transactions.forEach(transaction => {
        const transactionItem = document.createElement("li");
        transactionItem.classList.add("transaction-item");
        transactionItem.classList.add(transaction.type);

        transactionItem.innerHTML = `
            <span class="title">${transaction.description}</span>
            <div class="transaction-right">
                <span class="value">${transaction.amount.toFixed(2)}</span>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
        const deleteButton = transactionItem.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            transactions = transactions.filter(t => t.id !== transaction.id);
            updateDisplay();
            saveToLocalStorage();
        });
        transactionList.appendChild(transactionItem);
    });
};

updateDisplay();

function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}