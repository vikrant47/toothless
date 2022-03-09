<template>
  <div class="container">
    <div class="left-board">
      <el-scrollbar class="left-scrollbar">
        <el-tab-pane class="components-list">
          <el-tabs model-value="Fields" :stretch="true">
            <el-tab-pane
              v-for="(item, listIndex) in getFilteredPallet()"
              :key="listIndex"
              :label="item.title"
              :name="item.title"
            >
              <draggable
                class="components-draggable"
                :list="item.list"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneWidget"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in item.list"
                  :key="index"
                  :v-if="!element.palletSettings.hidden"
                  class="components-item"
                  @click="addWidget(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.palletSettings.icon" />
                    {{ element.palletSettings.label }}
                  </div>
                </div>
              </draggable>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-scrollbar>
    </div>

    <div class="center-board center-board-with-pallet">
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="24">
          <draggable
            class="drawing-board"
            :list="drawingList"
            :animation="340"
            group="componentsGroup"
          >
            <el-row
              v-for="(element, index) in drawingList"
              :key="element.label"
              class="draggable-item field-wrapper"
              :gutter="24"
            >
              <el-col class="field-item" :span="22">
                {{ element.label }}
              </el-col>
              <el-col class="delete-item" :span="2">
                <span
                  class="drawing-item-delete"
                  title="Delete"
                  @click="drawingItemDelete(index, drawingList)"
                >
                  <el-icon><elu-icon-delete /></el-icon>
                </span>
              </el-col>
            </el-row>
            <div v-show="!drawingList.length" class="empty-info">
              Drag in or click on widgets from the left to design the form
            </div>
          </draggable>
        </el-row>
      </el-scrollbar>
    </div>
    <input id="copyNode" type="hidden">
  </div>
</template>

<script>
import { Delete as EluIconDelete } from '@element-plus/icons';

import draggable from 'vuedraggable';
import { debounce } from 'throttle-debounce';
import ClipboardJS from 'clipboard';
import { deepClone } from '@/modules/form/utils';
import drawingDefalut from '@/modules/form/components/generator/drawingDefalut';
import { saveIdGlobal } from '@/modules/form/utils/db';

let tempactiveWidget;
// const drawingListInDB = [];// getDrawingList();
// const formConfInDB = getFormConf();
let hash = null;
export default {
  name: 'ListDesigner',
  components: {
    draggable,
    EluIconDelete,
  },
  props: {
    value: {
      type: Object,
      default() {
        return { widgets: [] };
      },
    },
    pallet: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activePallet: 'Fields',
      configVisible: false,
      labelWidth: 100,
      drawingList: (this.value && this.value.widgets) || [],
      drawingData: {},
      activeId: drawingDefalut[0].formId,
      drawerVisible: false,
      formModel: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeWidget: drawingDefalut[0],
      saveDrawingListDebounce: debounce(340, (list) => {
        const newHash = JSON.stringify(list);
        if (list.length > 0 && hash !== newHash) {
          this.$emit('input', {
            widgets: list.map((field) => {
              return { id: field.id, label: field.label, name: field.name };
            }),
          }); // emitting event to top form item
          hash = newHash;
        }
        // return saveDrawingList(list.map(widget => Engine.marshall(widget, new FormWidgetService().getWidgetInstance(widget))));
      }),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      leftComponents: this.pallet,
    };
  },
  computed: {
    filteredPallet() {
      return this.getFilteredPallet();
    },
  },
  watch: {
    // eslint-disable-next-line func-names
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val);
        if (val.length === 0) {
          this.idGlobal = 100;
        } else {
          this.updateAllSelectedItems({ palletSettings: { hidden: true }});
        }
      },
      deep: true,
    },
    pallet: {
      handler(val) {
        // this.drawingList = [];
      },
    },
    value: {
      handler(val) {
        if (val.widgets && val.widgets.length > 0) {
          this.drawingList = val.widgets;
        }
      },
    },
  },
  mounted() {
    if (this.drawingList.length > 0) {
      this.activeFormItem(this.drawingList[0]);
    }
    const clipboard = new ClipboardJS('#copyNode', {
      text: (trigger) => {
        const codeStr = this.generateCode();
        this.$notify({
          title: 'success',
          message:
            'The code has been copied to the clipboard and can be pasted.',
          type: 'success',
        });
        return codeStr;
      },
    });
    clipboard.on('error', (e) => {
      this.$message.error('Code copy failed');
    });
  },
  created() {
    this.updateAllSelectedItems({ palletSettings: { hidden: true }});
  },
  methods: {
    getFilteredPallet() {
      return this.pallet.map((palletItem) => {
        return Object.assign({}, palletItem, {
          list: palletItem.list.filter((item) => !item.palletSettings.hidden),
        });
      });
    },
    onConfigClose(done) {
      done();
    },
    activeDraggableItem(currentItem) {
      this.activeFormItem(currentItem);
      // this.configVisible = true;
    },
    activeFormItem(currentItem) {
      //  new FormWidgetService().createIdAndKey(currentItem);
      this.activeWidget = currentItem;
      // this.activeId = currentItem.widgetSettings.formId;
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeWidget = tempactiveWidget;
        this.activeId = this.idGlobal;
      }
    },
    updatedSelectedPalletItem(selectedItem, props) {
      for (const pallet of this.pallet) {
        if (pallet.updatable === true) {
          for (const item of pallet.list) {
            if (selectedItem.id === item.id) {
              Object.assign(item.palletSettings, props.palletSettings);
            }
          }
        }
      }
    },
    updateAllSelectedItems(prop) {
      const selectedItems = this.drawingList;
      for (const selectedItem of selectedItems) {
        this.updatedSelectedPalletItem(selectedItem, prop);
      }
    },
    addWidget(item, list) {
      list = list || this.drawingList;
      const clone = deepClone(item);
      list.push(clone);
      this.activeFormItem(clone);
      this.updatedSelectedPalletItem(item, { palletSettings: { hidden: true }});
    },
    drawingItemDelete(index, list) {
      const item = list[index];
      list.splice(index, 1);
      this.$nextTick(() => {
        this.updatedSelectedPalletItem(item, {
          palletSettings: { hidden: false },
        });
      });
    },
    cloneWidget(original) {
      const clone = deepClone(original); // deepClone(origin);
      tempactiveWidget = clone;
      return tempactiveWidget;
    },
    empty() {
      this.$confirm(
        'Are you sure you want to clear all components?',
        'Prompt',
        { type: 'warning' }
      ).then(() => {
        this.drawingList = [];
        this.idGlobal = 100;
      });
    },
  },
};
</script>

<style scoped>
.drawing-board {
  width: 100%;
  height: 100%;
}

.field-item {
  padding: 5px;
  text-align: center;
}

.field-wrapper {
  margin: 5px !important;
  background-color: #ffffff;
  border: 1px dashed #09a6f1;
  border-radius: 2px;
  cursor: pointer;
}
</style>
