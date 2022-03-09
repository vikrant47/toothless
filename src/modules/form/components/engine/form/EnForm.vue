<template>
  <div v-loading="engineForm.loading" class="form-container">
    <div v-if="toolbar" class="head-container">
      <en-form-toolbar :actions="engineForm.actions" />
    </div>
    <div class="form-parser-wrapper">
      <parser
        :key="engineForm.hashCode"
        :engine-form="engineForm"
        @submit="submitForm"
      />
    </div>
    <div
      v-if="showRelatedRecords && engineForm.relatedRecords.length"
      class="related-record-wrapper"
    >
      <RelatedRecord :engine-form="engineForm" />
    </div>
  </div>
</template>

<script>
import { Vue } from '@/main';
import Parser from '@/modules/form/components/widgets/form-designer/render/Parser';
import { EngineForm } from '@/modules/form/engine-api/engine.form';
import { FormEventHandler } from '@/modules/form/services/form.event.handler';
import locale from 'element-plus/lib/locale/lang/en';
import ElementUI from 'element-plus';
import EnFormToolbar from '@/modules/form/components/engine/toolbar/EnFormToolbar';
import { FORM_EVENTS, FormEvent } from '@/modules/form/engine-api/form-events';
import RelatedRecord from '@/modules/form/components/engine/form/RelatedRecord';

Vue.use(ElementUI, { locale });
export default {
  name: 'EnForm',
  components: { RelatedRecord, EnFormToolbar, Parser },
  props: {
    previewMode: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: Boolean,
      default: false,
    },
    showRelatedRecords: {
      type: Boolean,
      default: true,
    },
    formConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    modelAlias: {
      type: String,
      required: false,
      default: '',
    },
    recordId: {
      type: String,
      default: 'new',
    },
    remote: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Array,
      default: null,
    },
    formId: {
      type: String,
      default: 'default',
    },
    controls: {
      type: Object,
      default: () => {
        return {
          tabs: [],
        };
      },
    },
    record: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      engineForm: new EngineForm({
        previewMode: this.previewMode,
        formConfig: this.formConfig,
        remote: this.remote,
        modelAlias: this.modelAlias,
        formId: this.formId,
        recordId: this.recordId,
        controls: this.controls,
        record: this.record || {},
        actions: this.actions || [],
      }),
    };
  },
  beforeCreate() {
    this.formEventHandler = new FormEventHandler(this);
  },
  async mounted() {
    await this.engineForm.loadDefinition();
    if (!this.engineForm.isNew()) {
      await this.engineForm.refresh();
    } else {
      this.engineForm.setRecord({});
    }
    await this.engineForm.triggerProcessors(
      new FormEvent(FORM_EVENTS.form.afterRender),
      {}
    );
  },
  beforeUnmount() {
    this.engineForm.triggerProcessors(
      new FormEvent(FORM_EVENTS.form.beforeDestroy),
      {}
    );
  },
  updated() {
    this.engineForm.triggerProcessors(
      new FormEvent(FORM_EVENTS.form.beforeRender),
      {}
    );
  },
  methods: {
    submitForm() {},
  },
};
</script>

<style lang="scss">
.form-parser-wrapper {
  margin-bottom: 15px;
}
@import '../../../styles/home';
@import '../../../styles/index';
@import '../../../styles/mixin';
</style>
