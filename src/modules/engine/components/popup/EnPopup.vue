<template>
  <el-dialog
    v-model:visible="model.visible"
    :title="model.title"
    :width="model.width"
    :before-close="model.close"
    @closed="model.onClosed()"
  >
    <div v-loading="model.loading" class="popup-wrapper">
      <component
        :is="model.component.type"
        ref="componentInstance"
        v-bind="model.component.props"
        class="popup-body"
      />
    </div>
    <div #footer class="dialog-footer">
      <en-action
        v-for="action in model.actions"
        :key="action.id"
        :action="action"
        :event="{}"
        :context="{
          popup: model,
        }"
      />
    </div>
  </el-dialog>
</template>

<script>
import { EnginePopup } from '@/modules/engine/services/engine.popup';
import EnAction from '@/modules/engine/components/EnAction.vue';

export default {
  name: 'EnPopup',
  components: { EnAction },
  props: {
    model: {
      type: EnginePopup,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      // eslint-disable-next-line vue/no-mutating-props
      this.model.$refs = this.$refs;
      this.model.mounted();
    });
  },
};
</script>

<style scoped>
.dialog-footer {
  display: inline-flex;
}

.dialog-footer .action-wrapper {
  margin: 2px;
}
</style>
