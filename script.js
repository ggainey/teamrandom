const localStorage = window.localStorage;
const defaultMembers = [
  'pavelpicka', 'anotheruser'
];
let membersList = [...defaultMembers].sort();
// publicHoliday list format month-day 
const publicHolidays = [
  '01-01', '01-31', '03-29', '06-04', '08-02', '11-28', '12-25'
]

const btnAdd = document.querySelector('#addBtn');
const btnReset = document.querySelector('#resetBtn');
const btnGen = document.querySelector('#genBtn');
const startDate = document.querySelector('#startDate');
const skips = document.querySelector('#skips');
const shed = document.querySelector('#sched');

const fmtDate = (date = null) => {
  let now;
  if (date == null) {
    now = new Date();
  } else {
    now = date;
  }
  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString();
  let day = now.getDate().toString();
  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  return `${year}-${month}-${day}`;
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

const getLocalMembers = () => {
  localMembers = localStorage.getItem('pulpMembers');
  if (localMembers != null) {
    membersList = localMembers.split(',');
  }
}

const setLocalMembers = () => {
  localStorage.setItem('pulpMembers', membersList);
}

const updateMembers = () => {
  let memberListElem = document.querySelector('#memberList');
  memberListElem.innerHTML = '';
  membersList.sort().forEach(item => {
    let userBox = document.createElement('div');
    let userName = document.createElement('span');
    let removeBtn = document.createElement('span')

    userName.innerHTML = item;
    userName.classList.add('align-middle', 'lead', 'p-2');

    // removeBtn.type = 'button';
    removeBtn.innerHTML = '<strong>\u2A09</strong>';
    removeBtn.classList.add(
      'btn', 'btn-sm', 'rounded', 'text-danger', 'border', 'bg-white'
    );
    removeBtn.addEventListener('click', () => {
      let userIndex = membersList.indexOf(item);
      membersList.splice(userIndex, 1);
      updateMembers();
    });
    removeBtn.addEventListener('mouseenter', () => {
      userBox.classList.add('border', 'border-danger');
    });
    removeBtn.addEventListener('mouseleave', () => {
      userBox.classList.remove('border', 'border-danger');
    });

    userBox.classList.add('clearfix', 'p-1', 'ps-3', 'pe-3', 'm-2', 'border', 'rounded', 'd-inline-block', 'bg-light');
    userBox.appendChild(userName);
    userBox.appendChild(removeBtn);

    memberListElem.appendChild(userBox);

  });
}

const addMember = () => {
  let newUser = prompt('New username: ');
  if (newUser != null && newUser != '') {
    membersList.push(newUser);
    updateMembers();
    setLocalMembers();
  }
}

const resetMembers = () => {
  membersList = [...defaultMembers].sort();
  updateMembers();
  setLocalMembers();
}

const appendSkip = (date) => {
  let dateString = document.createElement('strong');
  dateString.innerHTML = date;
  dateString.classList.add('mr-4')

  let descString = document.createElement('span');
  descString.innerHTML = 'This date was skipped as it is in the list of public holidays.';

  let line = document.createElement('p');
  line.classList.add('alert', 'alert-warning');

  line.appendChild(dateString);
  line.appendChild(descString);
  skips.appendChild(line);
}

const generateSched = () => {
  let date = new Date(startDate.value);
  let emailPeriod = Number(document.querySelector('#emailPeriod').value);
  // clear previous
  shed.innerHTML = '';
  skips.innerHTML = '';

  let members = [];
  shuffleArray(membersList);
  membersList.forEach(item => {
    if (
        membersList.indexOf(item) % (emailPeriod -1 ) == 0 
        && membersList.indexOf(item) != 0
        && emailPeriod != 0
      ) {
      members.push('email');
    }
    members.push(item);
  });

  for (let i = 0; i < members.length; i++) {
    let rowEl = document.createElement('div');
    rowEl.classList.add('row');
    let colEl = document.createElement('div');
    colEl.classList.add('col', 'border', 'p-1')
    let dateEl = document.createElement('date');
    // add space after date to better copy/paste
    dateEl.innerHTML = `${fmtDate(date)} `;
    let nameEl = document.createElement('span');
    nameEl.classList.add('ml-4')
    nameEl.innerHTML = members[i];

    if (members[i] == 'email') {
      let classes = ['text-secondary'];
      colEl.classList.add(...classes);
    }

    rowEl.appendChild(colEl);
    colEl.appendChild(dateEl);
    colEl.appendChild(nameEl);
    shed.appendChild(rowEl);

    // increase date and check if next date is not public holiday
    date.setDate(date.getDate() + 7);
    let shortDate = fmtDate(date).slice(5);
    while (publicHolidays.indexOf(shortDate) != -1) {
      appendSkip(fmtDate(date));
      date.setDate(date.getDate() + 7);
      shortDate = fmtDate(date).slice(5);
    }
  }
  // Get sched into the user view
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

// Event listeners
btnReset.addEventListener('click', resetMembers);
btnAdd.addEventListener('click', addMember);
btnGen.addEventListener('click', generateSched);

// Main
getLocalMembers();
updateMembers();
startDate.value = fmtDate();
