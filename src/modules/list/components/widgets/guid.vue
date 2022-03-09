<template>
  <div class="cell-wrapper">
    <span v-if="column.name !== 'id'">{{ value }}</span>
    <el-link
      v-if="column.name === 'id'"
      :icon="EluIconEdit"
      @click="click($event)"
    >
      <span>{{ value }}</span>
    </el-link>
  </div>
</template>

<script>
import { Edit as EluIconEdit } from '@element-plus/icons';
import BaseWidget from '@/modules/list/components/widgets/base-widget.vue';

export default {
  name: 'Guid',
  extends: BaseWidget,
  data() {
    return {
      EluIconEdit,
    };
  },
  with: '30',
};
</script>

<style scoped></style>
