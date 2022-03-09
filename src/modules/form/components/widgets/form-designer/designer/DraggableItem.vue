<script>
import draggable from 'vuedraggable';
import render from '@/modules/form/components/widgets/form-designer/render/render';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';

const components = {
  itemBtns(h, currentWidget, index, list) {
    const { copyWidget, deleteWidget, showConfig } = this.$listeners;
    return [
      <span
        class='drawing-item-copy'
        title='Copy'
        onClick={(event) => {
          copyWidget(currentWidget, list);
          event.stopPropagation();
        }}
      >
        <i class='elu-icon-copy-document' />
      </span>,
      <span
        class='drawing-item-delete'
        title='Delete'
        onClick={(event) => {
          deleteWidget(index, list);
          event.stopPropagation();
        }}
      >
        <i class='elu-icon-delete' />
      </span>,
      <span
        class='drawing-item-config'
        title='Configurations'
        onClick={(event) => {
          showConfig(currentWidget, list);
          event.stopPropagation();
        }}
      >
        <i class='elu-icon-setting' />
      </span>,
    ];
  },
};
const layouts = {
  colFormItem(h, currentWidget, index, list) {
    const widgetInstance = new FormWidgetService().getWidgetInstance(
      currentWidget
    );
    widgetInstance.designMode = true;
    const { activeWidget } = this.$listeners;
    const config = widgetInstance.widgetSettings;
    const child = renderChildren.apply(this, arguments);
    let className =
      this.activeId === config.formId
        ? 'drawing-item active-from-item'
        : 'drawing-item';
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered';
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    return (
      <el-col
        span={config.span}
        class={className}
        nativeOnClick={(event) => {
          activeWidget(currentWidget);
          event.stopPropagation();
        }}
      >
        <el-form-item
          label-width={labelWidth}
          label={config.showLabel ? config.label : ''}
          required={config.required}
        >
          <render
            key={config.renderKey}
            wrapper={false}
            widget={widgetInstance}
            form-model={this.formModel}
            field-name={config.renderKey}
            onInputUpdate={(event) => {
              this.formModel[ widgetInstance.fieldName] =  event;
              widgetInstance.widgetSettings[ 'defaultValue'] =  event;
            }}
            onSyncConfig={(property) => {
              this.$emit('syncConfig', property, widgetInstance);
              this.$listeners.syncConfig(property, widgetInstance);
            }}
          >
            {child}
          </render>
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    );
  },
  rowFormItem(h, currentWidget, index, list) {
    const { activeWidget } = this.$listeners;
    const config = currentWidget.widgetSettings;
    const className =
      this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
    let child = renderChildren.apply(this, arguments);
    if (currentWidget.type === 'flex') {
      child = (
        <el-row
          type={currentWidget.type}
          justify={currentWidget.justify}
          align={currentWidget.align}
        >
          {child}
        </el-row>
      );
    }
    return (
      <el-col span={config.span}>
        <el-row
          gutter={config.gutter}
          class={className}
          nativeOnClick={(event) => {
            activeWidget(currentWidget);
            event.stopPropagation();
          }}
        >
          <span class='component-name'>{config.componentName}</span>
          <draggable
            list={config.children || []}
            animation={340}
            group='componentsGroup'
            class='drag-wrapper'
          >
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    );
  },
  raw(h, currentWidget, index, list) {
    const config = currentWidget.widgetSettings;
    const child = renderChildren.apply(this, arguments);
    return (
      <render
        key={config.renderKey}
        widget={currentWidget}
        form-model={{}}
        field-name={config.renderKey}
        onInput={(event) => {
          config[ 'defaultValue'] =  event;
        }}
      >
        {child}
      </render>
    );
  },
};

function renderChildren(h, currentWidget, index, list) {
  const config = currentWidget.widgetSettings;
  if (!Array.isArray(config.children)) return null;
  return config.children.map((el, i) => {
    const layout = layouts[el.widgetSettings.layout];
    if (layout) {
      return layout.call(this, h, el, i, config.children);
    }
    return layoutIsNotFound.call(this);
  });
}

function layoutIsNotFound() {
  throw new Error(
    `No matching layout found ${this.currentWidget.widgetSettings.layout}`
  );
}

export default {
  components: {
    render,
    draggable,
  },
  props: {
    currentWidget: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      default() {
        return -1;
      },
    },
    drawingList: {
      type: Array,
      required: true,
    },
    activeId: {
      type: Number,
      default() {
        return null;
      },
    },
    formConf: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formModel: {},
    };
  },
  render(h) {
    const layout = layouts[this.currentWidget.widgetSettings.layout];

    if (layout) {
      return layout.call(
        this,
        h,
        this.currentWidget,
        this.index,
        this.drawingList
      );
    }
    return layoutIsNotFound.call(this);
  },
};
</script>
