import SignUpPage from "../SignUpPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
//import axios from "axios";
//import "whatwg-fetch";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("prueba de titulo", () => {
      render(SignUpPage);
      const titulo = screen.queryByRole("heading", { name: "Sign Up" });
      expect(titulo).not.toBeNull();
      expect(titulo).innerHTML === "Sign Up";
      expect(titulo).toBeInTheDocument();
    });

    it("should have a input for the name", () => {
      const renderResult = render(SignUpPage);
      const container = renderResult.container;
      expect(container.querySelector("#username")).toBeInTheDocument();
    });

    it("should have a input for the email", () => {
      render(SignUpPage);
      expect(screen.queryByTestId("email")).toBeInTheDocument();
    });

    it("shoud have an input for the password", () => {
      render(SignUpPage);
      const passwordInput = screen.queryByPlaceholderText("Password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput.type).toBe("password");
    });

    it("shoud have an input for the repeated password", () => {
      render(SignUpPage);
      const passwordInput = screen.queryByTestId("repeatPassword");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput.type).toBe("password");
    });

    it("shoud compare both passwords", () => {
      render(SignUpPage);
      const passwordInput = screen.queryByTestId("password");
      const repeatedPasswordInput = screen.queryByTestId("repeatPassword");
      passwordInput.value = "pass";
      repeatedPasswordInput.value = "pass";
      expect(passwordInput.value).toEqual(repeatedPasswordInput.value);
    });

    it("should exists button for send data", () => {
      render(SignUpPage);
      const button = screen.queryByTestId("sendButton");
      expect(button).toBeInTheDocument();
    });

    it("should be disabled send button", () => {
      render(SignUpPage);
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
      render(SignUpPage);
      const passwordInput = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(passwordInput, "prueba");
      await userEvent.type(passwordRepeatInput, "prueba");
      const sendButton = screen.queryByTestId("sendButton");
      expect(sendButton).toBeEnabled();
    });

    it("should be disabled send button when both passwords are different", async () => {
      render(SignUpPage);
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
      render(SignUpPage);
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
      render(SignUpPage);
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

      expect(screenText).not.toBeInTheDocument();
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

      expect(screenText).not.toBeInTheDocument();
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
        expect(formulario).not.toBeInTheDocument();
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
      render(SignUpPage);
      const password = screen.queryByTestId("password");
      const passwordRepeatInput = screen.queryByTestId("repeatPassword");
      await userEvent.type(password, "Maaaaa1");
      await userEvent.type(passwordRepeatInput, "Maaaaa2");

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
});
