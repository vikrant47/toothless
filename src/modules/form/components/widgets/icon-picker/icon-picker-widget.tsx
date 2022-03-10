import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import IconsDialog from '@/modules/form/components/widgets/icon-picker/IconsDialog.vue';

export default class IconPickerWidget extends BaseWidget {
  palletSettings = {
    label: 'Icon',
    icon: 'icon',
  }

  componentRender(component, h) {
    const _this = this;
    const iconDialogConf = {
      attrs: {visible: this.getData().visibleIconPopup || false},
      on: {
        close() {
          // document.querySelector('').style.display = 'none';
          iconDialogConf.attrs.visible = false;
          setTimeout(() => {
            // @ts-ignore
            document.querySelector('.icon-dialog .v-modal').style.display =
              'none';
            _this.setData({visibleIconPopup: false});
            _this.repaint();
          }, 500);
        },
        select(icon) {
          iconDialogConf.attrs.visible = false;
          _this.setData({visibleIconPopup: false});
          _this.setValue(icon);
        },
      },
    };
    return h('div', {class: 'icon-widget'}, [
      h('el-input', this.getComponentConfig(), [
        h('el-button', {
          slot: 'append',
          attrs: {type: 'primary', icon: 'elu-icon-thumb'},
          on: {
            click() {
              _this.setData({visibleIconPopup: true}); // emitting data event to store additional data
              _this.repaint();
            },
          },
        }),
      ]),
      h(IconsDialog, iconDialogConf, this.getChildren()),
    ]);
  }
}
