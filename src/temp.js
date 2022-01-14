const users = [
  { id: 1, username: "user1", email: "user1@mail.com", image: null },
  { id: 2, username: "user2", email: "user2@mail.com", image: null },
  { id: 3, username: "user3", email: "user3@mail.com", image: null },
  { id: 4, username: "user4", email: "user4@mail.com", image: null },
  { id: 5, username: "user5", email: "user5@mail.com", image: null },
  { id: 6, username: "user6", email: "user6@mail.com", image: null },
  { id: 7, username: "user7", email: "user7@mail.com", image: null },
  { id: 8, username: "user8", email: "user8@mail.com", image: null },
  { id: 9, username: "user9", email: "user9@mail.com", image: null },
  { id: 10, username: "user10", email: "user10@mail.com", image: null },
];

const getPaginateUsers = (page, size, userList) => {
  const startIdx = page * size;
  const endIdx = startIdx + size;
  const totalPages = Math.ceil(userList.length / size);
  const content = userList.slice(startIdx, endIdx);
  return {
    content,
    page,
    size,
    totalPages,
  };
};

console.log(getPaginateUsers(2, 4, users));
