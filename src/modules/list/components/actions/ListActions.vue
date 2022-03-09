<template>
  <div class="actions-wrapper" />
</template>

<script>
export default {
  name: 'ListActions',
  props: {
    actions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {},
};
</script>

<style scoped></style>
