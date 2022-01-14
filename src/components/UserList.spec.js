import { render, screen, debug } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../locales/i18n.js";
import es from "../locales/es.json";
import en from "../locales/en.json";

import UserList from "./UserList.vue";
import LanguageSelector from "../components/LanguajeSelector.vue";

let server = setupServer(
  rest.get("/api/1.0/users/", (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get("page"));
    const size = parseInt(req.url.searchParams.get("size"));

    let realPage = isNaN(page) ? 0 : page;
    let realSize = isNaN(size) ? 3 : size;

    const paginateUSerList = getPaginateUsers(
      realPage,
      realSize,
      page1.content
    );
    return res(ctx.status(200), ctx.json(paginateUSerList));
  })
);

const setup = () => {
  const app = {
    components: {
      UserList,
      LanguageSelector,
    },
    template: `
  <user-list />
  <language-selector>
  `,
  };

  render(app, {
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
  beforeEach(() => {});
  it("Should displays 5 users in list page number one", async () => {
    setup();
    const users = await screen.findAllByText(/^user\d+$/);
    expect(users.length).toBe(3);
  });

  it("Should displays next page link on the page", async () => {
    setup();
    const nextPageLink = await screen.findByTestId("nextPageLink");
    expect(nextPageLink).toBeInTheDocument();
  });

  it("Should displays next elements after clicking on naxt page link", async () => {
    setup();
    const firstUser = await screen.findByText("user1");
    expect(firstUser).toBeInTheDocument();
    const nextPageLink = await screen.findByTestId("nextPageLink");
    userEvent.click(nextPageLink);
    const nextUser = await screen.findByText("user4");
    expect(nextUser).toBeInTheDocument();
  });

  it("Should hide next page button at the last page", async () => {
    setup();
    const firstUser = await screen.findByText("user1");
    expect(firstUser).toBeInTheDocument();
    const nextPageLink = await screen.findByTestId("nextPageLink");
    userEvent.click(nextPageLink);
    userEvent.click(nextPageLink);
    userEvent.click(nextPageLink);
    const lastUser = await screen.findByText("user10");
    expect(lastUser).toBeInTheDocument();
    expect(nextPageLink).not.toBeVisible();
  });

  it("Should not displays previous page link at the first page", async () => {
    setup();
    const firstUser = await screen.findByText("user1");
    expect(firstUser).toBeInTheDocument();
    const previousPageLink = await screen.findByTestId("previousPageLink");
    expect(previousPageLink).not.toBeVisible();
  });

  it("Should displays previous page link when actual page index between 1 and 3", async () => {
    setup();
    const firstUser = await screen.findByText("user1");
    expect(firstUser).toBeInTheDocument();
    const nextPageLink = await screen.findByTestId("nextPageLink");
    userEvent.click(nextPageLink);
    const previousPageLink = await screen.findByTestId("previousPageLink");
    expect(previousPageLink).toBeVisible();
    userEvent.click(nextPageLink);
    expect(previousPageLink).toBeVisible();
    userEvent.click(nextPageLink);
    expect(previousPageLink).toBeVisible();
  });

  it("Should displays user1 after click previous page link when the actual page index is 1", async () => {
    setup();
    const firstUser = await screen.findByText("user1");
    expect(firstUser).toBeInTheDocument();
    const nextPageLink = await screen.findByTestId("nextPageLink");
    userEvent.click(nextPageLink);
    const previousPageLink = await screen.findByTestId("previousPageLink");
    userEvent.click(previousPageLink);
    const firstUserF = await screen.findByText("user1");
    expect(firstUserF).toBeInTheDocument();
  });

  it("Should hides spinner after API call is finished", async () => {
    setup();
    const spinner = screen.queryByTestId("spinner");
    const firstUser = await screen.findByText("user1");
    expect(firstUser).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1000));
    expect(spinner).not.toBeVisible();
  });

  it("Should displays spinner after clicking next button", async () => {
    setup();
    await screen.findByText("user1");
    const nextButton = await screen.findByTestId("nextPageLink");
    const spinner = await screen.findByTestId("spinner");
    await userEvent.click(nextButton);
    expect(spinner).toBeVisible();
  });
});

describe("Internacionalization", () => {
  it("Should displays header and navigation buttons in spanish", async () => {
    setup();
    const esLanguage = await screen.findByTestId("esLanguage");
    await userEvent.click(esLanguage);
    const nextButton = await screen.findByTestId("nextPageLink");
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await screen.findByText("user4");

    expect(screen.queryByText(es.users)).toBeInTheDocument();
    expect(screen.queryByText(es.previous)).toBeInTheDocument();
    expect(screen.queryByText(es.next)).toBeInTheDocument();
  });

  it("Should displays header and navigation buttons in english", async () => {
    setup();
    const esLanguage = await screen.findByTestId("enLanguage");
    await userEvent.click(esLanguage);
    const nextButton = await screen.findByTestId("nextPageLink");
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await screen.findByText("user4");

    expect(screen.queryByText(en.users)).toBeInTheDocument();
    expect(screen.queryByText(en.previous)).toBeInTheDocument();
    expect(screen.queryByText(en.next)).toBeInTheDocument();
  });
});
