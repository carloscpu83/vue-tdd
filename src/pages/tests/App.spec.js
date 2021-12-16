import { render, screen, debug } from "@testing-library/vue";
import "@testing-library/jest-dom";
import i18n from "../../locales/i18n.js";
import App from "../../App.vue";
import userEvent from "@testing-library/user-event";
import router from '../../router/routes.js'
import signUp from "../../api/apiCalls";

describe("Routing", () => {
  let homePageComponent,
    signUpPageComponent,
    languageSelectorComponent,
    loginPageComponent,
    userPageComponent;

  beforeEach(() => {
    homePageComponent = null;
    signUpPageComponent = null;
    languageSelectorComponent = null;
    loginPageComponent = null;
    userPageComponent = null;
  });

  const renderSetup = async (path) => {
    render(App, {
      global: {
        plugins: [i18n, router],
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
    await renderSetup('/');
    expect(signUpPageComponent).not.toBeInTheDocument();
  });

  it("Should displays SignUpPage component at /signup", async () => {
    //window.history.pushState({}, "", "/signup");
    await renderSetup("/signup");
    expect(signUpPageComponent).toBeInTheDocument();
  });

  it("Should displays language selector component in home page view", async () => {
    //window.history.pushState({}, "", "/");
    await renderSetup('/');
    expect(languageSelectorComponent).toBeInTheDocument();
  });

  it("Should displays language selector component in signup view", async () => {
    //window.history.pushState({}, "", "/signup");
    await renderSetup('/signup');
    expect(languageSelectorComponent).toBeInTheDocument();
  });

  it("Should displays language selector component in not controlled view", async () => {
    //window.history.pushState({}, "", "/ficticiousurl");
    await renderSetup('/ficticiousurl');
    expect(languageSelectorComponent).toBeInTheDocument();
  });

  it("Should displays login page component in login view", async () => {
    //window.history.pushState({}, "", "/login");
    await renderSetup("/login");
    expect(loginPageComponent).toBeInTheDocument();
  });

  it("Should displays user page component in user view", async () => {
    //window.history.pushState({}, "", "/user");
    await renderSetup('/user');
    expect(userPageComponent).toBeInTheDocument();
  });

  it.each`
    url                 | nodeName  | message
    ${"/"}              | ${"Home"} | ${"Root page"}
    ${"/signup"}        | ${"Home"} | ${"Signup page"}
    ${"/login"}         | ${"Home"} | ${"Login page"}
    ${"/user"}          | ${"Home"} | ${"User page"}
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
    state  | nodeName  | componentId   | componentName
    ${"/"} | ${"Home"} | ${"homePage"} | ${"home page component"}
    ${"/"} | ${"User"} | ${"userPage"} | ${"user component"}
    ${"/"} | ${"Signup"} | ${"signUpPage"} | ${"signup component"}
    ${"/"} | ${"Login"} | ${"loginPage"} | ${"login component"}
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

  it('Should navigate to home page when click to app logo', async () => {
    //window.history.pushState({}, "", '/login');
    await renderSetup('/login');
    const homePageLogo = await screen.findByTestId('logoImg');
    await userEvent.click(homePageLogo);
    expect(await screen.findByTestId("homePage")).toBeInTheDocument();
  });
});
