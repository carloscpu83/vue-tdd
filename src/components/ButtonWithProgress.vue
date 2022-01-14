<template>
  <button
    data-testid="sendButton"
    id="sendButton"
    name="sendButton"
    class="btn btn-primary"
    :disabled="disabled"
    @click.prevent="submit"
  >
    <spinner v-show="activatedSpinner" />
    <slot></slot>
  </button>
</template>
<script>
import spinner from "./Spinner.vue";
export default {
    props: {
        testId: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: true
        },
        submit: {
            type: Function,
            required: true
        },
        activatedSpinner: {
            type: Boolean,
            required: true
        }
    },
    components: {
        spinner
    }
}
</script>