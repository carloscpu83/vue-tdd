<template>
  <div data-testid="activationPage">
    <div class="alert alert-success mt-3" v-if="!!success">
      <div>{{ $t("activationMessage") }}</div>
    </div>
    <div class="alert alert-danger mt-3" v-if="!!fail">
      <div>{{ $t("activationMessageKO") }}</div>
    </div>
    <mi-spinner v-if="activatedSpinner"></mi-spinner>
  </div>
</template>

<script>
import activate from "../api/activateAPICall";
import Spinner from "../components/Spinner.vue";
export default {
  components: { 'mi-spinner': Spinner },
  data() {
    return {
      success: false,
      fail: false,
      showSpinner: false,
    };
  },
  mounted() {
    this.showSpinner = true;
    activate(this.$route.params.token)
      .then(() => {
        this.success = true;
      })
      .catch(() => {
        this.fail = true;
      })
      .finally(() => {
        this.sleep().then(() => {
          this.showSpinner = false;
        });
      });
  },
  methods: {
    sleep() {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
  },
  computed: {
    activatedSpinner() {
      return this.showSpinner;
    },
  },
};
</script>
