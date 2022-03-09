<template>
  <button
    class="el-button"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
      },
    ]"
    @click="handleClick"
  >
    <el-icon><elu-icon-loading /></el-icon>
    <i v-if="icon && !loading" :class="icon" />
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>

<script>
import { Loading as EluIconLoading } from '@element-plus/icons';
import { EventProcessor } from '@/modules/engine/core/event.processor';

export default {
  name: 'EnAction',
  components: {
    EluIconLoading,
  },
  inject: {
    elForm: {
      default: '',
    },
    elFormItem: {
      default: '',
    },
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {
          script: '()=>{}',
        };
      },
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
  },
  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    buttonDisabled() {
      return this.data.disabled;
    },
  },
  methods: {
    disable() {
      this.model.disabled = true;
    },
    handleClick(evt) {
      this.model.script.call(this, EventProcessor.buildContext({ event: evt }));
    },
  },
};
</script>
