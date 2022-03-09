import Render from '@/modules/form/components/widgets/form-designer/render/render';
import {FormWidgetService} from '@/modules/form/services/form.widget.service';
import {FORM_EVENTS, WidgetEvent} from '@/modules/form/engine-api/form-events';
import {EngineForm} from '@/modules/form/engine-api/engine.form';
import {TemplateEngine} from '@/modules/engine/core/template.engine';
import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import _ from 'lodash';
import {Engine} from '@/modules/engine/core/engine';

export default defineComponent({
  name: 'EnField',
  components: {Render},
  props: {
    value: {
      type: null,
      default() {
        return null;
      },
    },
    evalContext: {
      type: Object,
      default() {
        return {};
      },
    },
    widget: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      formData: {[this.$props['widget'].fieldName]: this.value},
    };
  },
  watch: {
    widget() {
      // this.$forceUpdate();
    },
    value(newValue) {
      this.formData = {[this.$props['widget'].fieldName]: newValue};
    },
  },
  mounted() {
  },
  methods: {
    sanitizeWidget() {
      const widget = this.$props['widget'];
      if (!(this.$props['widget'] instanceof BaseWidget)) {
        if (!widget.widgetSettings) {
          widget.widgetSettings = {label: '', showLabel: false};
        } else {
          Object.assign(widget.widgetSettings, {label: '', showLabel: false});
        }
        if (!widget.fieldName) {
          widget.fieldName = 'ruleValue';
        }
      }
      if (!widget.fieldName) {
        widget.fieldName = 'widget';
      }
      return widget;
    },
    getWidgetInstance(widgetJson, engineForm) {
      const widgetInstance = new FormWidgetService().getWidgetInstance(
        widgetJson
      );
      widgetInstance.setFormId(engineForm.getId());
      engineForm.addWidgetRef(widgetInstance);
      widgetInstance.setForm(engineForm);
      widgetInstance.init();
      // this.$options.widgets[fieldName] = widgetInstance;
      engineForm.triggerProcessors(
        new WidgetEvent(FORM_EVENTS.widget.init, widgetInstance, widgetJson),
        {}
      );
      return widgetInstance;
    },
    setValue(event, widget) {
      const previousValue = _.get(this.formData, widget.fieldName);
      // this.$set(config, 'defaultValue', event);
      if (previousValue !== event) {
        // TODO: handle concurrent field value update here using debounce
        if (widget.fieldName.indexOf('.') > 0) {
          const result = TemplateEngine.walk(
            widget.fieldName,
            this.formData,
            -1
          );
          result.value[result.prop] = event;
          delete this.formData[widget.fieldName];
        } else {
          this.formData[widget.fieldName] = event;
        }
        this.$props['engineForm'].setRecord(this.formData);
        this.$emit('fieldValueUpdated', widget, event);
        this.$props['engineForm'].triggerProcessors(
          new WidgetEvent(FORM_EVENTS.widget.updateValue, widget, {
            previous: previousValue,
            current: event,
            value: event,
          }),
          {}
        );
      }
    },
  },
  render() {
    const engineForm = new EngineForm();
    const widgetInstance = this.getWidgetInstance(
      Engine.clone(this.sanitizeWidget()),
      engineForm
    );
    Object.assign(this.formData, engineForm.getRecord());
    return (
      <div class='field-wrapper'>
        <el-form
          onSubmit={($event) => {
            this.$emit('submit');
            $event.preventDefault();
          }}
          // model cannot be assigned directly https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
          props={{model: this.formData}}
        >
          <render
            widget={widgetInstance}
            wrapper={true}
            formModel={this.formData}
            evalContext={this.$props['evalContext']}
            onInput_update={(event) => {
              this.setValue(event, widgetInstance);
              this.$emit('input', event);
            }}
          />
        </el-form>
      </div>
    );
  },
});
