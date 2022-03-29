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
import {useRoute} from 'vue-router'

export default {
  name: 'FormRenderer',
  components: {EnForm},
  data() {
    const route = useRoute();
    return {
      modelAlias: route.params.modelAlias,
      recordId: route.params.recordId,
      formId: route.params.formId,
      view: route.params.view,
    }
  },
  beforeCreate() {
  },
};
</script>

<style scoped></style>
