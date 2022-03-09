import MonacoEditor from 'vue-monaco';
import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';
import RicheditorWidget from '@/modules/form/components/widgets/richeditor/richeditor-widget';

export default class CodeEditorWidget extends RicheditorWidget {
  formItemConfig = {}
  palletSettings = {
    label: 'Rich Editor',
    icon: 'edit',
  }
  fullscreen = false
  private width: number;
  private height: number;

  overrideConfigSection(configSectionWidgets) {
    Object.assign(configSectionWidgets, {
      'widgetSettings.parse': {
        fieldName: 'widgetSettings.parse',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          label: 'Parse JSON',
          advance: true,
        },
      },
      'widgetSettings.language': {
        fieldName: 'widgetSettings.language',
        widgetAlias: WIDGETS.select,
        widgetSettings: {
          label: 'Language',
        },
        slot: {
          options: [
            {
              label: 'Javascript',
              value: 'javascript',
            },
            {
              label: 'Html',
              value: 'html',
            },
            {
              label: 'Css',
              value: 'css',
            },
            {
              label: 'Plain',
              value: 'plain',
            },
            {
              label: 'JSON',
              value: 'json',
            },
            {
              label: 'Php',
              value: 'php',
            },
            {
              label: 'Rich Editor',
              value: 'rich_editor',
            },
          ],
        },
      },
    });
    return configSectionWidgets;
  }

  overrideWidgetSettings(widgetSettings) {
    return widgetSettings;
  }

  overrideFieldSettings(fieldSettings) {
    if (!fieldSettings.value) {
      fieldSettings.value = '';
    }
    return fieldSettings;
  }

  getEvents(config?: any): any {
    const _this = this;
    if (this.widgetSettings.language === 'rich_editor') {
      return super.getEvents();
    }
    return {
      change(value) {
        if (typeof value === 'string' && config.parse === true) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // add validator for invalid json
          }
        }
        _this.setValue(value);
      },
    };
  }

  updateLanguage(language) {
    this.widgetSettings.language = language;
    this.repaint();
  }

  jsxRender(h, config) {
    this.width = config.width;
    this.height = config.height;
    let value = config.attrs.value;
    if (value && config.parse === true && typeof value !== 'string') {
      value = JSON.stringify(config.attrs.value);
    }
    const options = {
      on: this.getEvents(config),
      style: {
        width: config.width,
        height: config.height,
      },
      props: {
        language: config.language,
        options: {automaticLayout: true},
        value: value || '',
      },
    };
    const vEditor = h(MonacoEditor, options);
    setTimeout(() => {
      const editor = vEditor.componentInstance.getEditor();
      if (editor) {
        editor.layout();
      }
    }, 500); // render issue fixed
    return (
      <div
        class='code-editor-wrapper'
        id={'code-editor-wrapper' + this.id}
        style={{width: this.width}}
      >
        <el-button
          type='button'
          class='el-button'
          icon='elu-icon-full-screen'
          style={{
            position: 'absolute',
            right: '0px',
            top: '0px',
            'z-index': '99',
          }}
          onClick={(event) => {
            event.stopPropagation();
            // console.log(this);
            const wrapper: any = document.getElementById(
              'code-editor-wrapper' + this.id
            );
            if (!this.fullscreen) {
              wrapper.className = 'code-editor-wrapper full-screen';
              this.fullscreen = true;
            } else {
              wrapper.className = 'code-editor-wrapper';
              this.fullscreen = false;
            }
            setTimeout(() => {
              const editor = vEditor.componentInstance.getEditor();
              editor.layout();
            }, 500);
            return false;
          }}
        />
        {vEditor}
      </div>
    );
  }

  componentRender(component, h) {
    const config = this.getComponentConfig();
    if (config.language === 'rich_editor') {
      return RicheditorWidget.prototype.componentRender.call(this, component, h);
    }
    return this.jsxRender(h, config);
  }
}
