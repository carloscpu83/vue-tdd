<template>
  <div data-testid="loginPage" class="col-6 offset-3 col-md-8 offset-md-2">
    <form data-testid="formulario" class="mt-5">
      <card>
        <template v-slot:header>
          <h1 data-testid="pageHeader" class="text-center">
            {{ $t("loginpage") }}
          </h1>
        </template>
        <template v-slot:body>
          <div class="mb-3">
            <InputText
              inputid="email"
              inputtestid="email"
              name="email"
              divtestid="errorEmail"
              :labelText="$t('email')"
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
              v-model="password"
              placeholder="Password"
              tipo="password"
            />
          </div>
          <div class="text-center mb-3">
            <ButtonWithProgress
              :testId="sendButton"
              :id="sendButton"
              :name="sendButton"
              :disabled="sendButtonIsDisable"
              :submit="submitForm"
              :activatedSpinner="activatedSpinner"
            >
              {{ $t("login") }}
            </ButtonWithProgress>
          </div>
          <button @click.prevent="changeMyState" data-testid="chageState">
            Change state
          </button>
        </template>
      </card>
    </form>
    <div
      data-testid="errorMsg"
      v-if="!!errorMessage"
      class="alert alert-danger text-center"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import InputText from "../components/InputText.vue";
import login from "../api/loginAPICall.js";
import ButtonWithProgress from "../components/ButtonWithProgress.vue";
import Card from "../components/Card.vue";
import storage from "../state/storage.js";

export default {
  components: {
    InputText,
    ButtonWithProgress,
    Card,
  },
  data() {
    return {
      email: "",
      password: "",
      activatedSpinner: false,
      errorMessage: "",
      response: null,
    };
  },
  computed: {
    sendButtonIsDisable() {
      return (
        this.valueIsEmpty(this.email) ||
        this.valueIsEmpty(this.password) ||
        this.activatedSpinner
      );
    },
  },
  watch: {
    email() {
      this.errorMessage = "";
    },
    password() {
      this.errorMessage = "";
    },
  },
  methods: {
    valueIsEmpty(value) {
      return value === "";
    },
    async submitForm() {
      /*this.activatedSpinner = true;
      login({ email: this.email, password: this.password })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
          this.activatedSpinner = false;
        });*/

      try {
        storage.clear();
        this.activatedSpinner = true;
        const response = await login({
          email: this.email,
          password: this.password,
        });
        this.$router.push("/");

        const data = {
          ...response.data,
          header: "Bearer " + response.data.token,
        };

        this.changeMyState();
        this.storeMyId(data);
      } catch (error) {
        this.errorMessage = error.response.data.message;
      } finally {
        this.activatedSpinner = false;
      }
    },
    changeMyState() {
      this.$store.commit("loginSuccess");
    },
    storeMyId(data) {
      this.$store.commit("storeUserData", data);
    },
  },
};
</script>
