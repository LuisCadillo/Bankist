'use strict';
/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Luis Cadillo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2021-03-01T13:15:33.035Z',
    '2021-03-25T09:48:16.867Z',
    '2021-03-27T06:04:23.907Z',
    '2021-04-05T14:18:46.235Z',
    '2021-04-09T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-04-15T18:49:59.371Z',
    '2021-04-21T12:01:20.894Z',
  ],
  currency: 'PEN',
  locale: 'es-PE',
};

const account2 = {
  owner: 'Floyd Mcgregor',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2021-03-01T13:15:33.035Z',
    '2021-03-25T09:48:16.867Z',
    '2021-03-27T06:04:23.907Z',
    '2021-04-05T14:18:46.235Z',
    '2021-04-09T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-04-15T18:49:59.371Z',
    '2021-04-21T12:01:20.894Z',
  ],
  currency: 'PEN',
  locale: 'es-PE',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-02-11T13:15:33.035Z',
    '2021-02-22T09:48:16.867Z',
    '2021-02-27T06:04:23.907Z',
    '2021-03-05T14:18:46.235Z',
    '2021-03-09T16:33:06.386Z',
    '2021-03-10T14:43:26.374Z',
    '2021-04-18T18:49:59.371Z',
    '2021-04-19T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'es-ES',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2021-01-01T13:15:33.035Z',
    '2021-01-25T09:48:16.867Z',
    '2021-02-27T06:04:23.907Z',
    '2021-04-10T14:18:46.235Z',
    '2021-04-19T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

//Functions

const formatMovementDate = date => {
  const restDates = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const restDays = restDates(new Date(), date);
  if (restDays === 0) return 'TODAY';
  if (restDays === 1) return 'YESTERDAY';
  if (restDays <= 7) return `${restDays} DAYS AGO`;
  else {
    const date = new Date();
    const formatTime = new Intl.DateTimeFormat(currentUser.locale).format(date);
    return formatTime;
  }
};
const currencyUser = (movements, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(movements);
};

//Add  UserNames
const updateNames = accs => {
  accs.forEach(el => {
    el.userName = el.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
updateNames(accounts);

//Display movements
const addMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const dates = new Date(acc.movementsDates[i]);

    const formattedMov = new Intl.NumberFormat(currentUser.locale, {
      style: 'currency',
      currency: currentUser.currency,
    }).format(mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${formatMovementDate(dates)}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Calculate balance
const calcBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = currencyUser(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//Calculate summary
const calcSummary = acc => {
  const summaryIn = acc.movements
    .filter(inc => inc > 0)
    .reduce((acc, inc) => acc + inc, 0);
  labelSumIn.textContent = currencyUser(summaryIn, acc.locale, acc.currency);

  const summaryOut = acc.movements
    .filter(out => out < 0)
    .reduce((acc, out) => acc + out, 0);
  labelSumOut.textContent = currencyUser(summaryOut, acc.locale, acc.currency);

  const summaryInt = acc.movements
    .filter(mov => mov > 0)
    .map(int => (int * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = currencyUser(
    summaryInt,
    acc.locale,
    acc.currency
  );
};

const updateUi = function (acc) {
  calcBalance(acc);
  //Calculate summary
  calcSummary(acc);
  //Display movements
  addMovements(acc);
};
//Login
let currentUser;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentUser?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100; //display UI
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Hello message
    labelWelcome.textContent = `Good evening ${
      currentUser.owner.split(' ')[0]
    }`;
    const date = new Date();
    const formatTime = new Intl.DateTimeFormat(currentUser.locale, {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      year: 'numeric',
    }).format(date);
    labelDate.textContent = formatTime;
    //Calculte balance
    updateUi(currentUser);
  }
});
//Transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = +inputTransferAmount.value;
  const recipientUser = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  if (
    transferAmount > 0 &&
    recipientUser &&
    recipientUser?.userName !== currentUser.userName &&
    currentUser.balance >= transferAmount
  ) {
    recipientUser.movements.push(+transferAmount);
    currentUser.movements.push(-+transferAmount);

    recipientUser.movementsDates.push(new Date().toISOString());
    currentUser.movementsDates.push(new Date().toISOString());
    updateUi(currentUser);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

//Money loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentUser.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      currentUser.movements.push(loanAmount);
      currentUser.movementsDates.push(new Date().toISOString());
      updateUi(currentUser);
    }, 2500);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentUser.userName === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === inputCloseUsername.value
    );
    accounts.splice(index, 1);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  containerApp.style.opacity = 0;
});

//Sort movements
let sorted = false;
btnSort.addEventListener('click', function () {
  addMovements(currentUser, !sorted);
  sorted = !sorted;
});
