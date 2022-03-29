import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import Markdown from '@/modules/form/components/widgets/richeditor/MarkDown.vue';
import {EngineForm} from '@/modules/form/engine-api/engine.form';
import {FormWidgetService} from '@/modules/form/services/form.widget.service';
import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';
import {EnginePopup} from '@/modules/engine/services/engine.popup';
import {Engine} from "@/modules/engine/core/engine";


export default class RicheditorWidget extends BaseWidget {
  static heights = {small: '200px', medium: '300px', large: '500px'}
  protected id = Engine.generateUniqueString();
  palletSettings = {
    label: 'Rich Editor',
    icon: 'edit',
  }

  overrideConfigSection(configSectionWidgets) {
    configSectionWidgets['fieldSettings.size'].slot.options = [
      {
        label: 'Small',
        value: 'small',
      },
      {
        label: 'Medium',
        value: 'medium',
      },
      {
        label: 'Large',
        value: 'large',
      },
    ];
    return configSectionWidgets;
  }

  overrideFieldSettings(fieldSettings) {
    Object.assign(fieldSettings, {
      language: 'en',
      subfield: false,
      defaultOpen: 'preview',
      editable: true,
    });
    if (!fieldSettings.value) {
      fieldSettings.value = '';
    }
    return fieldSettings;
  }

  getEvents() {
    const _this = this;
    return {
      onChange(value) {
        _this.setValue(value);
      },
    };
  }

  fullscreen = false
  codeView = false

  getHeight(config) {
    if (this.fullscreen) {
      return '100%';
    }
    return (
      RicheditorWidget.heights[config.size] ||
      RicheditorWidget.heights.small
    );
  }

  jsxRichEditorRender(h, config) {
    const options = {
      ...this.getEvents(),
      height: this.getHeight(config),
      value: this.getValue(),
    };
    const markDown = h(Markdown, options, this.getChildren());
    return (
      <div class='rich-editor-wrapper' id={'rich-editor-wrapper' + this.id}>
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
              'rich-editor-wrapper' + this.id
            );
            if (!this.fullscreen) {
              wrapper.className = 'rich-editor-wrapper full-screen';
              this.fullscreen = true;
            } else {
              wrapper.className = 'rich-editor-wrapper';
              this.fullscreen = false;
            }
            // markDown.props.height = '100%';
            this.repaint();
            return false;
          }}
        />
        <el-button
          type='button'
          class='el-button'
          icon='elu-icon-edit'
          style={{
            position: 'absolute',
            right: '50px',
            top: '0px',
            'z-index': '99',
          }}
          onClick={(event) => {
            const model = {[this.fieldName]: this.getValue()};
            const form = new EngineForm();
            form.setRecord(model);
            form.setFormConfig({
              widgets: new FormWidgetService().toWidgetInstance([
                {
                  id: 'html-code-editor' + this.id,
                  fieldName: this.fieldName,
                  widgetAlias: WIDGETS.codeEditor,
                  widgetSettings: {
                    width: '100%',
                    span: 24,
                    label: '',
                    showLabel: false,
                    language: 'html',
                  },
                },
              ]),
            });
            const popup = EnginePopup.open({
              destroyOnClose: true,
              id: 'code-view-' + this.id,
              size: 'large',
              title: 'Raw',
              component: {
                type: 'Parser',
                props: {
                  engineForm: form,
                },
              },
              actions: [
                {
                  label: 'OK',
                  script: () => {
                    this.setValue(form.getValue(this.fieldName));
                    popup.hide();
                  },
                },
              ],
            });
          }}
        />
        {markDown}
      </div>
    );
  }

  componentRender(component, h) {
    const config = this.getComponentConfig(component);
    return this.jsxRichEditorRender(h, config);
  }
}
