<template>
  <div class="cell-wrapper">
    <el-icon>
      <elu-icon-time/>
    </el-icon>
    <span v-if="value" style="margin-left: 10px">{{ format(value) }}</span>
  </div>
</template>

<script lang="ts">
import {Timer as EluIconTime} from '@element-plus/icons';
import BaseWidget from '@/modules/list/components/widgets/base-widget.vue';
import {DateTime} from "luxon";

export default defineComponent({
  name: 'Date',
  components: {
    EluIconTime,
  },
  extends: BaseWidget,
  methods: {
    format(value: string) {
      DateTime.fromJSDate(new Date(value), {zone: 'utc'}).toLocaleString(DateTime.DATETIME_MED)
    }
  }
});
</script>

<style scoped></style>
