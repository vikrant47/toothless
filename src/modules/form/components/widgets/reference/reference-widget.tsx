import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import {RestQuery} from '@/modules/engine/services/rest.query';
import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';
import {EngineScript} from '@/modules/engine/core/engine.script';

export default class ReferenceWidget extends BaseWidget {
  loading = false

  palletSettings = {
    label: 'Reference',
    icon: 'reference',
  }
  slot: any = {options: []}

  valueInitialized = false


  init() {
    super.init();
  }

  getEvents() {
    return {
      select(value) {
        // this.renderComponent.$emit('value', value);
      },
    };
  }

  options(h, key) {
    const list: any[] = [];
    this.slot.options.forEach((item: any) => {
      list.push(
        <el-option
          label={item.label}
          value={item.value}
          disabled={item.disabled}
        />
      );
    });
    return list;
  }

  overrideConfigSection(configSectionWidgets) {
    if (!this.isWidgetWithField()) {
      Object.assign(configSectionWidgets, {
        'widgetSettings.referenced_model_alias': {
          fieldName: 'widgetSettings.referenced_model_alias',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Reference Model',
            advance: true,
            referenced_model_alias: 'engine_models',
            referenced_field_name: 'alias',
            display_field_name: 'label',
          },
        },
        'widgetSettings.referenced_field_name': {
          fieldName: 'widgetSettings.referenced_field_name',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Reference Field',
            advance: true,
            referenced_model_alias: 'engine_fields',
            referenced_field_name: 'name',
            display_field_name: 'label',
          },
        },
        'widgetSettings.display_field_name': {
          fieldName: 'widgetSettings.display_field_name',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Display Field',
            advance: true,
            referenced_model_alias: 'engine_fields',
            referenced_field_name: 'name',
            display_field_name: 'label',
          },
        },
      });
    }
    configSectionWidgets['fieldSettings.interceptor'] = {
      fieldName: 'fieldSettings.interceptor',
      widgetAlias: WIDGETS.codeEditor,
      widgetSettings: {
        labelWidth: 0,
        span: 24,
        label: 'Interceptor',
        advance: true,
        language: 'javascript',
      },
    };
    return configSectionWidgets;
  }

  overrideFieldSettings(fieldSettings) {
    const _this = this;
    if (!fieldSettings.interceptor) {
      fieldSettings.interceptor = async (query, resolve) => {
        return await resolve(query);
      };
    } else {
      const interceptor = fieldSettings.interceptor;
      fieldSettings.interceptor = (query, resolve) => {
        return new EngineScript({script: interceptor}).execute(
          {query, resolve},
          this.buildContext()
        );
      };
    }
    return Object.assign(fieldSettings, {
      async remoteMethod(value) {
        fieldSettings.loading = true;
        const result = await fieldSettings.interceptor(
          {
            where: {
              [_this.widgetSettings.display_field_name]: {
                $regex: value,
              },
            },
            fields: [
              _this.widgetSettings.referenced_field_name,
              _this.widgetSettings.display_field_name,
            ],
          },
          async (query) => {
            const response = await new RestQuery(
              _this.widgetSettings.referenced_model_alias
            ).findAll(query);
            return response.contents;
          }
        );
        _this.renderComponent.$set(
          _this.slot,
          'options',
          result.map((rec) => {
            if (_this.isWidgetWithField()) {
              // store only id
              return {
                label: rec[_this.widgetSettings.display_field_name],
                value: rec[_this.widgetSettings.referenced_field_name],
              };
            }
            return {
              label: rec[_this.widgetSettings.display_field_name],
              value: JSON.stringify({
                label: rec[_this.widgetSettings.display_field_name],
                value: rec[_this.widgetSettings.referenced_field_name],
              }),
            };
          })
        );
        fieldSettings.loading = false;
        _this.repaint();
      },
      filterable: true,
      remote: true,
      reserveKeyword: true,
      loading: false,
    });
  }

  componentRender(component, h) {
    if (!this.valueInitialized) {
      const value = this.getValue();
      const refModel = this.formModel['ref_' + this.fieldName];
      if (refModel) {
        if (
          this.slot.options.findIndex((option: any) => option.value === value) < 0
        ) {
          this.slot.options.push({
            label: refModel[this.widgetSettings.display_field_name],
            value: value,
          });
        }
        this.valueInitialized = true;
      } else if (!this.isWidgetWithField() && value) {
        let parsedValue = value;
        try {
          parsedValue = JSON.parse(parsedValue);
          this.slot.options.push({label: parsedValue.label, value: value});
        } catch (e) {
          this.slot.options.push({label: value, value: value});
        }
      }
    }
    return h(
      'el-select',
      this.getComponentConfig(component),
      this.getChildren(h)
    );
  }
}
