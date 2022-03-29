import {EngineForm} from '@/modules/form/engine-api/engine.form';
import FormDesignerWidget from '@/modules/form/components/widgets/form-designer/form-designer-widget';
import FormDesigner from '@/modules/form/components/widgets/form-designer/designer/FormDesigner.vue';
import Parser from '@/modules/form/components/widgets/form-designer/render/Parser';
import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';
import draggable from 'vue3-draggable';
import _ from 'lodash';
import {FormWidgetService} from "@/modules/form/services/form.widget.service";

export default class RepeaterWidget extends FormDesignerWidget {
  forms
  palletSettings = {
    label: 'Repeater',
    icon: 'elu-icon-coin',
  }
  transient = [
    'transient',
    'forms',
    'configSection',
    'evalContext',
    'transient',
    'eventSeen',
    'events',
    'waitPromises',
    'evalContext',
    'data',
    'componentConfig',
    'fieldSettings..*',
    'widgetSettings..*',
  ]

  overrideConfigSection(configSectionWidgets) {
    return Object.assign(configSectionWidgets, {
      'widgetSettings.doNotRepeat': {
        fieldName: 'widgetSettings.doNotRepeat',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          labelWidth: 100,
          span: 24,
          label: 'Single',
          advance: true,
        },
      },
    });
  }

  overrideWidgetSettings(widgetSettings) {
    if (!widgetSettings.repeaterConfig) {
      widgetSettings.repeaterConfig = {widgets: []};
      widgetSettings.doNotRepeat = false;
    }
    return widgetSettings;
  }

  getValue() {
    let value = _.get(this.formModel, this.fieldName);
    if (!this.designMode) {
      if (!value || value.length === 0) {
        value = [{}];
        _.set(this.formModel, this.fieldName, value);
      }
    }
    return value;
  }

  unmarshallWidgets(widgets) {
    return widgets.map((marshalledWidget) => {
      marshalledWidget.widgetAlias = marshalledWidget.widgetAlias
        ? marshalledWidget.widgetAlias
        : WIDGETS.input;
      const widget = new FormWidgetService().getWidgetInstance(marshalledWidget);
      return widget;
    });
  }

  buildRepeaterItem(index, itemValue) {
    const config = this.widgetSettings.repeaterConfig;
    const value = this.getValue();
    if (itemValue) {
      value[index] = itemValue;
    }
    const form = new EngineForm();
    if (config) {
      form.setFormConfig({widgets: this.unmarshallWidgets(config.widgets)});
    }
    form.setRecord(value[index]);
    return form;
  }

  addRepeaterItem(index, itemValue) {
    this.buildRepeaterItem(index, itemValue);
    const value = this.getValue();
    this.setValue(value);
  }

  deleteRepeaterItem(index) {
    const value = this.getValue();
    value.splice(index, 1);
    this.forms.splice(index, 1);
    this.setValue(value);
  }

  componentRender(component, h) {
    // const config = this.getComponentConfig(component);
    if (this.designMode) {
      return h(
        FormDesigner,
        {
          on: {
            input: (value) => {
              this.widgetSettings.repeaterConfig = value;
              this.syncConfig('widgetSettings.repeaterConfig');
            },
          },
          props: {
            showPallet: false,
            value: this.widgetSettings.repeaterConfig,
            pallet: [],
          },
        },
        this.getChildren()
      );
    } else {
      const value = this.getValue();
      this.forms = value.map((record, i) => {
        return this.buildRepeaterItem(i, record);
      });
      return this.getRepeaterTemplate(h, value);
    }
  }

  getRepeaterTemplate(h, value) {
    return (
      <draggable
        class={
          'repeater-wrapper ' +
          (this.widgetSettings.doNotRepeat === true
            ? 'repeater-wrapper-no-repeat'
            : '')
        }
        list={value}
        animation='340'
        onChange={() => {
          this.setValue(value);
          this.repaint();
        }}
      >
        {this.forms.map((form, index) => {
          return (
            <div class='repeater-item'>
              <button
                class='close-btn'
                type='button'
                title='Delete'
                onClick={(event) => {
                  this.deleteRepeaterItem(index);
                  this.repaint();
                  event.stopPropagation();
                }}
              >
                <i class='elu-icon-close'/>
              </button>
              {h(Parser, {
                style: {
                  padding: '0',
                },
                engineForm: form, evalContext: {},
                onFieldValueUpdated: () => {
                  const value = this.getValue();
                  value[index] = form.getRecord();
                  this.setValue(value);
                },
              })}
            </div>
          );
        })}
        <el-button
          class='add-item'
          title='Add'
          size='mini'
          type='primary'
          onClick={(event) => {
            this.addRepeaterItem(this.forms.length, {});
            this.repaint();
            event.stopPropagation();
          }}
        >
          <i class='elu-icon-document-add'/>
          Add
        </el-button>
      </draggable>
    );
  }
}
