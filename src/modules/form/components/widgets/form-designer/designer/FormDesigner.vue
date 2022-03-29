<template>
  <div class="container">
<!--    <div v-if="showPallet === true" class="left-board">
      &lt;!&ndash;<div class="logo-wrapper">
          <div class="logo">
            <img alt="logo"> Form Generator
            <a class="github" href="https://github.com/JakHuang/form-generator" target="_blank">
              <img src="https://github.githubassets.com/pinned-octocat.svg" alt>
            </a>
          </div>
        </div>&ndash;&gt;
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
                    <svg-icon
                      :icon-class="element.palletSettings.icon || 'component'"
                    />
                    {{ element.palletSettings.label }}
                  </div>
                </div>
              </draggable>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-scrollbar>
    </div>

    <div
      :class="
        showPallet ? 'center-board center-board-with-pallet' : 'center-board'
      "
    >
      &lt;!&ndash;<div class="action-bar">
          <el-button icon="elu-icon-video-play" type="text" @click="run">
            run
          </el-button>
          <el-button icon="elu-icon-view" type="text" @click="showJson">
            View json
          </el-button>
          <el-button icon="elu-icon-download" type="text" @click="download">
            Export vue file
          </el-button>
          <el-button class="copy-btn-main" icon="elu-icon-document-copy" type="text" @click="copy">
            Copy code
          </el-button>
          <el-button class="delete-btn" icon="elu-icon-delete" type="text" @click="empty">
            Empty
          </el-button>
        </div>&ndash;&gt;
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
            class="drawing-form"
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable
              class="drawing-board"
              :list="drawingList"
              :animation="340"
              group="componentsGroup"
              @change="saveDrawingListDebounce(drawingList)"
            >
              <draggable-item
                v-for="(item, index) in drawingList"
                :key="item.renderKey"
                :drawing-list="drawingList"
                :current-widget="item"
                :index="index"
                :active-id="activeId"
                :form-conf="formConf"
                @activeWidget="activeDraggableItem"
                @copyWidget="addWidget"
                @deleteWidget="drawingItemDelete"
                @showConfig="showConfig"
                @syncConfig="syncConfig"
              />
              <div v-show="!drawingList.length" class="empty-info">
                Drag in or click on widgets from the left to design the form
              </div>
            </draggable>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>
    <div :id="'right-panel-wrapper-' + renderKey" class="right-panel-wrapper">
      <el-drawer
        v-model:visible="configVisible"
        :destroy-on-close="true"
        :modal-append-to-body="false"
        direction="rtl"
        :before-close="onConfigClose"
      >
        <right-panel
          :render-key="renderKey"
          :active-widget="activeWidget"
          :form-conf="formConf"
          :show-field="!!drawingList.length"
          @widget-change="tagChange"
          @fetch-data="fetchData"
          @sync-config="syncConfig"
        />
      </el-drawer>
    </div>
    <input id="copyNode" type="hidden">-->
  </div>
</template>

<script>
/*import draggable from 'vuedraggable';
import { debounce } from 'throttle-debounce';
import { saveAs } from 'file-saver';
import ClipboardJS from 'clipboard';
import RightPanel from '@/modules/form/components/widgets/form-designer/designer/RightPanel';
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf,
} from '@/modules/form/components/generator/config';
import { beautifierConf, titleCase, deepClone } from '@/modules/form/utils';
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle,
} from '@/modules/form/components/generator/html';
import { makeUpJs } from '@/modules/form/components/generator/js';
import { makeUpCss } from '@/modules/form/components/generator/css';
import drawingDefalut from '@/modules/form/components/generator/drawingDefalut';
import DraggableItem from '@/modules/form/components/widgets/form-designer/designer/DraggableItem';*/
import { getIdGlobal, saveIdGlobal } from '@/modules/form/utils/db';
/*
import loadBeautifier from '@/modules/form/utils/loadBeautifier';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';
import { Engine } from '@/modules/engine/core/engine';
import _ from 'lodash';
import { LAYOUT_WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { TemplateEngine } from '@/modules/engine/core/template.engine';
*/

let beautifier;
let oldActiveId;
let tempactiveWidget;
// const drawingListInDB = [];// getDrawingList();
// const formConfInDB = getFormConf();
const idGlobal = getIdGlobal();
export default {
  name: 'FormDesigner',
  /*components: {
    draggable,
    RightPanel,
    DraggableItem,
  },*/
  props: {
    showPallet: {
      type: Boolean,
      default: true,
    },
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
  /*data() {
    return {
      renderKey: 'KEY_Designer_' + new Date().getTime(),
      hash: null,
      activePallet: 'Fields',
      configVisible: false,
      logo: '',
      idGlobal,
      formConf: Engine.clone(formConf),
      inputComponents,
      selectComponents,
      layoutComponents,
      labelWidth: 100,
      drawingList: this.initDrawingList(
        Engine.clone((this.value && this.value.widgets) || [])
      ),
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
        this.drawingList = list || this.drawingList;
        const newHash = JSON.stringify(list);
        if (this.hash !== newHash) {
          this.updateValue();
          this.hash = newHash;
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
    'activeWidget.widgetSettings.label': function(val, oldVal) {
      if (
        this.activeWidget.placeholder === undefined ||
        !this.activeWidget.widgetSettings.widget ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeWidget.placeholder =
        this.activeWidget.placeholder.replace(oldVal, '') + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true,
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val);
      },
      immediate: true,
    },
    pallet: {
      handler(val) {
        // this.drawingList = [];
      },
    },
    value: {
      handler(val) {
        if (val.widgets && val.widgets.length > 0) {
          this.drawingList = this.initDrawingList(val.widgets);
        }
      },
    },
  },
  mounted() {
    if (this.drawingList.length > 0) {
      this.activeFormItem(this.drawingList[0]);
    }
    loadBeautifier((btf) => {
      beautifier = btf;
    });
    this.hash = JSON.stringify(this.drawingList);
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
    initDrawingList(drawingList) {
      for (const widget of drawingList) {
        if (!widget.widgetSettings.renderKey) {
          new FormWidgetService().createRenderKey(widget);
        }
      }
      return drawingList;
    },
    updateValue() {
      const value = Engine.clone(this.drawingList);
      this.$emit('update:modelValue', {
        widgets: value,
      }); // emitting event to top form item
      this.updateAllSelectedItems({ palletSettings: { hidden: true }});
      console.log('updated value ', value);
    },
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
    setObjectValueByStringKeys(obj, strKeys, val) {
      const arr = strKeys.split('.');
      arr.reduce((pre, item, i) => {
        if (arr.length === i + 1) {
          pre[item] = val;
        } else if (
          Object.prototype.toString.call(pre[item]) !== '[Object Object]'
        ) {
          pre[item] = {};
        }
        return pre[item];
      }, obj);
    },
    setRespData(component, respData) {
      const { dataPath, renderKey, dataConsumer } = component.widgetSettings;
      if (!dataPath || !dataConsumer) return;
      const data = dataPath
        .split('.')
        .reduce((pre, item) => pre[item], respData);
      this.setObjectValueByStringKeys(component, dataConsumer, data);
      const i = this.drawingList.findIndex(
        (item) => item.widgetSettings.renderKey === renderKey
      );
      if (i > -1) this.drawingList[ i] =  component;
    },
    fetchData(component) {
      const { dataType, method, url } = component.widgetSettings;
      if (dataType === 'dynamic' && method && url) {
        this.setLoading(component, true);
        this.$axios({
          method,
          url,
        }).then((resp) => {
          this.setLoading(component, false);
          this.setRespData(component, resp.data);
        });
      }
    },
    setLoading(component, val) {
      const { directives } = component;
      if (Array.isArray(directives)) {
        const t = directives.find((d) => d.name === 'loading');
        if (t) t.value = val;
      }
    },
    showConfig(currentItem) {
      this.activeFormItem(currentItem);
      this.configVisible = true;
    },
    findWidgetByKey(renderKey, drawingList) {
      for (let i = 0; i < drawingList.length; i++) {
        const item = drawingList[i];
        if (item.widgetSettings.renderKey === renderKey) {
          return item;
        }
        if (
          LAYOUT_WIDGETS.indexOf(item.widgetAlias) >= 0 &&
          item.widgetSettings.children
        ) {
          const childItem = this.findWidgetByKey(
            renderKey,
            item.widgetSettings.children
          );
          if (childItem) {
            return childItem;
          }
        }
      }
      return null;
    },
    syncConfig(property, widgetInstance) {
      if (property) {
        const widget = this.findWidgetByKey(
          widgetInstance.widgetSettings.renderKey,
          this.drawingList
        );
        if (widget) {
          const value = Engine.clone(_.get(widgetInstance, property));
          if (property.indexOf('.') > 0) {
            const result = TemplateEngine.walk(property, widget, -1);
            delete result.value[result.prop];
            _.set(result.value, result.prop, value);
          } else {
            _.set(widget, property, value);
          }
          this.saveDrawingListDebounce(this.drawingList);
          console.log(
            'config synced',
            widgetInstance.fieldName,
            property,
            value
          );
        } else {
          console.warn(
            'config synced failed! no widget found with key ',
            widgetInstance.widgetSettings.renderKey
          );
        }
      }
    },
    activeDraggableItem(currentItem) {
      this.activeFormItem(currentItem);
      // this.configVisible = true;
    },
    activeFormItem(currentItem) {
      //  new FormWidgetService().createIdAndKey(currentItem);
      this.activeWidget = currentItem;
      this.activeId = currentItem.widgetSettings.formId;
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.fetchData(tempactiveWidget);
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
      new FormWidgetService().createIdAndKey(clone);
      this.fetchData(clone);
      list.push(clone);
      this.activeFormItem(clone);
      this.updatedSelectedPalletItem(item, { palletSettings: { hidden: true }});
      this.saveDrawingListDebounce();
    },
    cloneWidget(original) {
      const clone = deepClone(original); // deepClone(origin);
      const fieldSettings = { clone };
      fieldSettings.span = this.formConf.span; // When generating code, it will make a streamlined judgment based on the span
      new FormWidgetService().createIdAndKey(clone);
      fieldSettings.placeholder !== undefined &&
        (clone.placeholder += fieldSettings.label);
      tempactiveWidget = clone;
      return tempactiveWidget;
    },
    AssembleFormData() {
      this.formModel = {
        fields: deepClone(this.drawingList),
        ...this.formConf,
      };
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`];
      this.generateConf = data;
      func && func(data);
    },
    execRun(data) {
      this.AssembleFormData();
      this.drawerVisible = true;
    },
    execDownload(data) {
      const codeStr = this.generateCode();
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, data.fileName);
    },
    execCopy(data) {
      document.getElementById('copyNode').click();
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
    drawingItemCopy(item, list) {
      const clone = deepClone(item);
      list.push(clone);
      this.activeFormItem(clone);
    },
    drawingItemDelete(index, list) {
      const item = list[index];
      list.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
        this.updatedSelectedPalletItem(item, {
          palletSettings: { hidden: false },
        });
        this.saveDrawingListDebounce();
      });
    },
    generateCode() {
      const { type } = this.generateConf;
      this.AssembleFormData();
      const script = vueScript(makeUpJs(this.formModel, type));
      const html = vueTemplate(makeUpHtml(this.formModel, type));
      const css = cssStyle(makeUpCss(this.formModel));
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    showJson() {
      this.AssembleFormData();
      this.jsonDrawerVisible = true;
    },
    download() {
      this.dialogVisible = true;
      this.showFileName = true;
      this.operationType = 'download';
    },
    run() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = 'run';
    },
    copy() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = 'copy';
    },
    tagChange(newTag) {
      newTag = this.cloneWidget(newTag);
      const config = newTag.widgetSettings;
      newTag.fieldName = this.activeWidget.fieldName;
      config.formId = this.activeId;
      config.span = this.activeWidget.widgetSettings.span;
      this.activeWidget.widgetSettings.widget = config.widget;
      this.activeWidget.widgetSettings.tagIcon = config.tagIcon;
      this.activeWidget.widgetSettings.document = config.document;
      if (
        typeof this.activeWidget.widgetSettings.defaultValue ===
        typeof config.defaultValue
      ) {
        config.defaultValue = this.activeWidget.widgetSettings.defaultValue;
      }
      Object.keys(newTag).forEach((key) => {
        if (this.activeWidget[key] !== undefined) {
          newTag[key] = this.activeWidget[key];
        }
      });
      this.activeWidget = newTag;
      this.updateDrawingList(newTag, this.drawingList);
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(
        (item) => item.widgetSettings.formId === this.activeId
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach((item) => {
          if (Array.isArray(item.widgetSettings.children))
          { this.updateDrawingList(newTag, item.widgetSettings.children); }
        });
      }
    },
    refreshJson(data) {
      this.drawingList = deepClone(data.widgets);
      delete data.widgets;
      this.formConf = data.formConf || Engine.clone(formConf);
    },
  },*/
};
</script>

<style lang="scss">
@import '../../../../styles/home';
</style>
