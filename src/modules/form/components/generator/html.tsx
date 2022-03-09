/* eslint-disable max-len */
import ruleTrigger from './ruleTrigger';

let confGlobal;
let someSpanIsNot24;

export function dialogWrapper(str) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`;
}

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`;
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`;
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`;
}

function buildFormTemplate(scheme, child, type) {
  let labelPosition = '';
  if (scheme.labelPosition !== 'right') {
    labelPosition = `label-position="${scheme.labelPosition}"`;
  }
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : '';
  let str = `<el-form ref="${scheme.formRef}" :model="${
    scheme.formModel
  }" :rules="${scheme.formRules}" size="${
    scheme.size
  }" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition}>
      ${child}
      ${buildFromBtns(scheme, type)}
    </el-form>`;
  if (someSpanIsNot24) {
    str = `<el-row :gutter="${scheme.gutter}">
        ${str}
      </el-row>`;
  }
  return str;
}

function buildFromBtns(scheme, type) {
  let str = '';
  if (scheme.formBtns && type === 'file') {
    str = `<el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>`;
    if (someSpanIsNot24) {
      str = `<el-col :span="24">
          ${str}
        </el-col>`;
    }
  }
  return str;
}

// span不为24的用el-col包裹
function colWrapper(scheme, str) {
  if (someSpanIsNot24 || scheme.component.span !== 24) {
    return `<el-col :span="${scheme.component.span}">
      ${str}
    </el-col>`;
  }
  return str;
}

const layouts = {
  colFormItem(scheme) {
    const config = scheme.component;
    let labelWidth = '';
    let label = `label="${config.label}"`;
    if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`;
    }
    if (config.showLabel === false) {
      labelWidth = 'label-width="0"';
      label = '';
    }
    const required =
      !ruleTrigger[config.widget] && config.required ? 'required' : '';
    const tagDom = tags[config.widget] ? tags[config.widget](scheme) : null;
    let str = `<el-form-item ${labelWidth} ${label} prop="${scheme.fieldName}" ${required}>
        ${tagDom}
      </el-form-item>`;
    str = colWrapper(scheme, str);
    return str;
  },
  rowFormItem(scheme) {
    const config = scheme.component;
    const type = scheme.type === 'default' ? '' : `type="${scheme.type}"`;
    const justify =
      scheme.type === 'default' ? '' : `justify="${scheme.justify}"`;
    const align = scheme.type === 'default' ? '' : `align="${scheme.align}"`;
    const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : '';
    const children = config.children.map((el) =>
      layouts[el.component.layout](el)
    );
    let str = `<el-row ${type} ${justify} ${align} ${gutter}>
      ${children.join('\n')}
    </el-row>`;
    str = colWrapper(scheme, str);
    return str;
  },
};

const tags = {
  'el-button': (el) => {
    const {widget, disabled} = attrBuilder(el);
    const type = el.type ? `type="${el.type}"` : '';
    const icon = el.icon ? `icon="${el.icon}"` : '';
    const round = el.round ? 'round' : '';
    const size = el.size ? `size="${el.size}"` : '';
    const plain = el.plain ? 'plain' : '';
    const circle = el.circle ? 'circle' : '';
    let child = buildElButtonChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${widget} ${type} ${icon} ${round} ${size} ${plain} ${disabled} ${circle}>${child}</${widget}>`;
  },
  'el-input': (el) => {
    const {widget, disabled, vModel, clearable, placeholder, width} =
      attrBuilder(el);
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : '';
    const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : '';
    const readonly = el.readonly ? 'readonly' : '';
    const prefixIcon = el['prefix-icon']
      ? `prefix-icon='${el['prefix-icon']}'`
      : '';
    const suffixIcon = el['suffix-icon']
      ? `suffix-icon='${el['suffix-icon']}'`
      : '';
    const showPassword = el['show-password'] ? 'show-password' : '';
    const type = el.type ? `type="${el.type}"` : '';
    const autosize =
      el.autosize && el.autosize.minRows
        ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
        : '';
    let child = buildElInputChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${widget} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${widget}>`;
  },
  'el-input-number': (el) => {
    const {widget, disabled, vModel, placeholder} = attrBuilder(el);
    const controlsPosition = el['controls-position']
      ? `controls-position=${el['controls-position']}`
      : '';
    const min = el.min ? `:min='${el.min}'` : '';
    const max = el.max ? `:max='${el.max}'` : '';
    const step = el.step ? `:step='${el.step}'` : '';
    const stepStrictly = el['step-strictly'] ? 'step-strictly' : '';
    const precision = el.precision ? `:precision='${el.precision}'` : '';

    return `<${widget} ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${disabled}></${widget}>`;
  },
  'el-select': (el) => {
    const {widget, disabled, vModel, clearable, placeholder, width} =
      attrBuilder(el);
    const filterable = el.filterable ? 'filterable' : '';
    const multiple = el.multiple ? 'multiple' : '';
    let child = buildElSelectChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${widget} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${widget}>`;
  },
  'el-radio-group': (el) => {
    const {widget, disabled, vModel} = attrBuilder(el);
    const size = `size="${el.size}"`;
    let child = buildElRadioGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${widget} ${vModel} ${size} ${disabled}>${child}</${widget}>`;
  },
  'el-checkbox-group': (el) => {
    const {widget, disabled, vModel} = attrBuilder(el);
    const size = `size="${el.size}"`;
    const min = el.min ? `:min="${el.min}"` : '';
    const max = el.max ? `:max="${el.max}"` : '';
    let child = buildElCheckboxGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${widget} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${widget}>`;
  },
  'el-switch': (el) => {
    const {widget, disabled, vModel} = attrBuilder(el);
    const activeText = el['active-text']
      ? `active-text="${el['active-text']}"`
      : '';
    const inactiveText = el['inactive-text']
      ? `inactive-text="${el['inactive-text']}"`
      : '';
    const activeColor = el['active-color']
      ? `active-color="${el['active-color']}"`
      : '';
    const inactiveColor = el['inactive-color']
      ? `inactive-color="${el['inactive-color']}"`
      : '';
    const activeValue =
      el['active-value'] !== true
        ? `:active-value='${JSON.stringify(el['active-value'])}'`
        : '';
    const inactiveValue =
      el['inactive-value'] !== false
        ? `:inactive-value='${JSON.stringify(el['inactive-value'])}'`
        : '';

    return `<${widget} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${widget}>`;
  },
  'el-cascader': (el) => {
    const {widget, disabled, vModel, clearable, placeholder, width} =
      attrBuilder(el);
    const options = el.options ? `:options="${el.fieldName}Options"` : '';
    const props = el.props ? `:props="${el.fieldName}Props"` : '';
    const showAllLevels = el['show-all-levels']
      ? ''
      : ':show-all-levels="false"';
    const filterable = el.filterable ? 'filterable' : '';
    const separator = el.separator === '/' ? '' : `separator="${el.separator}"`;

    return `<${widget} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></${widget}>`;
  },
  'el-slider': (el) => {
    const {widget, disabled, vModel} = attrBuilder(el);
    const min = el.min ? `:min='${el.min}'` : '';
    const max = el.max ? `:max='${el.max}'` : '';
    const step = el.step ? `:step='${el.step}'` : '';
    const range = el.range ? 'range' : '';
    const showStops = el['show-stops']
      ? `:show-stops="${el['show-stops']}"`
      : '';

    return `<${widget} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${widget}>`;
  },
  'el-time-picker': (el) => {
    const {widget, disabled, vModel, clearable, placeholder, width} =
      attrBuilder(el);
    const startPlaceholder = el['start-placeholder']
      ? `start-placeholder="${el['start-placeholder']}"`
      : '';
    const endPlaceholder = el['end-placeholder']
      ? `end-placeholder="${el['end-placeholder']}"`
      : '';
    const rangeSeparator = el['range-separator']
      ? `range-separator="${el['range-separator']}"`
      : '';
    const isRange = el['is-range'] ? 'is-range' : '';
    const format = el.format ? `format="${el.format}"` : '';
    const valueFormat = el['value-format']
      ? `value-format="${el['value-format']}"`
      : '';
    const pickerOptions = el['picker-options']
      ? `:picker-options='${JSON.stringify(el['picker-options'])}'`
      : '';

    return `<${widget} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${disabled}></${widget}>`;
  },
  'el-date-picker': (el) => {
    const {widget, disabled, vModel, clearable, placeholder, width} =
      attrBuilder(el);
    const startPlaceholder = el['start-placeholder']
      ? `start-placeholder="${el['start-placeholder']}"`
      : '';
    const endPlaceholder = el['end-placeholder']
      ? `end-placeholder="${el['end-placeholder']}"`
      : '';
    const rangeSeparator = el['range-separator']
      ? `range-separator="${el['range-separator']}"`
      : '';
    const format = el.format ? `format="${el.format}"` : '';
    const valueFormat = el['value-format']
      ? `value-format="${el['value-format']}"`
      : '';
    const type = el.type === 'date' ? '' : `type="${el.type}"`;
    const readonly = el.readonly ? 'readonly' : '';

    return `<${widget} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${widget}>`;
  },
  'el-rate': (el) => {
    const {widget, disabled, vModel} = attrBuilder(el);
    const max = el.max ? `:max='${el.max}'` : '';
    const allowHalf = el['allow-half'] ? 'allow-half' : '';
    const showText = el['show-text'] ? 'show-text' : '';
    const showScore = el['show-score'] ? 'show-score' : '';

    return `<${widget} ${vModel} ${max} ${allowHalf} ${showText} ${showScore} ${disabled}></${widget}>`;
  },
  'el-color-picker': (el) => {
    const {widget, disabled, vModel} = attrBuilder(el);
    const size = `size="${el.size}"`;
    const showAlpha = el['show-alpha'] ? 'show-alpha' : '';
    const colorFormat = el['color-format']
      ? `color-format="${el['color-format']}"`
      : '';

    return `<${widget} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${widget}>`;
  },
  'el-upload': (el) => {
    const {widget} = el.component;
    const disabled = el.disabled ? ":disabled='true'" : '';
    const action = el.action ? `:action="${el.fieldName}Action"` : '';
    const multiple = el.multiple ? 'multiple' : '';
    const listType =
      el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : '';
    const accept = el.accept ? `accept="${el.accept}"` : '';
    const name = el.name !== 'file' ? `name="${el.name}"` : '';
    const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : '';
    const beforeUpload = `:before-upload="${el.fieldName}BeforeUpload"`;
    const fileList = `:file-list="${el.fieldName}fileList"`;
    const ref = `ref="${el.fieldName}"`;
    let child = buildElUploadChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${widget} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${widget}>`;
  },
  tinymce: (el) => {
    const {widget, vModel, placeholder} = attrBuilder(el);
    const height = el.height ? `:height="${el.height}"` : '';
    const branding = el.branding ? `:branding="${el.branding}"` : '';
    return `<${widget} ${vModel} ${placeholder} ${height} ${branding}></${widget}>`;
  },
};

function attrBuilder(el) {
  return {
    widget: el.component.widget,
    vModel: `v-model="${confGlobal.formModel}.${el.fieldName}"`,
    clearable: el.clearable ? 'clearable' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
    disabled: el.disabled ? ":disabled='true'" : '',
  };
}

// el-buttin 子级
function buildElButtonChild(scheme) {
  const children: string[] = [];
  const slot = scheme.slot || {};
  if (slot.default) {
    children.push(slot.default);
  }
  return children.join('\n');
}

// el-input 子级
function buildElInputChild(scheme) {
  const children: string[] = [];
  const slot = scheme.slot;
  if (slot && slot.prepend) {
    children.push(`<template v-slot:prepend>${slot.prepend}</template>`);
  }
  if (slot && slot.append) {
    children.push(`<template v-slot:append>${slot.append}</template>`);
  }
  return children.join('\n');
}

// el-select 子级
function buildElSelectChild(scheme) {
  const children: string[] = [];
  const slot = scheme.slot;
  if (slot && slot.options && slot.options.length) {
    children.push(
      `<el-option v-for="(item, index) in ${scheme.fieldName}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`
    );
  }
  return children.join('\n');
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children: string[] = [];
  const slot = scheme.slot;
  const config = scheme.component;
  if (slot && slot.options && slot.options.length) {
    const widget =
      config.optionType === 'button' ? 'el-radio-button' : 'el-radio';
    const border = config.border ? 'border' : '';
    children.push(
      `<${widget} v-for="(item, index) in ${scheme.fieldName}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${widget}>`
    );
  }
  return children.join('\n');
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children: string[] = [];
  const slot = scheme.slot;
  const config = scheme.component;
  if (slot && slot.options && slot.options.length) {
    const widget =
      config.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox';
    const border = config.border ? 'border' : '';
    children.push(
      `<${widget} v-for="(item, index) in ${scheme.fieldName}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${widget}>`
    );
  }
  return children.join('\n');
}

// el-upload 子级
function buildElUploadChild(scheme) {
  const list: string[] = [];
  const config = scheme.component;
  if (scheme['list-type'] === 'picture-card') {
    list.push('<i class="elu-icon-plus"></i>');
  } else {
    list.push(
      `<el-button size="small" type="primary" icon="elu-icon-upload">${config.buttonText}</el-button>`
    );
  }
  if (config.showTip) {
    list.push(
      `<div v-slot:tip class="el-upload__tip">只能上传不超过 ${config.fileSize}${config.sizeUnit} 的${scheme.accept}文件</div>`
    );
  }
  return list.join('\n');
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig, type) {
  const htmlList: string[] = [];
  confGlobal = formConfig;
  // Determine whether the layout is full of 24 grids in order to simplify the code structure later
  someSpanIsNot24 = formConfig.fields.some((item) => item.component.span !== 24);
  // Traverse and render each component into html
  formConfig.fields.forEach((el) => {
    htmlList.push(layouts[el.component.layout](el));
  });
  const htmlStr = htmlList.join('\n');
  // Put the component code in the form widget
  let temp = buildFormTemplate(formConfig, htmlStr, type);
  // Dialog widget package code
  if (type === 'dialog') {
    temp = dialogWrapper(temp);
  }
  confGlobal = null;
  return temp;
}
