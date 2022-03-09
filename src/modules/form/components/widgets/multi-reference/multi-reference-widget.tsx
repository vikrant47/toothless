import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import {RestQuery} from '@/modules/engine/services/rest.query';
import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';

export default class MultiReferenceWidget extends BaseWidget {
  loading = false

  palletSettings = {
    label: 'Multi Reference',
    icon: 'reference',
  }
  slot = {options: []}

  valueInitialized = false
  association: any = null
  multiReferenceData: any;

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
    const list: any = [];
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
        'widgetSettings.model_association_id': {
          fieldName: 'widgetSettings.model_association_id',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Association',
            advance: true,
            referenced_model_alias: 'engine_model_associations',
            referenced_field_name: 'id',
            display_field_name: 'label',
          },
        },
        'widgetSettings.display_field_name': {
          fieldName: 'widgetSettings.display_field_name',
          widgetAlias: WIDGETS.reference,
          fieldSettings: {},
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
        'widgetSettings.source_field_value': {
          fieldName: 'widgetSettings.source_field_value',
          widgetAlias: WIDGETS.input,
          fieldSettings: {},
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Source Value',
            advance: true,
          },
        },
        'widgetSettings.sortable': {
          fieldName: 'widgetSettings.sortable',
          widgetAlias: WIDGETS.switch,
          fieldSettings: {},
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Sortable',
            advance: true,
          },
        },
        'widgetSettings.sort_field': {
          fieldName: 'widgetSettings.sort_field',
          widgetAlias: WIDGETS.reference,
          fieldSettings: {},
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Sort Field',
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
    /* const _this = this;
    if (!fieldSettings.interceptor) {
      fieldSettings.interceptor = async(query, resolve) => {
        return await resolve(query);
      };
    } else {
      const interceptor = fieldSettings.interceptor;
      fieldSettings.interceptor = (query, resolve) => {
        return new EngineScript({ script: interceptor }).execute({ query, resolve }, this.buildContext());
      };
    }
    return Object.assign(fieldSettings, {
      async remoteMethod(value) {
        fieldSettings.loading = true;
        const result = await fieldSettings.interceptor({
          where: {
            [_this.association.display_field_name]: {
              '$regex': value
            }
          },
          fields: [_this.association.referenced_field_name, _this.association.display_field_name]
        }, async(query) => {
          const response = await new RestQuery(_this.association.referenced_model_alias).findAll(query);
          return response.contents;
        });
        _this.renderComponent.$set(_this.slot, 'options', result.map(rec => {
          return {
            label: rec[_this.association.display_field_name],
            value: rec[_this.association.referenced_field_name]
          };
        }));
        fieldSettings.loading = false;
        _this.repaint();
      },
      props: {
        key: _this.association.through_target_field_id,
        label: _this.association.display_field_name
      },
      filterable: true,
      remote: true,
      reserveKeyword: true,
      loading: false
    });*/
    return fieldSettings;
  }

  async mounted() {
    this.loading = true;
    let association = await new RestQuery('engine_model_associations').findById(
      this.widgetSettings.model_association_id
    );
    association = this.association = association.contents;
    const result = await new RestQuery(
      this.association.referenced_model_alias
    ).findAll({
      fields: [
        'id',
        this.widgetSettings.display_field_name || '$display_field',
      ],
      include: [
        {
          $fields: [
            association.through_target_field_id,
            association.through_source_field_id,
          ],
          fields: this.widgetSettings.sortable
            ? ['id', this.widgetSettings.sort_field]
            : ['id'],
          as: 'ref_through_records',
          $reference: association.through_target_field_id,
          $modelAlias: association.through_model_id,
          required: false,
          where: {
            ['$' + association.through_source_field_id]:
            this.widgetSettings.source_field_value,
          },
        },
      ],
    });
    this.multiReferenceData = result.contents;
    const selected = this.multiReferenceData.filter(
      (data) => data.ref_through_records.length > 0
    );
    this.setValue(
      selected.map(function (s) {
        return s.id;
      })
    );
    super.mounted();
    this.loading = false;
    this.repaint();
  }

  componentRender(component, h) {
    //  await this.waitFor('mounted');

    return this.jsxRender(h, component);
  }

  checkedForSort = []
  sortOrders = {}

  jsxRender(h, component) {
    const config = this.getComponentConfig(component);
    /* const value = this.getValue();
    if (this.widgetSettings.sortable && value) {

    }*/
    Object.assign(config.attrs, {
      data: this.multiReferenceData,
      titles: ['Available', 'Selected'],
      rightDefaultChecked: this.checkedForSort,
      props: {
        key: 'id',
        label: this.widgetSettings.display_field_name || 'label',
      },
      on: {
        selected: null,
        rightCheckChange(selected) {
          this.selected = selected;
        },
      },
      'v-loading': this.loading,
    });
    if (this.widgetSettings.sortable) {
      Object.assign(config, {
        scopedSlots: {
          default: (props) => {
            const record = props.option;
            const ref_through_records = record.ref_through_records;
            let sortOrder = 0;
            if (ref_through_records.length > 0) {
              sortOrder = ref_through_records[0][this.widgetSettings.sort_field];
            }
            return (
              <div>
                <span>
                  {record[this.widgetSettings.display_field_name || 'label']}
                </span>
                <el-input-number
                  min={0}
                  max={1000}
                  class='sort-order'
                  value={sortOrder}
                  onInput={(value) => {
                    sortOrder = value;
                    this.sortOrders[record.id] = sortOrder;
                  }}
                />
              </div>
            );
          },
        },
      });
    }
    const $transfer = h('el-transfer', config, this.getChildren(h));
    /* if (this.widgetSettings.sortable) {
      return (
        <div class='transfer-wrapper'>
          {$transfer}
          <div class='sort-wrapper'>
            <div class='actions'>
              <el-button class='move-up' type='primary' size='small' icon='elu-icon-arrow-up' onClick={event => {

              }}></el-button>
              <el-button class='move-down' type='primary' size='small' icon='elu-icon-arrow-down' onClick={event => {
              }}></el-button>
            </div>
          </div>
        </div>
      );
    }*/
    return <div class='transfer-wrapper'>{$transfer}</div>;
  }

  async save() {
    const assigned = this.getValue();
    // const previous = this.multiReferenceData.filter(d => d[through] && d[through].length > 0).map(d => d.id);
    await new RestQuery('').request({
      url: '/api/crm/associations/' + this.association.id + '/bulk-assign',
      method: 'post',
      data: {
        assigned: assigned.map((id) => {
          return {id: id, sort_order: this.sortOrders[id]};
        }),
        sourceValue: this.widgetSettings.source_field_value,
      },
    });
  }
}
