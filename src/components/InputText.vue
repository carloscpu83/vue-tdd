<template>
  <label class="form-label" :for="inputid">{{ labelText }}</label>
  <input
    :id="inputid"
    :data-testid="inputtestid"
    :name="name || inputid"
    :type="tipo"
    :class="hasError"
    @input="onChange"
    :value="modelValue"
    :placeholder="placeholder"
  />
  <div v-if="divText" :id="divtestid" :data-testid="divtestid" class="invalid-feedback">{{ divText }}</div>
</template>

<script>
export default {
  props: {
    inputid: {
      type: String,
      required: true,
    },
    inputtestid: {
      type: String,
      required: true,
    },
    divtestid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    labelText: {
      type: String,
      required: true,
    },
    divText: {
      type: String,
    },
    /*onChange: {
          type: Function,
          required: true
      }*/
    modelValue: {
      type: String,
    },
    placeholder: {
      type: String
    },
    tipo: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue"],
  methods: {
    onChange(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
  computed: {
      hasError(){
          return this.divText ? 'form-control is-invalid': 'form-control';
      }
  }
};
</script>
