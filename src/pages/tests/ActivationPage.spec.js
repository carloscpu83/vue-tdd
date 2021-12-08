import { render, screen, debug } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../../locales/i18n.js";

import ActivationPage from "../ActivationPage.vue";

let server = setupServer();
let counter;

const setup = (token) => {
  render(ActivationPage, {
    global: {
      plugins: [i18n],
      mocks: {
        $route: {
          params: {
            token: token,
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

describe("Activation page testing library.", () => {
  beforeEach(() => {
    counter = 0;
    server.use(
      rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
        if (req.params.token === "6666") {
          return res(ctx.status(400), ctx.json({ message: "Activation failure" }));
        }

        counter += 1;
        return res(ctx.status(200));
      })
    );
  });
  it("Should show activation message after activation page is loaded", async () => {
    setup(1234);
    const activationMessage = await screen.findByText("Account is active now.");
    expect(activationMessage).toBeInTheDocument();
  });

  it("Should send activation from UI to backend and it responses OK", async () => {
    setup(1234);
    await screen.findByText("Account is active now.");
    expect(counter).toBe(1);
  });

  it("Should send activation from UI to backend and it responses KO", async () => {
    setup(6666);
    await screen.findByText("Account is not active now.");
    expect(counter).toBe(0);
  });

  it("Should displays spinner during activation API call", async () => {
      setup(1234);
      const spinner = await screen.findByTestId('spinner');
      expect(spinner).toBeInTheDocument();
  });
});
