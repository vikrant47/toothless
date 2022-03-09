<template>
  <div class="cell-wrapper">
    <el-link @click="click($event)">
      <span>{{ value }}</span>
      <el-icon><elu-icon-link /></el-icon>
    </el-link>
  </div>
</template>

<script>
import { Link as EluIconLink } from '@element-plus/icons';
import BaseWidget from '@/modules/list/components/widgets/base-widget.vue';

export default {
  name: 'ReferenceWidget',
  components: {
    EluIconLink,
  },
  extends: BaseWidget,
  computed: {
    value() {
      return this.row['ref_' + this.column.name]
        ? this.row['ref_' + this.column.name][this.column.display_field_name]
        : this.row[this.column.name];
    },
  },
};
</script>

<style scoped></style>
