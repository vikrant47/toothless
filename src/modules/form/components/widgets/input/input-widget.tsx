import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';

export default class InputWidget extends BaseWidget {
  palletSettings = {
    label: 'Input',
    icon: 'input',
  }

  constructor(settings: any = {}) {
    super();
    if (settings.fieldSettings && settings.fieldSettings.type === 'password') {
      this.fieldSettings.showPassword = true;
    }
  }

  prefix(h, key) {
    return `<template v-slot:prefix>${this.slot[key]}</template>`;
  }

  suffix(h, key) {
    return `<template v-slot:suffix>${this.slot[key]}</template>`;
  }

  prepend(h, key) {
    return `<template v-slot:prepend>${this.slot[key]}</template>`;
  }

  append(h, key) {
    return `<template v-slot:append>${this.slot[key]}</template>`;
  }
}
