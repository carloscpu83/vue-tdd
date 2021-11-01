import { render } from "@testing-library/vue";
import InputText from "./InputText.vue";

describe("InputText.vue", () => {
  it("Should not have an is-invalid class when the name input component is set", () => {
    const { container } = render(InputText, {
      props: {
        inputid: "inputid",
        inputtestid: "inputtestid",
      },
    });
    const inputElement = container.querySelector("#inputid");
    expect(inputElement.classList).not.toContain("is-invalid");
  });

  it("Should have invalid-feedback class when the help dic has a message", () => {
    const { container } = render(InputText, {
      props: {
        inputid: "inputid",
        inputtestid: "inputtestid",
        divtestid: "divtestid",
        divText: "Error en el campo nombre.",
      },
    });
    const divElement = container.querySelector("#divtestid");
    expect(divElement.classList).toContain("invalid-feedback");
  });
});
