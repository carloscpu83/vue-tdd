import { render, screen, debug } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../../locales/i18n.js";

import UserPage from "../Userpage.vue";

let server = setupServer(
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    if (req.params.id === "1") {
      return res(
        ctx.status(200),
        ctx.json({
          id: 1,
          username: "user1",
          email: "user1@mail.com",
          image: null,
        })
      );
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          message: "User not found",
          path: "/api/1.0/users/100",
          timestamp: 1641152336622,
        })
      );
    }
  })
);

const setup = (id) => {
  render(UserPage, {
    global: {
      plugins: [i18n],
      mocks: {
        $route: {
          params: {
            id: id,
          },
        },
      },
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

describe("Test suite for Userpage component", () => {
  it("Should displays user name when user is found", async () => {
    setup(1);
    const username = await screen.findByText("user1");
    expect(username).toBeInTheDocument();
  });

  it("Should displays spinner when API call is in progress", async () => {
    setup(1);
    const spinner = await screen.findByTestId("spinner");
    expect(spinner).toBeVisible();
  });

  it("Should hide spinner when API call is finished", async () => {
    setup(1);
    const spinner = await screen.findByTestId("spinner");
    await screen.findByText("user1");
    await new Promise((r) => setTimeout(r, 1000));
    expect(spinner).not.toBeVisible();
  });

  it("Should displays error message when user not found", async () => {
    setup(100);
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.queryByText("User not found")).toBeInTheDocument();
  });
});
