import {
  render,
  screen,
  debug,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/vue";
import "@testing-library/jest-dom";
import i18n from "../../locales/i18n.js";
import App from "../../App.vue";
import userEvent from "@testing-library/user-event";
import router from "../../router/routes.js";
import signUp from "../../api/apiCalls";
import { setupServer } from "msw/node";
import { rest } from "msw";
import store from "../../state/store.js";
import storage from "../../state/storage.js";

describe("Routing", () => {
  let homePageComponent,
    signUpPageComponent,
    languageSelectorComponent,
    loginPageComponent,
    userPageComponent;

  let server = setupServer(
    rest.get("/api/1.0/users/", (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
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
            {
              id: 10,
              username: "user10",
              email: "user10@mail.com",
              image: null,
            },
          ],
          page: 0,
          size: 10,
          totalPages: 3,
        })
      );
    })
  );

  beforeEach(() => {
    homePageComponent = null;
    signUpPageComponent = null;
    languageSelectorComponent = null;
    loginPageComponent = null;
    userPageComponent = null;

    server.resetHandlers();
  });

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  const renderSetup = async (path) => {
    render(App, {
      global: {
        plugins: [i18n, router, store],
      },
    });
    router.replace(path);
    await router.isReady();

    homePageComponent = screen.queryByTestId("homePage");
    signUpPageComponent = screen.queryByTestId("signUpPage");
    languageSelectorComponent = screen.queryByTestId("languageSelector");
    loginPageComponent = screen.queryByTestId("loginPage");
    userPageComponent = screen.queryByTestId("userPage");
  };

  it("Should displays homepage at /", async () => {
    //window.history.pushState({}, "", );
    await renderSetup("/");
    expect(homePageComponent).toBeInTheDocument();
  });

  it("Should not exists SignUpPage componen in the view", async () => {
    //window.history.pushState({}, "", "/");
    await renderSetup("/");
    expect(signUpPageComponent).not.toBeInTheDocument();
  });

  it("Should displays SignUpPage component at /signup", async () => {
    //window.history.pushState({}, "", "/signup");
    await renderSetup("/signup");
    expect(signUpPageComponent).toBeInTheDocument();
  });

  it("Should displays language selector component in home page view", async () => {
    //window.history.pushState({}, "", "/");
    await renderSetup("/");
    expect(languageSelectorComponent).toBeInTheDocument();
  });

  it("Should displays language selector component in signup view", async () => {
    //window.history.pushState({}, "", "/signup");
    await renderSetup("/signup");
    expect(languageSelectorComponent).toBeInTheDocument();
  });

  it("Should displays language selector component in not controlled view", async () => {
    //window.history.pushState({}, "", "/ficticiousurl");
    await renderSetup("/ficticiousurl");
    expect(languageSelectorComponent).toBeInTheDocument();
  });

  it("Should displays login page component in login view", async () => {
    //window.history.pushState({}, "", "/login");
    await renderSetup("/login");
    expect(loginPageComponent).toBeInTheDocument();
  });

  it("Should displays user page component in user view", async () => {
    //window.history.pushState({}, "", "/user");
    await renderSetup("/user/1");
    expect(userPageComponent).toBeInTheDocument();
  });

  it.each`
    url                 | nodeName  | message
    ${"/"}              | ${"Home"} | ${"Root page"}
    ${"/signup"}        | ${"Home"} | ${"Signup page"}
    ${"/login"}         | ${"Home"} | ${"Login page"}
    ${"/user/1"}        | ${"Home"} | ${"User page"}
    ${"/ficticiousurl"} | ${"Home"} | ${"Ficticious page"}
  `("Should have an navigation link on $message on $url", async (tupla) => {
    //window.history.pushState({}, "", tupla.url);
    await renderSetup(tupla.url);
    const homePageNodeLink = screen.queryByRole("link", {
      name: tupla.nodeName,
    });
    expect(homePageNodeLink).toBeInTheDocument();
  });

  it.each`
    state  | nodeName        | componentId         | componentName
    ${"/"} | ${"Home"}       | ${"homePage"}       | ${"home page component"}
    ${"/"} | ${"User"}       | ${"userlist"}       | ${"user component"}
    ${"/"} | ${"Signup"}     | ${"signUpPage"}     | ${"signup component"}
    ${"/"} | ${"Login"}      | ${"loginPage"}      | ${"login component"}
    ${"/"} | ${"Activation"} | ${"activationPage"} | ${"activate component"}
  `("Should displays $componentName in $state url", async (tupla) => {
    //window.history.pushState({}, "", tupla.state);
    await renderSetup(tupla.state);
    const link = screen.queryByRole("link", {
      name: tupla.nodeName,
    });
    await userEvent.click(link);
    expect(await screen.findByTestId(tupla.componentId)).toBeInTheDocument();
  });

  it("Should navigate to home page when click to app logo", async () => {
    //window.history.pushState({}, "", '/login');
    await renderSetup("/login");
    const homePageLogo = await screen.findByTestId("logoImg");
    await userEvent.click(homePageLogo);
    expect(await screen.findByTestId("homePage")).toBeInTheDocument();
  });

  it("Should navigates to user page when clicking to a user name", async () => {
    await renderSetup("/");
    const user = await screen.findByText("user1");
    userEvent.click(user);
    const userlist = await screen.findByTestId("userlist");
    expect(userlist).toBeInTheDocument();
  });
});

describe("Login", () => {
  const server = setupServer(
    rest.post("/api/1.0/auth", (req, res, ctx) => {
      requestBody = req.body;
      return res(ctx.status(200), ctx.json({ id: 1, username: "user1" }));
    }),
    rest.get("/api/1.0/users/:id", (req, res, ctx) => {
      const id = parseInt(req.params.id);
      return res(
        ctx.status(200),
        ctx.json({
          id: 1,
          username: "user" + id,
          email: "user" + id + "@mail.com",
          image: null,
        })
      );
    })
  );

  beforeEach(() => {
    server.resetHandlers();
    localStorage.clear();
  });

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  let requestBody = null;

  const setupLogIn = async () => {
    await renderSetup("/login");
    const emailController = await screen.findByTestId("email");
    const passwordController = await screen.findByTestId("password");
    const sendController = await screen.findByTestId("sendButton");
    await userEvent.type(emailController, "user1@mail.com");
    await userEvent.type(passwordController, "P4ssword");
    await userEvent.click(sendController);
  };

  const renderSetup = async (path) => {
    render(App, {
      global: {
        plugins: [i18n, router, store],
      },
    });
    router.replace(path);
    await router.isReady();
  };
  it("Should redirect to home page after successfull login", async () => {
    setupLogIn();
    const homePageElement = await screen.findByTestId("homePage");
    expect(homePageElement).toBeInTheDocument();
  });
  it("Should hides login and signup links after correct login", async () => {
    setupLogIn();
    const homePageElement = await screen.findByTestId("homePage");
    expect(screen.queryByTestId("loginlink")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signuplink")).not.toBeInTheDocument();
  });
  it("basic for change state", async () => {
    await renderSetup("/login");
    expect(store.state.isLogedIn).toBeFalsy();
  });

  it("basic for change state to true", async () => {
    await renderSetup("/login");
    const button = await screen.findByTestId("chageState");
    userEvent.click(button);
    expect(store.state.isLogedIn).toBeTruthy();
  });
  it("Should displays my profile link after we are logged", async () => {
    setupLogIn();
    await screen.findByTestId("homePage");
    const profileLink = await screen.findByRole("link", { name: "My profile" });
    expect(profileLink).toBeInTheDocument();
  });
  it("Should displays my profile page after clicking my profile link", async () => {
    setupLogIn();
    await screen.findByTestId("homePage");
    const profileLink = await screen.findByRole("link", { name: "My profile" });
    await userEvent.click(profileLink);
    const userPage = await screen.findByTestId("userPage");
    expect(userPage).toBeInTheDocument();
    const userName = await screen.findByText("user1");
    expect(userName).toBeInTheDocument();
  });
  it("Should be stored login store object to localStore at web browsers memory", async () => {
    setupLogIn();
    await screen.findByTestId("homePage");
    const loginStoredData = storage.getItem("auth");
    expect(loginStoredData.isLogedIn).toBeTruthy();
  });
});
