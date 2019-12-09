import faker from 'faker';
import dayjs from 'dayjs';

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const fullName = firstName + " " + lastName;
  return {
    firstName,
    lastName,
    fullName,
  }
}

export const makeForms = count => range(count).map(form => {
  let name = faker.lorem.words(Math.floor(Math.random() * 20 + 4));
  const newName = name.slice(0, 1).toUpperCase() + name.slice(1, name.length);
  return {
    name: newName
  }
});

// const statuses = [
//   {
//     id: "submitted",
//     description: "Submitted",
//     isProcessorActionable: true
//   },
//   {
//     id: "revised",
//     description: "Revised",
//     isProcessorActionable: true
//   },
//   {
//     id: "inReview",
//     description: "In Review",
//     isProcessorActionable: false
//   },
//   {
//     id: "deemedComplete",
//     description: "Deemed Complete",
//     isProcessorActionable: false
//   },
// ]

// const taskTemplates = [
//   "Revise Application Status to be \"In Review\" (Engineer)",
//   "Review Response from permittee",
//   "In-house Review of Response to Comments & Final Permit - Engineer Supervisor",
//   "In-house review of draft permit - Engineer Supervisor 2nd review",
//   "Enter Receipt into Project database (Engineer)"
// ]

export const makeTaskName = () => faker.company.catchPhrase();

export const makeTasks = maxTasks => {
  if (!maxTasks) maxTasks = 6;
  const count = Math.round(Math.random())
    ? 1
    : Math.floor(Math.random() * maxTasks)
  return range(count).map(makeTaskName)
}

const getRandomUser = users => users[Math.floor(Math.random() * users.length)];

const getAssignee = users => {
  const assignee = Math.floor(Math.random() + .33)
    ? getRandomUser(users)
    : null;
  return assignee;
}

const getSubmittedDate = () => {
  return dayjs().subtract(Math.floor(Math.random() * 7), 'day');
}

export const makeUsers = count => range(count).map(newPerson)

export default function makeSubmissions ({ 
  count = 1800,
  userCount = 60,
  formCount = 120,
  maxTasks = 6,
 }) {
  const users = makeUsers(userCount);
  const forms = makeForms(formCount);
  return range(count).map(submission => ({
    form: forms[Math.floor(Math.random() * forms.length)],
    user: getRandomUser(users),
    tasks: makeTasks(maxTasks),
    submittedOn: getSubmittedDate(),
    assignee: getAssignee(users),
  }))
}
