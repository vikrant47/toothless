<template>
  <div class="related-records">
    <el-tabs type="border-card" @tab-click="tabClick($event)">
      <el-tab-pane
        v-for="item in relatedRecords"
        :key="item.id"
        class="related-record-item"
        :label="item.label"
      >
        <div
          v-if="item.type === 'list' || item.type === 'association'"
          class="related-record-list"
        >
          <en-list
            ref="items"
            :model-alias="item.referenced_model_alias"
            :lazy="true"
            :pagination="{}"
            :toolbar="true"
            :list="item.referenced_list_id"
            :remote="true"
            @created="listMounted($event, item)"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { EngineForm } from '@/modules/form/engine-api/engine.form';
import EnList from '@/modules/list/components/list/EnList.vue';
import { FORM_EVENTS } from '@/modules/form/engine-api/form-events';

export default {
  name: 'RelatedRecord',
  components: { EnList },
  props: {
    engineForm: {
      type: EngineForm,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      relatedRecords: [],
      initialized: false,
    };
  },
  mounted() {
    this.engineForm.on(FORM_EVENTS.model.fetch, () => {
      // related records must be rendered after data fetch
      this.relatedRecords = this.engineForm
        .getRelatedRecords()
        .map((record) => {
          if (record.type === 'association') {
            const association = record.ref_model_association_id;
            record.referenced_model_alias = association.referenced_model_alias;
            record.referenced_model_id = association.referenced_model_id;
          }
          return record;
        });
    });
  },
  updated() {
    if (!this.initialized && this.relatedRecords.length > 0) {
      this.$refs.items[0].loadList();
      this.initialized = true;
    }
  },
  methods: {
    tabClick(tab) {
      this.$refs.items[tab.index].loadList();
    },
    async listMounted(list, relatedRecord) {
      // await this.engineForm.waitFor(FORM_EVENTS.model.fetch);
      if (relatedRecord.type === 'association') {
        list.addContext('relatedListParentForm', this.engineForm);
        list.setModelAssociation(relatedRecord.ref_model_association_id);
        const association = relatedRecord.ref_model_association_id;
        list.on('beforeQuery', (query) => {
          query.include.push({
            $fields: [
              association.through_target_field_id,
              association.through_source_field_id,
            ],
            fields: ['id'],
            as: 'ref_through_records',
            $reference: association.through_target_field_id,
            $modelAlias: association.through_model_id,
            required: true,
            where: {
              ['$' + association.through_source_field_id]:
                this.engineForm.getOriginalValue(
                  association.source_field_name || 'id'
                ),
            },
          });
        });
      } else {
        const referencedField = relatedRecord.ref_referenced_field_id;
        list.setCondition({
          [relatedRecord.referenced_field_name]: this.engineForm.getValue(
            referencedField.referenced_field_name
          ),
        });
      }
      // list.setCondition({ [relatedRecord.referenced_field_name]: form.getValue() });
    },
  },
};
</script>

<style scoped></style>
