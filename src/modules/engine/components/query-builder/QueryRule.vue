<template>
  <div class="rule-wrapper">
    <div v-if="rule.rules" class="nested-rule">
      <query-builder
        v-model="rule"
        :operator-mappings="operatorMappings"
        :fields="fields"
        :inner="true"
        @remove-group="removeRule(rule)"
        @input="ruleUpdated"
      />
    </div>
    <div v-else class="simple-rule">
      <el-row :gutter="24">
        <el-col :span="5">
          <el-select
            v-model="rule.field"
            placeholder="Select"
            filterable
            @input="ruleUpdated"
          >
            <el-option
              v-for="field in fields"
              :key="field.id"
              :value="field.name"
              :label="field.label"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <div class="operator-wrapper">
            <el-select
              v-model="rule.operator"
              placeholder="Select"
              filterable
              @input="ruleUpdated"
            >
              <el-option
                v-for="operator in operators"
                :key="operator.type"
                :value="operator.type"
                :label="operator.label"
              />
            </el-select>
            <el-tooltip content="Expression" placement="top">
              <el-switch v-model="rule.expression" @input="$forceUpdate()" />
            </el-tooltip>
          </div>
        </el-col>
        <el-col v-if="widget" :span="12">
          <en-field
            v-if="inputs === 1"
            :value="rule.data.value"
            :widget="widget"
            @input="valueUpdated"
          />
          <div v-else class="multi-input">
            <en-field
              v-for="index in inputs"
              :key="index"
              :value="rule.data.value[index - 1]"
              :widget="getWidgetConfigByIndex(index - 1)"
              @input="valueUpdated($event, index - 1)"
            />
          </div>
        </el-col>
        <el-col :span="2">
          <div class="action-wrapper">
            <el-button
              type="danger"
              plain
              :icon="EluIconDelete"
              size="mini"
              @click="removeRule(rule)"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Delete as EluIconDelete } from '@element-plus/icons';
import EnField from '@/modules/form/components/engine/field/EnField';
import { FieldTypeWidget } from '@/modules/engine/components/query-builder/models/QueryFieldTypeWdiegt';
import { Engine } from '@/modules/engine/core/engine';
import { EngineForm } from '@/modules/form/engine-api/engine.form';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export default defineComponent({
  name: 'QueryRule',
  components: {
    EnField,
    QueryBuilder: () => {
      return import('@/modules/engine/components/query-builder/QueryBuilder');
    },
  },
  props: {
    fields: {
      type: Array,
      required: true,
    },
    operatorMappings: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      // {"id":"category","field":"category","type":"integer","input":"select","operator":"equal","value":2}
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      rule: Engine.clone(
        Object.assign(
          { operator: 'equal', data: { value: this.value['value'] }},
          this.value
        )
      ),
      EluIconDelete,
    };
  },
  computed: {
    inputs() {
      return this.getInputCount();
    },
    widget() {
      if (
        this.rule.operator &&
        this.operatorMappings[this.rule.operator].nb_inputs === 0
      ) {
        return null;
      }
      return (this.rule.field && this.getFieldWidget(this.rule.field)) || null;
    },
    operators() {
      const field = this.fields.find((field) => field.name === this.rule.field);
      if (field) {
        return Object.values(this.operatorMappings).filter(
          (operator) => operator.apply_to.indexOf(field.type) >= 0
        );
      }
      return [];
    },
  },
  watch: {
    value(newVal, oldVal) {
      this.rule = this.propValueToRule(newVal);
    },
  },
  methods: {
    getWidgetConfigByIndex(index) {
      return Object.assign({}, this.widget, {
        fieldName: 'ruleValue' + (index - 1),
      });
    },
    propValueToRule(propValue) {
      const rule = propValue;
      const inputCount = this.getInputCount();
      if (inputCount > 1 && !Array.isArray(rule.value)) {
        const value = rule.value;
        rule.value = new Array(inputCount);
        rule.value[0] = value;
      }
      rule.data.value = rule.value;
      return rule;
    },
    getInputCount() {
      return this.rule.operator
        ? this.operatorMappings[this.rule.operator].nb_inputs
        : 0;
    },
    getFieldWidget(fieldName) {
      let widget = null;
      if (!this.rule.expression) {
        const field = this.fields.find((field) => field.name === fieldName);
        if (!field) {
          return null;
        }
        widget = Object.assign({}, FieldTypeWidget[field.type]);
        const engineForm = new EngineForm();
        engineForm.setDefinition({ fields: [field] });
        engineForm.fillFieldConfig(fieldName, widget);
        Object.assign(widget.fieldSettings, {
          readOnly: false,
          disabled: false,
        });
      } else {
        widget = Object.assign({}, FieldTypeWidget['string']);
      }
      widget.fieldName = 'ruleValue';
      widget.fieldRecord = null;
      widget.id = Engine.generateUniqueString('rule_widget_');
      return widget;
    },
    updateValue(widget, value) {
      this.rule.value = value;
      this.ruleUpdated();
    },
    addRule(rule) {
      this.$emit('add-rule');
    },
    removeRule() {
      this.$emit('remove-rule');
    },
    ruleUpdated() {
      this.$emit('input', this.rule);
    },
    valueUpdated(value, index) {
      const inputCount = this.getInputCount();
      if (inputCount > 1) {
        if (!this.rule.value) {
          this.rule.value = Array(inputCount);
        }
        this.rule.value[index] = value;
      } else {
        if (this.widget.widgetAlias === WIDGETS.reference) {
          value = JSON.parse(value);
          this.rule.value = value.value;
          // this.rule.data.label = value.label;
        } else {
          this.rule.value = value;
        }
      }
      this.$emit('input', this.rule);
    },
  },
});
</script>

<style lang="scss" scoped>
.action-wrapper {
  display: flex;

  button {
    margin: 2px;
  }
}

.simple-rule {
  .el-col {
    padding-left: 5px !important;
  }
}

.rule-wrapper {
  padding: 5px 5px 0;
  margin-left: 5px;

  .multi-input {
    display: flex;
  }

  .el-select {
    width: 100%;
  }

  .operator-wrapper {
    display: flex;

    .el-switch {
      margin-left: 10px;
      margin-top: 5px;
    }
  }
}
</style>
