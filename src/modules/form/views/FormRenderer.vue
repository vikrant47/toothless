<template>
  <div class="app-container">
    <en-form
      :toolbar="true"
      :model-alias="modelAlias"
      :form-id="formId"
      :record-id="recordId"
      :remote="true"
      :preview-mode="view === 'preview'"
    />
  </div>
</template>

<script lang="ts">
import EnForm from '@/modules/form/components/engine/form/EnForm.vue';

export default {
  name: 'FormRenderer',
  components: { EnForm },
  props: {
    modelAlias: { type: String, default: null },
    recordId: { type: String, default: 'new' },
    formId: { type: String, default: 'default' },
    view: { type: String, default: 'edit' },
  },
  beforeCreate() {},
};
</script>

<style scoped></style>
