<template>
  <el-row :gutter="24">
    <el-col :span="17">
      <div class="action-list-wrapper" style="display: flex">
        <EnAction
          v-for="action in actions"
          :key="action.id"
          :action="action"
          :event="actionEvent"
          :context="{
            listComponent: $parent,
            engineList: engineList,
          }"
        />
      </div>
    </el-col>
    <el-col :span="7">
      <div class="list-operations">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
          :suffix-icon="EluIconSearch"
          style="width: 218px"
          @keyup.enter="$emit('on-search', search)"
          @keyup="$emit('onSearchKeyUp', search)"
        />
        <el-button-group class="crud-opts-right">
          <el-popover placement="bottom-end" width="150" trigger="click">
            <el-button
              :type="!allColumnsSelected ? 'info' : ''"
              size="small"
              :icon="EluIconSGrid"
            >
              <i class="fa fa-caret-down" aria-hidden="true"/>
            </el-button>
            <el-checkbox
              v-model="allColumnsSelected"
              :indeterminate="allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              Select All
            </el-checkbox>
            <el-checkbox
              v-for="item in fields"
              :key="item.name"
              v-model="item.visible"
              @change="handleCheckedTableColumnsChange(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-popover>
        </el-button-group>
        <el-badge
          :model-value="
            engineList.filterQuery && engineList.filterQuery.rules.length
          "
          class="item"
          type="primary"
        >
          <el-button class="search-button" @click="openSearchDrawer">
            <el-icon>
              <elu-icon-search/>
            </el-icon>
          </el-button>
        </el-badge>
      </div>
    </el-col>
    <el-drawer
      v-model="showSearchDrawer"
      title="Search"
      direction="rtl"
      :before-close="handleSearchClose"
      variant="temporary"
      size="40%"
    >
      <div class="list-filter">
        <query-builder
          v-model="filterQuery"
          :fields="engineList.getFields()"
          show-apply
          @apply="$emit('applyFilter', $event)"
        />
      </div>
    </el-drawer>
  </el-row>
</template>

<script lang="ts">
import {
  Search as EluIconSearch,
  Grid as EluIconSGrid,
} from '@element-plus/icons';
import {Engine} from '@/modules/engine/core/engine';
import EnAction from '@/modules/engine/components/EnAction.vue';
import {LIST_EVENTS, ListEvent} from '@/modules/list/engine-api/list-events';
import {EngineList} from '@/modules/list/engine-api/engine.list';
import QueryBuilder from '@/modules/engine/components/query-builder/QueryBuilder.vue';
import {shallowRef, ref, computed} from 'vue'

export default defineComponent({
  name: 'EnListToolbar',
  components: {
    QueryBuilder,
    EnAction,
    EluIconSearch: shallowRef(EluIconSearch),
  },
  props: {
    engineList: {
      type: EngineList,
      required: true,
    },
    searchValue: {
      type: String,
      default: '',
    },
    hiddenColumns: {
      type: Array,
      default: () => [],
    },
    ignoreColumns: {
      type: Array,
      default: () => [],
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filterQuery: {condition: 'AND'},
      showSearchDrawer: false,
      listEventHandler: null,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      tableUnwatcher: null,
      // Ignore the next table column change
      ignoreNextTableColumnsChange: false,
      fields: this.engineList.getWidgets(),
      search: '',
      actionEvent: new ListEvent(LIST_EVENTS.action.click, this.engineList),
      EluIconSearch,
      EluIconSGrid,
    };
  },
  created() {
    //@ts-ignore
    const listEventHandler = this.$parent?.listEventHandler;
    this['listEventHandler'] = listEventHandler;
    this['search'] = this.searchValue;
    // this.$parent.crud.updateProp('searchToggle', true);
  },
  methods: {
    handleCheckAllChange(val) {
      if (val === true) {
        this.allColumnsSelected = true;
        return;
      }
      this.allColumnsSelected = val;
      this.allColumnsSelectedIndeterminate = false;
    },
    handleCheckedTableColumnsChange(item) {
      let totalCount = 0;
      let selectedCount = 0;
      this.fields.forEach((column) => {
        ++totalCount;
        selectedCount += column.visible ? 1 : 0;
      });
      if (selectedCount === 0) {
        Engine.notify(this.$parent, {
          title: 'Please select at least one column',
          type: Engine.NOTIFICATION_TYPE.WARNING,
        });
        return;
      }
      this.$nextTick(function () {
        //  item.visible = true;
      });
      this.allColumnsSelected = selectedCount === totalCount;
      this.allColumnsSelectedIndeterminate =
        selectedCount !== totalCount && selectedCount !== 0;
    },
    handleSearchClose() {
      this.showSearchDrawer = false;
      return true;
    },
    openSearchDrawer() {
      this.showSearchDrawer = true;
    },
    toggleSearch() {
      this.showSearchDrawer = !this.showSearchDrawer;
    },
    applyFilter(query) {
    },
  },
});
</script>

<style lang="scss" scoped>
.list-operations {
  float: right;
}

.list-filter {
}
</style>
