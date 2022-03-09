<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <div class="action-form-wrapper" style="display: flex">
        <EnAction
          v-for="action in actions"
          :key="action.id"
          :action="action"
          :event="{
            form: engineForm,
          }"
          :context="{
            formComponent: $parent,
            engineForm: engineForm,
          }"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Vue } from '@/main';
import EnAction from '@/modules/engine/components/EnAction';

export default {
  name: 'EnFormToolbar',
  components: { EnAction },
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      engineForm: null,
      formEventHandler: null,
    };
  },
  created() {
    const engineForm = this.$parent.engineForm;
    const formEventHandler = this.$parent.formEventHandler;
    Vue.set(this, 'engineForm', engineForm);
    Vue.set(this, 'formEventHandler', formEventHandler);
    // this.$parent.crud.updateProp('searchToggle', true);
  },
  methods: {},
};
</script>

<style scoped>
.form-operations {
  float: right;
}
</style>
