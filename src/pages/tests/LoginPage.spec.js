import {
  render,
  screen,
  debug,
  waitFor,
  findByTestId,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../../locales/i18n.js";
import es from "../../locales/es.json";
import en from "../../locales/en.json";

import router from "../../router/routes.js";
import store from "../../state/store.js";
import storage from "../../state/storage.js";

import LoginPage from "../LoginPage.vue";
import LanguageSelector from "../../components/LanguajeSelector.vue";

const setup = async () => {
  render(LoginPage, {
    global: {
      plugins: [i18n, store],
      mocks: {
        $router: {
          push: () => {},
        },
      },
    },
  });
};

let requestBody = null;
let languageHeader = null;

const server = setupServer(
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    requestBody = req.body;
    languageHeader = req.headers.get("Accept-Language");
    return res(ctx.status(401), ctx.json({ message: "Incorrect credentials" }));
  })
);

beforeEach(() => {
  requestBody = null;
  server.resetHandlers();
});

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});

describe("Login page testing library", () => {
  describe("Layout", () => {
    it("Should displays login header", async () => {
      await setup();
      const header = screen.queryByTestId("pageHeader");
      expect(header).toBeInTheDocument();
    });
    it("Should displays email input", async () => {
      await setup();
      const emailInput = await screen.findByTestId("email");
      expect(emailInput).toBeInTheDocument();
    });
    it("Should displays password input", async () => {
      await setup();
      const passwordInput = await screen.findByTestId("password");
      expect(passwordInput).toBeInTheDocument();
    });
    it("Should has password input password type", async () => {
      await setup();
      const passwordInput = await screen.findByTestId("password");
      expect(passwordInput.type).toBe("password");
    });
    it("Should has login button", async () => {
      await setup();
      const loginButton = await screen.findByTestId("sendButton");
      expect(loginButton).toBeInTheDocument();
    });
    it("Should be disabled login button after page is loaded", async () => {
      await setup();
      const loginButton = await screen.findByTestId("sendButton");
      expect(loginButton.disabled).toBe(true);
    });
  });
  describe("Interacions", () => {
    it("Should displays activated login button when passwor and email are filled", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");

      await userEvent.type(emailController, "carloscpu@gmail.com");
      await userEvent.type(passwordController, "mipass");

      expect(loginButton.disabled).toBe(false);
    });
    it("Should displays the spinner after clicking the login button", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");
      const spinner = await screen.findByTestId("spinner");

      await userEvent.type(emailController, "carloscpu@gmail.com");
      await userEvent.type(passwordController, "mipass");
      await userEvent.click(loginButton);

      expect(spinner).toBeVisible();
    });
    it("Should hides after API response failed", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");
      const spinner = await screen.findByTestId("spinner");

      await userEvent.type(emailController, "carloscpu@gmail.com");
      await userEvent.type(passwordController, "mipass");
      await userEvent.click(loginButton);
      await waitFor(() => {
        expect(spinner).not.toBeVisible();
      });
    });
    it("Should receive data from backend after Api responses to a petition", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");
      const spinner = await screen.findByTestId("spinner");

      await userEvent.type(emailController, "user1@mail.com");
      await userEvent.type(passwordController, "P4ssword");
      await userEvent.click(loginButton);
      expect(spinner).toBeVisible();
      await waitFor(() => {
        expect(spinner).not.toBeVisible();
      });
      expect(requestBody).toEqual({
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });
    it("Should disables login button when Api have not been responses", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");
      const spinner = await screen.findByTestId("spinner");

      await userEvent.type(emailController, "carloscpu@gmail.com");
      await userEvent.type(passwordController, "mipass");
      await userEvent.click(loginButton);

      expect(loginButton).toBeDisabled();
    });
    it("Should displays authentication message", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");

      await userEvent.type(emailController, "carloscpu@gmail.com");
      await userEvent.type(passwordController, "mipass");
      await userEvent.click(loginButton);

      const errorMsg = await screen.findByText("Incorrect credentials");
      expect(errorMsg).toBeInTheDocument();
    });
    it("Should hides error message after email changes", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");

      await userEvent.type(emailController, "carloscpu@gmail.com");
      await userEvent.type(passwordController, "mipass");
      await userEvent.click(loginButton);

      const errorMsg = await screen.findByText("Incorrect credentials");
      expect(errorMsg).toBeInTheDocument();

      await userEvent.type(emailController, "yoyoyo@gmail.com");
      expect(errorMsg).not.toBeInTheDocument();
    });
    it("Should hides error message after password changes", async () => {
      await setup();

      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");

      await userEvent.type(emailController, "carloscpu@gmail.com");
      await userEvent.type(passwordController, "mipass");
      await userEvent.click(loginButton);

      const errorMsg = await screen.findByText("Incorrect credentials");
      expect(errorMsg).toBeInTheDocument();

      await userEvent.type(passwordController, "sdfsdf");
      expect(errorMsg).not.toBeInTheDocument();
    });
    it("Should store id, username and image field in local storage", async () => {
      server.use(
        rest.post("/api/1.0/auth", (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ id: 1, username: "user1", image: null })
          );
        })
      );
      await setup();
      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");
      await userEvent.type(emailController, "user1@mail.com");
      await userEvent.type(passwordController, "P4ssword");
      await userEvent.click(loginButton);
      const spinner = await screen.findByTestId("spinner");
      await waitFor(() => {
        expect(spinner).not.toBeVisible();
        const authData = storage.getItem("auth");
        const keys = Object.keys(authData);
        //console.log(keys);
        expect(keys.includes("userId")).toBeTruthy();
        expect(keys.includes("username")).toBeTruthy();
        expect(keys.includes("image")).toBeTruthy();
      });
    });
    it("Should ", async () => {
      server.use(
        rest.post("/api/1.0/auth", (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ id: 1, username: "user1", image: null, token: "123456" })
          );
        })
      );
      await setup();
      const loginButton = await screen.findByTestId("sendButton");
      const emailController = await screen.findByTestId("email");
      const passwordController = await screen.findByTestId("password");
      await userEvent.type(emailController, "user1@mail.com");
      await userEvent.type(passwordController, "P4ssword");
      await userEvent.click(loginButton);
      const spinner = await screen.findByTestId("spinner");
      await waitFor(() => {
        expect(spinner).not.toBeVisible();
        const authData = storage.getItem("auth");
        expect(authData.header).toBe("Bearer 123456");
      });
    });
  });
  describe("Internacionalization", () => {
    let spanishLanguage,
      englishLanguage,
      emailController,
      passwordController,
      sendButtonController,
      spinner;

    const setup = () => {
      const app = {
        components: {
          LoginPage,
          LanguageSelector,
        },
        template: `
          <LoginPage />
          <LanguageSelector />
        `,
      };

      render(app, { global: { plugins: [i18n] } });

      spanishLanguage = screen.queryByTestId("esLanguage");
      englishLanguage = screen.queryByTestId("enLanguage");
      emailController = screen.queryByTestId("email");
      passwordController = screen.queryByTestId("password");
      sendButtonController = screen.queryByTestId("sendButton");
      spinner = screen.queryByTestId("spinner");
    };

    it("Should displays all texts in spanish", async () => {
      setup();
      await userEvent.click(spanishLanguage);
      expect(screen.queryByText(es.login)).toBeInTheDocument();
      expect(screen.queryByLabelText(es.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(es.password)).toBeInTheDocument();
    });
    it("Should displays all texts in english", async () => {
      setup();
      await userEvent.click(englishLanguage);
      const title = screen.queryByTestId("pageHeader");
      expect(title.textContent).toBe("Login");
      //expect(screen.queryByText(en.loginpage)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
    });
    it("Should has english language header after send a petition", async () => {
      setup();
      await userEvent.click(englishLanguage);
      await userEvent.type(emailController, "user1@mail.com");
      await userEvent.type(passwordController, "P4ssword");
      await userEvent.click(sendButtonController);
      expect(spinner).toBeVisible();
      await waitFor(() => {
        expect(spinner).not.toBeVisible();
      });
      expect(languageHeader).toBe("en");
    });
    it("Should has spanish language header after send a petition", async () => {
      setup();
      await userEvent.click(spanishLanguage);
      await userEvent.type(emailController, "user1@mail.com");
      await userEvent.type(passwordController, "P4ssword");
      await userEvent.click(sendButtonController);
      expect(spinner).toBeVisible();
      await waitFor(() => {
        expect(spinner).not.toBeVisible();
      });
      expect(languageHeader).toBe("es");
    });
  });
});
