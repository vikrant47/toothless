<template>
  <div class="en-query-builder">
    <div class="en-query-builder-wrapper">
      <div class="query-toolbar">
        <el-radio-group v-model="query.condition" size="mini">
          <el-radio-button model-value="AND" label="AND">AND</el-radio-button>
          <el-radio-button model-value="OR" label="OR">OR</el-radio-button>
        </el-radio-group>
        <div class="action-wrapper">
          <el-button
            type="success"
            plain
            :icon="EluIconPlus"
            size="mini"
            @click="addRule()"
          >Rule
          </el-button>
          <el-button
            type="success"
            plain
            :icon="EluIconDocumentAdd"
            size="mini"
            @click="addGroup()"
          >Group
          </el-button>
          <el-button
            type="danger"
            plain
            :icon="EluIconDelete"
            size="mini"
            @click="removeGroup()"
          />
        </div>
      </div>
      <div class="rules">
        <query-rule
          v-for="(rule, index) in query.rules"
          :key="rule.id"
          :value="rule"
          :fields="fields"
          :operator-mappings="operators"
          @add-rule="addRule(index)"
          @remove-rule="removeRule(index)"
          @input="ruleUpdated"
        />
      </div>
    </div>
    <div v-if="!inner" class="footer-actions">
      <el-button
        v-if="showApply"
        class="apply-filter"
        type="primary"
        :icon="EluIconSuccess"
        @click="applyFilter"
      >
        Apply
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Plus as EluIconPlus,
  DocumentAdd as EluIconDocumentAdd,
  Delete as EluIconDelete,
  SuccessFilled as EluIconSuccess,
} from '@element-plus/icons';
import {OPERATORS} from '@/modules/engine/components/query-builder/models/QueryOperator';
import QueryRule from '@/modules/engine/components/query-builder/QueryRule.vue';
import {Engine} from '@/modules/engine/core/engine';

export default defineComponent({
  name: 'QueryBuilder',
  components: {QueryRule},
  props: {
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
    operatorMappings: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      type: Object,
      default() {
        return {
          condition: 'AND',
          rules: [
            {
              field: '',
              operator: '',
              value: null,
              id: Engine.generateUniqueString('rule_'),
            },
          ],
        };
      },
    },
    inner: {
      type: Boolean,
      default() {
        return false;
      },
    },
    showApply: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    let query = Engine.clone(this.value);
    query = Object.assign({condition: 'AND'}, query);
    if (!query.rules) {
      query.rules = [
        {
          field: '',
          operator: '',
          value: null,
          id: Engine.generateUniqueString('rule_'),
        },
      ];
    }
    return {
      query: query,
      operators: Object.assign({}, OPERATORS, this.operatorMappings),
      EluIconPlus,
      EluIconDocumentAdd,
      EluIconDelete,
      EluIconSuccess,
    };
  },
  watch: {
    value(newVal, oldVal) {
      if (!newVal) {
        newVal = {
          condition: 'AND',
          rules: [
            {
              field: '',
              operator: '',
              value: null,
              id: Engine.generateUniqueString('rule_'),
            },
          ],
        };
      }
      this.query = newVal;
      if (!this.query.rules) {
        this.query.rules = [];
      }
    },
  },
  methods: {
    addGroup(condition = 'OR') {
      this.query.rules.push({
        id: Engine.generateUniqueString('group_'),
        condition: condition,
        rules: [{}],
      });
      this.queryUpdated();
    },
    addRule(index) {
      // this.query.rules.splice(index, 0, { field: '', operator: '', value: null });
      this.query.rules.push({
        id: Engine.generateUniqueString('rule_'),
        field: '',
        operator: '',
        value: null,
      });
      this.queryUpdated();
    },
    removeGroup() {
      this.$emit('remove-group');
    },
    removeRule(index) {
      this.query.rules.splice(index, 1);
      console.log(
        'rule removed at index ',
        index,
        JSON.parse(JSON.stringify(this.query.rules))
      );
      this.queryUpdated();
    },
    ruleUpdated(rule) {
      if(rule instanceof Event) return;
      for (const existingRule of this.query.rules) {
        if (existingRule.id === rule.id) {
          Object.assign(existingRule, rule);
        }
      }
      this.queryUpdated();
    },
    queryUpdated() {
      this.$emit('input', this.query);
    },
    applyFilter() {
      this.$emit('apply', this.query);
    },
  },
});
</script>

<style lang="scss" scoped>
.query-toolbar {
  padding: 5px;
}

.action-wrapper {
  display: flex;
  float: right;

  button {
    margin: 2px;
  }
}

.en-query-builder-wrapper {
  -webkit-box-shadow: rgb(149 157 165 / 20%) 3px 4px 5px;
  box-shadow: rgb(149 157 165 / 20%) 1px 3px 13px;
  margin: 10px;
  border: 1px solid #e3e3e3;
  padding-bottom: 10px;
}

.footer-actions {
  padding-right: 10px;

  .apply-filter {
    float: right;
  }
}
</style>
