<template>
  <div class="cell-wrapper">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'BaseWidget',
  props: {
    href: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      required: true,
    },
    column: {
      type: Object,
      required: true,
    },
  },
  computed: {
    value() {
      return this.row[this.column.name];
    },
  },
  methods: {
    click($event) {
      this.$emit('click', $event, this.row, this.column);
    },
  },
};
</script>

<style scoped></style>
