import { render, screen, debug } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../locales/i18n.js";

import UserList from "./UserList.vue";

let server = setupServer();

const setup = () => {
  render(UserList, {
    global: {
      plugins: [i18n],
    },
  });
};

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});
beforeEach(() => {
  server.resetHandlers();
});

const page1 = {
  content: [
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
  ],
  page: 0,
  size: 10,
  totalPages: 3,
};

const page2 = {
  content: [
    { id: 11, username: "user11", email: "user11@mail.com", image: null },
    { id: 12, username: "user12", email: "user12@mail.com", image: null },
    { id: 13, username: "user13", email: "user13@mail.com", image: null },
    { id: 14, username: "user14", email: "user14@mail.com", image: null },
    { id: 15, username: "user15", email: "user15@mail.com", image: null },
    { id: 16, username: "user16", email: "user16@mail.com", image: null },
    { id: 17, username: "user17", email: "user17@mail.com", image: null },
    { id: 18, username: "user18", email: "user18@mail.com", image: null },
    { id: 19, username: "user19", email: "user19@mail.com", image: null },
    { id: 20, username: "user20", email: "user20@mail.com", image: null },
  ],
  page: 1,
  size: 10,
  totalPages: 3,
};

const page3 = {
  content: [
    { id: 21, username: "user21", email: "user21@mail.com", image: null },
    { id: 22, username: "user22", email: "user22@mail.com", image: null },
    { id: 23, username: "user23", email: "user23@mail.com", image: null },
    { id: 24, username: "user24", email: "user24@mail.com", image: null },
    { id: 25, username: "user25", email: "user25@mail.com", image: null },
  ],
  page: 2,
  size: 10,
  totalPages: 3,
};

describe("UserList page testing library", () => {
  beforeEach(() => {
    server.use(
      rest.get("/api/1.0/users/", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(page1));
      })
    );
  });
  it("Should displays 10 users in list page number one", async () => {
    setup();
    const users = await screen.findAllByText(/^user\d+$/);
    expect(users.length).toBe(10);
  });
});
