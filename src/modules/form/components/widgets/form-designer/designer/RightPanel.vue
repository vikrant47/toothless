<script>
import { saveFormConf } from '@/modules/form/utils/db';
import Parser from '../render/Parser';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';
import { EngineForm } from '@/modules/form/engine-api/engine.form';
// Make the change Render Key available when the target component changes
import { Engine } from '@/modules/engine/core/engine';

export default {
  name: 'RightPanel',
  components: {
    Parser,
  },
  props: {
    renderKey: {
      type: String,
      default: null,
    },
    showField: {
      type: Boolean,
    },
    activeWidget: {
      type: Object,
      required: true,
    },
    formConf: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      id: new Date().getTime(),
      currentTab: 'advance',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      formModel: this.activeWidget,
    };
  },
  computed: {
    documentLink() {
      return (
        this.activeWidget.widgetSettings.document ||
        'https://element.eleme.cn/#/zh-CN/component/installation'
      );
    },
  },
  watch: {
    /* 'formModel': {
      handler(model) {
        debounce(() => { // intended delay
          for (const key in model) {
            this.activeWidget[ key] =  model[key];
          }
        }, 500);
      },
      deep: true
    },*/
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    onResize(event) {
      event.stopPropagation();
      // console.log(this);
      const wrapper = document.getElementById(
        'right-panel-wrapper-' + this.renderKey
      );
      const drawer = wrapper.firstChild.firstChild.firstChild;
      if (!this.fullscreen) {
        drawer.className = 'el-drawer rtl full-screen';
        this.fullscreen = true;
      } else {
        drawer.className = 'el-drawer rtl';
        this.fullscreen = false;
      }
      return false;
    },
    handleTabClick(tab, event) {},
    updateFieldValue(fieldName, value) {
      this.activeWidget[ fieldName] =  value;
      this.$emit('sync-config', fieldName, this.activeWidget);
    },
  },
  render(createElement) {
    // const activeWidget = new FormWidgetService().getWidgetInstance(this.activeWidget);
    const activeWidget = new FormWidgetService().getWidgetInstance(
      this.activeWidget
    );
    activeWidget.loadConfigForConfigSection();
    const widgetConfigForm = new EngineForm();
    widgetConfigForm.setFormConfig(activeWidget.loadBasicConfigSection());
    widgetConfigForm.setRecord(this.formModel);
    const advanceConfigForm = new EngineForm();
    advanceConfigForm.setFormConfig(activeWidget.loadAdvanceConfigSection());
    advanceConfigForm.setRecord(this.formModel);
    /* const formConfigForm = new EngineForm();
    formConfigForm.setFormConfig({
      labelSuffix: '',
      labelWidth: '100',
      labelPosition: 'right',
      widgets: DEFAULT_FORM_CONFIG.map(conf => new FormWidgetService().getWidgetInstance(
        Object.assign({
          widgetAlias: 'input'
        }, conf)))
    });
    formConfigForm.setRecord(activeWidget.configSection);*/
    const evalContext = { activeWidget: Engine.clone(activeWidget) };
    return (
      <div class='right-board' id={'right-board-' + this.id}>
        <el-button
          type='button'
          class='el-button'
          icon='elu-icon-full-screen'
          style={{
            position: 'absolute',
            right: '0px',
            top: '0px',
            'z-index': '9999',
          }}
          onClick={this.onResize}
        />
        <el-tabs v-model={this.currentTab} class='center-tabs'>
          <el-tab-pane label='Component properties' name='field'>
            <div class='field-box'>
              <el-scrollbar className='right-scrollbar'>
                {createElement(Parser, {
                  props: {
                    engineForm: widgetConfigForm,
                    evalContext: evalContext,
                  },
                  on: {
                    fieldValueUpdated: (widget, value) => {
                      this.updateFieldValue(widget.fieldName, value);
                    },
                  },
                })}
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label='Advance' name='advance'>
            <div class='field-box'>
              <el-scrollbar className='right-scrollbar'>
                {createElement(Parser, {
                  props: {
                    engineForm: advanceConfigForm,
                    evalContext: evalContext,
                  },
                  on: {
                    fieldValueUpdated: (widget, value) => {
                      this.updateFieldValue(widget.fieldName, value);
                    },
                  },
                })}
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label='Form attributes' name='form'>
            <div class='field-box'>
              <el-scrollbar className='right-scrollbar'>
                {/* createElement(Parser, { props: { engineForm: formConfigForm, evalContext: { evalContext: evalContext }}})*/}
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.right-board {
  height: 100%;
  overflow: hidden;
  /*width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;*/
  .el-tab {
    margin-bottom: 10px;
  }

  .el-form-item__content {
    display: flex;
  }

  .el-form-item--small {
    display: flex;
  }

  .field-box {
    margin: 10px;
  }
}
</style>
