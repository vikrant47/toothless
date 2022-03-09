<template>
  <div class="action-element-wrapper">
    <el-button
      :name="name"
      :icon="icon"
      :circle="shape === 'circle'"
      :plain="shape === 'plain'"
      :round="shape === 'round'"
      :type="type"
      @click="click($event)"
    >{{ label }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'EnActionElement',
  props: {
    id: {
      type: String,
      require: true,
      default: null,
    },
    label: {
      type: String,
      require: true,
      default: null,
    },
    name: {
      type: String,
      require: true,
      default: null,
    },
    shape: {
      type: String,
      default: 'plain',
    },
    icon: {
      type: String,
      default: 'elu-icon-check',
    },
    type: {
      type: String,
      default: 'primary',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click(event) {
      this.$emit('click', event, this);
    },
  },
};
</script>

<style scoped></style>
