'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Added  UserNames
const updateNames = accs => {
  accs.forEach(el => {
    el.userName = el.owner.toLowerCase().split(' ').map(name => name[0]).join('');
})};
updateNames(accounts);

//Display movements
const addMovements = function(movements) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

//Calculate balance
const calcBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

//Calculate summary
const calcSummary = user => {
  const summaryIn = user.movements.filter(inc => inc > 0).reduce((acc, inc) => acc + inc, 0);
  labelSumIn.textContent = `${summaryIn}€`;

  const summaryOut = user.movements.filter(out => out < 0).reduce((acc, out) => acc + out, 0);
  labelSumOut.textContent = `${-summaryOut}€`

  const summaryInt = user.movements.filter(mov => mov > 0).map(int => int * user.interestRate/100).reduce((acc, int) => acc + int)
  labelSumInterest.textContent = `${summaryInt}€`
}

const updateUi = function(acc) {
  calcBalance(acc);
  //Calculate summary
  calcSummary(acc)
  //Display movements
  addMovements(acc.movements);
}
//Login
let currentUser;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if(currentUser?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100; //display UI
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Hello message 
    labelWelcome.textContent = `Good evening ${currentUser.owner.split(' ')[0]}`
    //Calculte balance
    updateUi(currentUser);
  }
})

//Transfer money
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const transferAmount = inputTransferAmount.value;
  const recipientUser = accounts.find(acc => acc.userName === inputTransferTo.value);

  if(transferAmount > 0 && recipientUser && recipientUser?.userName !== currentUser.userName && currentUser.balance >= transferAmount) {
    recipientUser.movements.push(Number(transferAmount));
    currentUser.movements.push(-Number(transferAmount));
  
    updateUi(currentUser);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
})

