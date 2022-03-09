<template>
  <div class="cell-wrapper">
    <i
      :class="value === true ? 'elu-icon-check' : 'elu-icon-close'"
      style="margin-left: 10px"
    />
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'BooleanWidget',
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
    click() {
      this.$emit('click', this.row, this.column);
    },
  },
};
</script>

<style scoped>
i {
  font-weight: bold;
}
i.elu-icon-close {
  color: red;
}
i.elu-icon-check {
  color: green;
}
</style>
