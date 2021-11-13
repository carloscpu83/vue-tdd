import SignUpPage from "../SignUpPage.vue";
import LanguageSelector from "../../components/LanguajeSelector.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
//import axios from "axios";
//import "whatwg-fetch";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../../locales/i18n.js";
import enLanguage from "../../locales/en.json";
import esLanguage from "../../locales/es.json";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("prueba de titulo", () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const titulo = screen.queryByRole("heading", { name: "Sign Up" });
      expect(titulo).not.toBeNull();
      expect(titulo).innerHTML === "Sign Up";
      expect(titulo).toBeInTheDocument();
    });

    it("should have a input for the name", () => {
      const renderResult = render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const container = renderResult.container;
      expect(container.querySelector("#username")).toBeInTheDocument();
    });

    it("should have a input for the email", () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      expect(screen.queryByTestId("email")).toBeInTheDocument();
    });

    it("shoud have an input for the password", () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const passwordInput = screen.queryByPlaceholderText("Password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput.type).toBe("password");
    });

    it("shoud have an input for the repeated password", () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const passwordInput = screen.queryByTestId("repeatPassword");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput.type).toBe("password");
    });

    it("shoud compare both passwords", () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const passwordInput = screen.queryByTestId("password");
      const repeatedPasswordInput = screen.queryByTestId("repeatPassword");
      passwordInput.value = "pass";
      repeatedPasswordInput.value = "pass";
      expect(passwordInput.value).toEqual(repeatedPasswordInput.value);
    });

    it("should exists button for send data", () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const button = screen.queryByTestId("sendButton");
      expect(button).toBeInTheDocument();
    });

    it("should be disabled send button", () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const button = screen.queryByTestId("sendButton");
      expect(button).toBeDisabled();
    });
  });
  describe("interactions", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("should be enabled send button when both passwords are equal", async () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const passwordInput = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(passwordInput, "prueba");
      await userEvent.type(passwordRepeatInput, "prueba");
      const sendButton = screen.queryByTestId("sendButton");
      expect(sendButton).toBeEnabled();
    });

    it("should be disabled send button when both passwords are different", async () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const passwordInput = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(passwordInput, "hola");
      await userEvent.type(passwordRepeatInput, "adios");
      const sendButton = screen.queryByTestId("sendButton");
      expect(sendButton).toBeDisabled();
    });

    /*it("should send data to backend are the same with axios", async () => {
      const data = {
        name: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      render(SignUpPage);
      const userName = screen.queryByTestId("name");
      const email = screen.queryByTestId("email");
      const password = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(userName, data.name);
      await userEvent.type(email, data.email);
      await userEvent.type(password, data.password);
      await userEvent.type(passwordRepeatInput, data.password);
      const sendButton = screen.queryByTestId("sendButton");

      const mockedPostFunction = jest.fn();
      axios.post = mockedPostFunction;

      await userEvent.click(sendButton);

      const call = mockedPostFunction.mock.calls[0];
      const body = call[1];

      expect(body).toEqual(data);
    });*/

    /*it("should send data to backend are the same with fetch", async () => {
      const data = {
        name: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      render(SignUpPage);
      const userName = screen.queryByTestId("name");
      const email = screen.queryByTestId("email");
      const password = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(userName, data.name);
      await userEvent.type(email, data.email);
      await userEvent.type(password, data.password);
      await userEvent.type(passwordRepeatInput, data.password);
      const sendButtonFetch = screen.queryByTestId("sendButtonFetch");

      const mockedPostFunction = jest.fn();
      window.fetch = mockedPostFunction;

      await userEvent.click(sendButtonFetch);

      const call = mockedPostFunction.mock.calls[0];
      const body = call[1];

      expect(JSON.parse(body.body)).toEqual(data);
    });*/

    const setupRefactor = async (data) => {
      const app = {
        components: {
          SignUpPage,
          LanguageSelector,
        },
        template: `
          <sign-up-page />
          <language-selector />          
        `,
      };

      render(app, {
        global: {
          plugins: [i18n],
        },
      });

      const userName = screen.queryByTestId("username");
      const email = screen.queryByTestId("email");
      const password = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(userName, data.username || "Carlos");
      await userEvent.type(email, data.email || "carloscpu83@gmail.com");
      await userEvent.type(password, data.password || "M1pass");
      await userEvent.type(passwordRepeatInput, data.password || "M1pass");
    };

    it("should send data to backend are the same mocking with MSW", async () => {
      let requestAux = null;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestAux = req.body;
          return res(ctx.status(200));
        })
      );

      server.listen();

      const data = {
        username: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      await setupRefactor(data);

      const sendButton = screen.queryByTestId("sendButton");

      await userEvent.click(sendButton);

      await server.close();

      expect(requestAux).toEqual(data);
    });

    it("should verify sending buttons are disabled when a API is attended previous request", async () => {
      let clickCounter = 0;

      const data = {
        username: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      let responseData = null;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          clickCounter++;
          responseData = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen();

      await setupRefactor(data);
      const sendButton = screen.queryByTestId("sendButton");

      await userEvent.click(sendButton);
      await userEvent.click(sendButton);

      await server.close();
      expect(data).toStrictEqual(responseData);
      expect(clickCounter).toBe(2);
    });

    it("should verify spinner componen is hidden when not exists an axios call", async () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      const spinner = screen.queryByTestId("spinner");
      expect(spinner).not.toBeVisible();
    });

    it("should verify that after user sends data to the server the form shows an information message", async () => {
      const data = {
        username: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      server.listen();
      await setupRefactor(data);
      const spanishLanguageAction = screen.queryByTestId("esLanguage");
      await userEvent.click(spanishLanguageAction);
      const sendAxiosButton = screen.queryByTestId("sendButton");
      await userEvent.click(sendAxiosButton);
      await server.close();

      const txtResponse = await screen.findByText(
        "Por favor comprueba tu email para activar la cuenta."
      );
      expect(txtResponse).toBeInTheDocument();
    });

    it("should verify that the information message is not showing before the request is not sended", async () => {
      const data = {
        username: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      await setupRefactor(data);

      const screenText = screen.queryByText(
        "Por favor comprueba tu email para activar la cuenta."
      );

      expect(screenText).not.toBeVisible();
    });

    it("should verify that after user sends data to the server it launch an exception and the information message doues not appear", async () => {
      const data = {
        username: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      await setupRefactor(data);

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );

      server.listen();

      const sendButton = screen.queryByTestId("sendButton");
      await userEvent.click(sendButton);

      await server.close();

      const screenText = screen.queryByText(
        "Por favor comprueba tu email para activar la cuenta."
      );

      expect(screenText).not.toBeVisible();
    });

    it("should verify that the html form node is hidden when sign up petition is accepted", async () => {
      const data = {
        username: "carlos",
        email: "carlos@mail.com",
        password: "mipass",
      };

      await setupRefactor(data);

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      server.listen();

      const sendButton = screen.queryByTestId("sendButton");
      await userEvent.click(sendButton);

      await server.close();

      const formulario = screen.queryByTestId("formulario");

      await waitFor(() => {
        expect(formulario).not.toBeVisible();
        const formIsSendedLayout = screen.queryByTestId("formIsSendedLayout");
        expect(formIsSendedLayout).toBeInTheDocument();
      });
    });

    it("should verify that the spinner not exists when the petition return an error", async () => {
      const txtFieldError = "Username cannot be null";
      const data = {
        username: "",
        email: "",
        password: "",
      };

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: txtFieldError,
              },
            })
          );
        })
      );

      await setupRefactor(data);

      server.listen();
      const button = screen.queryByTestId("sendButton");
      await userEvent.click(button);
      await server.close();

      const spinner = screen.queryByTestId("spinner");
      const txt = await screen.findByText(txtFieldError);

      expect(txt).toBeInTheDocument();
      expect(spinner).not.toBeVisible();
    });

    /*it("should verify that Nombre field has an error", async () => {
      const txtFieldError = "Username cannot be null";

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: txtFieldError,
              },
            })
          );
        })
      );

      const data = {
        username: "",
        email: "",
        password: "",
      };
      await setupRefactor(data);

      server.listen();
      const sendButton = screen.queryByTestId("sendButton");
      await userEvent.click(sendButton);
      await server.close();

      const txt = await screen.findByText(txtFieldError);
      expect(txt).toBeInTheDocument();
    });

    it("should verify that Email field has an error", async () => {
      const txtFieldError = "Email cannot be null";

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                email: txtFieldError,
              },
            })
          );
        })
      );

      const data = {
        username: "",
        email: "",
        password: "",
      };
      await setupRefactor(data);

      server.listen();
      const sendButton = screen.queryByTestId("sendButton");
      await userEvent.click(sendButton);
      await server.close();

      const txt = await screen.findByText(txtFieldError);
      expect(txt).toBeInTheDocument();
    });*/

    it.each([
      [{ field: "username", message: "Username cannot be null" }],
      [{ field: "email", message: "Email cannot be null" }],
      [{ field: "password", message: "Password cannot be null" }],
    ])(
      "should verify that $field field has an error",
      async ({ field, message }) => {
        const txtFieldError = message;

        const server = setupServer(
          rest.post("/api/1.0/users", (req, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                validationErrors: {
                  [field]: txtFieldError,
                },
              })
            );
          })
        );

        const data = {
          username: "",
          email: "",
          password: "",
        };
        await setupRefactor(data);

        server.listen();
        const sendButton = screen.queryByTestId("sendButton");
        await userEvent.click(sendButton);
        await server.close();

        const txt = await screen.findByText(txtFieldError);
        expect(txt).toBeInTheDocument();
      }
    );

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"Email cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `(
      "should verify that $field field has an error",
      async ({ field, message }) => {
        const txtFieldError = message;

        const server = setupServer(
          rest.post("/api/1.0/users", (req, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                validationErrors: {
                  [field]: txtFieldError,
                },
              })
            );
          })
        );

        const data = {
          username: "",
          email: "",
          password: "",
        };
        await setupRefactor(data);

        server.listen();
        const sendButton = screen.queryByTestId("sendButton");
        await userEvent.click(sendButton);
        await server.close();

        const txt = await screen.findByText(txtFieldError);
        expect(txt).toBeInTheDocument();
      }
    );

    it("Should show password error message when passwords are different", async () => {
      const data = {
        username: "",
        email: "",
        password: "",
      };
      await setupRefactor(data);
      const password = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(password, "Maaaaa1");
      await userEvent.type(passwordRepeatInput, "Maaaaa2");
      const enLanguageAction = screen.queryByTestId('enLanguage');
      await userEvent.click(enLanguageAction);

      const textoError = await screen.findByText("Passwords mismatch");
      expect(textoError).toBeInTheDocument();
    });

    /*it("Should not show username message error when username field id not empty", async () => {
      render(SignUpPage);

      const userName = screen.queryByTestId("username");
      const email = screen.queryByTestId("email");
      const password = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      const sendButton = screen.queryByTestId("sendButton");
      //await userEvent.type(userName, "");
      //await userEvent.type(email, "");
      await userEvent.type(password, "M1pass");
      await userEvent.type(passwordRepeatInput, "M1pass");

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: 'Username cannot be null',
              },
            })
          );
        })
      );

      server.listen();
      await userEvent.click(sendButton);
      await server.close();

      await userEvent.type(userName, "prueba");
      

      const textoError = await screen.findByText("Username cannot be null");
      expect(textoError).not.toBeInTheDocument();
    });*/
  });

  describe("Internationalization", () => {
    let password,
      passwordRepeat,
      sendButton,
      spanishTranslationAction,
      englishTranslationAction,
      username,
      email,
      okMessage;

    let server, requestBody, counter, acceptLanguajeHeader;

    const renderSetup = () => {
      const app = {
        components: {
          SignUpPage,
          LanguageSelector,
        },
        template: `
        <sign-up-page />
        <language-selector />
        `,
      };

      render(app, {
        global: {
          plugins: [i18n],
        },
      });

      username = screen.queryByTestId("username");
      email = screen.queryByTestId("email");
      password = screen.queryByTestId("password");
      passwordRepeat = screen.queryByTestId("repeatPassword");
      sendButton = screen.queryByTestId("sendButton");
      spanishTranslationAction = screen.queryByTestId("esLanguage");
      englishTranslationAction = screen.queryByTestId("enLanguage");
      okMessage = screen.queryByTestId("formIsSendedLayout");
    };

    const mockAPIServer = () => {
      counter = 0;
      server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          acceptLanguajeHeader = req.headers.get("Accept-Language");
          counter += 1;
          return res(ctx.status(200));
        })
      );
    };

    beforeAll(() => {
      mockAPIServer();
      server.listen();
    });
    afterAll(() => {
      server.close();
    });
    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });

    it("Should show all tests in spanish", async () => {
      renderSetup();

      await userEvent.click(spanishTranslationAction);

      expect(screen.queryByTestId("testing").textContent).toBe(
        esLanguage.signup
      );
      expect(screen.queryByTestId("sendButton").textContent.trim()).toBe(
        esLanguage.send
      );
      expect(screen.queryByLabelText(esLanguage.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(esLanguage.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(esLanguage.password)).toBeInTheDocument();
      expect(
        screen.queryByLabelText(esLanguage.passwordrepeat)
      ).toBeInTheDocument();
    });

    it("Should show all tests in english", async () => {
      renderSetup();

      await userEvent.click(englishTranslationAction);

      expect(screen.queryByTestId("testing").textContent).toBe(
        enLanguage.signup
      );
      expect(screen.queryByTestId("sendButton").textContent.trim()).toBe(
        enLanguage.send
      );
      expect(screen.queryByLabelText(enLanguage.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(enLanguage.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(enLanguage.password)).toBeInTheDocument();
      expect(
        screen.queryByLabelText(enLanguage.passwordrepeat)
      ).toBeInTheDocument();
    });

    it("Should show english language after spanish language", async () => {
      renderSetup();

      await userEvent.click(spanishTranslationAction);
      await userEvent.click(englishTranslationAction);

      expect(screen.queryByTestId("testing").textContent).toBe(
        enLanguage.signup
      );
      expect(screen.queryByTestId("sendButton").textContent.trim()).toBe(
        enLanguage.send
      );
      expect(screen.queryByLabelText(enLanguage.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(enLanguage.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(enLanguage.password)).toBeInTheDocument();
      expect(
        screen.queryByLabelText(enLanguage.passwordrepeat)
      ).toBeInTheDocument();
    });

    it("Should see password mismatch message in spanish when passwords are different", async () => {
      renderSetup();

      await userEvent.click(spanishTranslationAction);
      await userEvent.type(password, "M1password");
      await userEvent.type(passwordRepeat, "M2password");
      await userEvent.click(sendButton);

      const errorRepeatPassword = screen.queryByTestId("errorPassword");

      expect(errorRepeatPassword.textContent).toBe(esLanguage.errorPassword);
    });

    it("Should see password mismatch message in english when passwords are different", async () => {
      renderSetup();

      await userEvent.click(englishTranslationAction);
      await userEvent.type(password, "M1password");
      await userEvent.type(passwordRepeat, "M2password");
      await userEvent.click(sendButton);

      const errorRepeatPassword = screen.queryByTestId("errorPassword");

      expect(errorRepeatPassword.textContent).toBe(enLanguage.errorPassword);
    });

    it("Should see english Accept-Language header option sends from backend", async () => {
      renderSetup();

      await userEvent.type(username, "Carlos Carpintero");
      await userEvent.type(email, "ccarpintero@gmail.com");
      await userEvent.type(password, "M1asdf");
      await userEvent.type(passwordRepeat, "M1asdf");
      await userEvent.click(englishTranslationAction);
      await userEvent.click(sendButton);

      expect(acceptLanguajeHeader).toBe("en");
    });

    it("Should see spanish Accept-Language header option sends from backend", async () => {
      renderSetup();

      await userEvent.type(username, "Carlos Carpintero");
      await userEvent.type(email, "ccarpintero@gmail.com");
      await userEvent.type(password, "M1asdf");
      await userEvent.type(passwordRepeat, "M1asdf");
      await userEvent.click(spanishTranslationAction);
      await userEvent.click(sendButton);

      expect(acceptLanguajeHeader).toBe("es");
    });

    it("Should see OkMessage in spanish when send petition is OK", async () => {
      renderSetup();

      await userEvent.type(username, "Carlos Carpintero");
      await userEvent.type(email, "ccarpintero@gmail.com");
      await userEvent.type(password, "M1asdf");
      await userEvent.type(passwordRepeat, "M1asdf");
      await userEvent.click(spanishTranslationAction);
      await userEvent.click(sendButton);

      expect(okMessage.textContent).toBe(esLanguage.okMessage);
    });

    it("Should see OkMessage in english when send petition is OK", async () => {
      renderSetup();

      await userEvent.type(username, "Carlos Carpintero");
      await userEvent.type(email, "ccarpintero@gmail.com");
      await userEvent.type(password, "M1asdf");
      await userEvent.type(passwordRepeat, "M1asdf");
      await userEvent.click(englishTranslationAction);
      await userEvent.click(sendButton);
      
      expect(okMessage.textContent).toBe(enLanguage.okMessage);
    });
  });

  describe("", () => {
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );
    beforeAll(() => {
      server.listen();
    });
    afterAll(() => {
      server.close();
    });
    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });
  });
});
