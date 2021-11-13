<template>
  <div class="col-6 offset-3 col-md-8 offset-md-2">
    <form data-testid="formulario" class="card mt-5" v-show="!requestIsSended">
      <div class="card-header">
        <h1 data-testid="testing" class="text-center">{{ $t("signup") }}</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <InputText
            inputid="username"
            inputtestid="username"
            name="username"
            divtestid="errorUsername"
            :labelText="$t('username')"
            :divText="errors.username"
            v-model="name"
            placeholder="Nombre"
            tipo="text"
          />
        </div>
        <div class="mb-3">
          <InputText
            inputid="email"
            inputtestid="email"
            name="email"
            divtestid="errorEmail"
            :labelText="$t('email')"
            :divText="errors.email"
            v-model="email"
            placeholder="Email"
            tipo="text"
          />
        </div>
        <div class="mb-3">
          <InputText
            inputid="password"
            inputtestid="password"
            name="password"
            divtestid="errorPassword"
            :labelText="$t('password')"
            :divText="errors.password || passwordNotEqualMessage"
            v-model="password"
            placeholder="Password"
            tipo="password"
          />
          <InputText
            inputid="repeatPassword"
            inputtestid="repeatPassword"
            name="repeatPassword"
            divtestid="errorRepeatPassword"
            :labelText="$t('passwordrepeat')"
            v-model="repeatedPassword"
            tipo="password"
          />
        </div>
        <div class="text-center mb-3">
          <button
            data-testid="sendButton"
            id="sendButton"
            name="sendButton"
            type="button"
            value="Enviar con AXIOS"
            class="btn btn-primary"
            :disabled="sendButtonIsDisable"
            @click.prevent="submitForm"
          >
            <span
              v-show="activatedSpinner"
              data-testid="spinner"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            {{ $t("send") }}
          </button>
          <input
            data-testid="sendButtonFetch"
            id="sendButtonFetch"
            name="sendButtonFetch"
            type="button"
            value="Enviar con FETCH"
            class="btn btn-primary mx-1"
            :disabled="sendButtonIsDisable"
            @click.prevent="submitFormFetch"
          />
        </div>
      </div>
    </form>
    <div
      v-show="requestIsSended"
      data-testid="formIsSendedLayout"
      class="alert alert-success"
      role="alert"
    >
      {{ $t("okMessage") }}
    </div>
  </div>
</template>
<script>
import axios from "axios";
import signUp from "../api/apiCalls.js";
import InputText from "../components/InputText.vue";

export default {
  name: "SignUpPage",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      repeatedPassword: "",
      activatedSpinner: false,
      requestIsSended: false,
      errors: {},
    };
  },
  components: { InputText },
  watch: {
    name() {
      this.errors.username = "";
    },
  },
  computed: {
    sendButtonIsDisable() {
      return this.passwordsAreEmpty() || this.passwordsAreDifferent();
    },
    showingSpinner() {
      return this.activatedSpinner;
    },
    passwordNotEqualMessage() {
      return !this.passwordsAreEmpty() &&
        this.password !== this.repeatedPassword
        ? this.$i18n.t("errorPassword")
        : "";
    },
  },
  methods: {
    passwordsAreEmpty() {
      return this.password === "" || this.repeatedPassword === "";
    },
    passwordsAreDifferent() {
      return this.password !== this.repeatedPassword;
    },
    createUserRequest() {
      return {
        username: this.name,
        email: this.email,
        password: this.password,
      };
    },
    async submitForm() {
      this.activatedSpinner = true;

      try{
        await signUp(this.createUserRequest())
        this.requestIsSended = true;
      } catch (error){
        this.requestIsSended = false;
          this.activatedSpinner = !this.activatedSpinner;

          if (error.response.status === 400) {
            this.errors = error.response.data.validationErrors;
          }
      }
    },
    submitFormFetch() {
      const data = this.createUserRequest();
      fetch("/api/1.0/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
  },
};
</script>
