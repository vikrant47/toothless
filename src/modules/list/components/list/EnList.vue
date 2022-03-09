<template>
  <div v-loading="engineList.loading" class="list-container-wrapper">
    <div v-if="engineList.definitionLoaded" class="list-container">
      <!--Toolbar-->
      <div class="head-container">
        <en-list-toolbar
          v-if="toolbar"
          :engine-list="engineList"
          :search-value="engineList.quickSearchValue"
          :actions="engineList.actions"
          @on-search="engineList.search($event)"
          @applyFilter="engineList.applyFilter($event)"
        />
        <slot name="toolbar"/>
      </div>
      <!-- <pre>{{ engineList.definition.list.columns|json }}</pre>-->
      <!--Table rendering-->
      <div class="list-view-wrapper">
                <TabularListView
                  ref="viewRef"
                  :engine-list="engineList"
                  :list-fields="listFields"
                  :list-event-handler="listEventHandler"
                  @cellClick="cellClick"
                />
        <!--Paging component-->
        <div class="list-footer">
          <en-pagination
            :pagination-model="engineList.pagination"
            @refresh-click="engineList.refresh()"
          />
        </div>
      </div>
      <slot name="footer"/>
    </div>
  </div>
</template>

<script lang="ts">
import EnListToolbar from '@/modules/list/components/toolbar/EnListToolbar.vue';
import EnPagination from '@/modules/list/components/pagination/EnPagination.vue';
import {EngineList} from '@/modules/list/engine-api/engine.list';
import {ListEventHandler} from '@/modules/list/services/list.event.handler';
import {Pagination} from '@/modules/list/models/pagination';
import {LIST_EVENTS, ListEvent} from '@/modules/list/engine-api/list-events';
import TabularListView from "@/modules/list/components/list/TabularListView.vue";

export default defineComponent({
  name: 'EnList',
  components: {
    TabularListView,
  EnListToolbar,
    EnPagination
  },
  mixins: [],
  props: {
    lazy: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 460,
    },
    rows: {
      type: Array,
      default: null,
    },
    modelAlias: {
      type: String,
      required: true,
    },
    fields: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pagination: {
      type: Object,
      default: null,
    },
    remote: {
      type: Boolean,
      default: true,
    },
    toolbar: {
      type: Boolean,
      default: true,
    },
    selection: {
      type: String,
      default: 'multiple',
    },
    actions: {
      type: Array,
      default: null,
    },
    list: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      listEventHandler: new ListEventHandler(this),
      listFields: [],
      paginationModel: new Pagination(this.pagination),
      engineList: new EngineList({
        pagination: this.paginationModel,
        remote: this.remote,
        loaderDelay: this.loaderDelay,
        modelAlias: this.modelAlias,
        list: this.list,
        fields: this.fields,
        rows: this.rows || [],
        actions: this.actions || [],
      }),
    };
  },
  mounted() {
    this.$emit('mounted', this.engineList);
  },
  beforeCreate() {
    this.$emit('beforeCreate', this.engineList);
  },
  created() {
    this.$emit('created', this.engineList);
    if (!this.lazy) {
      this.loadList();
    }
    // Vue.set(this, 'engineList', engineList);
  },
  methods: {
    loadList() {
      this.engineList.loadDefinition().then(() => {
        this.listFields = this.engineList.getWidgets();
        this.engineList.$viewRef = this.$refs.viewRef;
        this.$emit('definitionLoaded', this.engineList);
      });
    },
    async cellClick($event, row, column) {
      const listEvent = new ListEvent(LIST_EVENTS.cell.click, this.engineList);
      Object.assign(listEvent, {
        rowData: row,
        columnData: column,
        original: $event,
      });
      await this.engineList.triggerProcessors(listEvent, {});
      this.$emit('cellClick', $event, row, column);
    },
    copy() {
      /*for (const key in this.currentRow) {
        this.form[key] = this.currentRow[key];
      }
      this.form.id = null;
      this.form.createTime = null;
      this.crud.toAdd();*/
    },
  },
});
</script>

<style scoped></style>
