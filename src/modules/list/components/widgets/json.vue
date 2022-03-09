<template>
  <div class="cell-wrapper">
    {{ value }}
  </div>
</template>

<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget.vue';
export default {
  name: 'JsonWidget',
  extends: BaseWidget,
};
</script>

<style scoped></style>
