import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import {EngineNotification} from '@/modules/engine/services/engine.notification';
import EnList from '@/modules/list/components/list/EnList.vue';
import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';
import {EngineFile} from '@/modules/engine/services/engine.file.service';

export default class FileReferenceWidget extends BaseWidget {
  fileList = []
  palletSettings = {
    label: 'File Reference',
    icon: 'upload',
  }

  overrideConfigSection(configSectionWidgets) {
    return Object.assign(configSectionWidgets, {
      'widgetSettings.allowed_types': {
        fieldName: 'widgetSettings.allowed_types',
        widgetAlias: WIDGETS.select,
        slot: {
          options: [
            {label: 'All', value: 'all'},
            {label: 'JPEG', value: 'image/jpeg'},
            {label: 'PNG', value: 'image/png'},
            {label: 'PDF', value: 'application/pdf'},
            {label: 'XML', value: 'application/xml'},
          ],
        },
        fieldSettings: {multiple: true},
        widgetSettings: {
          labelWidth: 100,
          span: 24,
          label: 'Allowed Types',
          advance: true,
        },
      },
    });
  }

  openFileSelector() {
  }

  dialogVisible = false
  engineList
  selectedFile: any = null

  showMediaPopup() {
    this.dialogVisible = true;
    this.repaint();
  }

  hideMediaPopup() {
    this.dialogVisible = false;
    this.repaint();
  }

  selectFile(file) {
    this.selectedFile = file;
    this.setValue(file.id);
  }

  buildTemplate(h) {
    return (
      <div class='file-reference-wrapper'>
        <el-dialog
          showClose={false}
          visible={this.dialogVisible}
          width='70%'
          height='50%'
          onBeforeClose={(done) => {
            this.hideMediaPopup();
            done();
          }}
        >
          <div v-slot:title/>
          {h(EnList, {
            props: {
              modelAlias: 'engine_system_files',
              pagination: {},
              toolbar: true,
              list: '7cf9ea74-f535-4288-abe1-79b0ec611a02',
              remote: true,
            },
            on: {
              definitionLoaded: (engineList) => {
                this.engineList = engineList;
                this.engineList
                  .getContext()
                  .fileService.allowSelections(
                  this.widgetSettings.allowed_types
                );
              },
            },
          })}
          <span v-slot:footer class='dialog-footer'>
            <el-button
              onClick={() => {
                this.hideMediaPopup();
              }}
            >
              Cancel
            </el-button>
            <el-button
              type='primary'
              onClick={() => {
                const selected = this.engineList.getSelected();
                if (selected.length === 0 || selected.length > 1) {
                  EngineNotification.getInstance().showMessage({
                    type: 'error',
                    message:
                      'Please select one file, You have selected ' +
                      selected.length +
                      ' files',
                  });
                  return;
                }
                this.selectFile(selected[0]);
                this.hideMediaPopup();
              }}
            >
              Select
            </el-button>
          </span>
        </el-dialog>
        <div class='select-file'>
          <el-button
            type='primary'
            icon='el-file'
            class='file-reference-button'
            onClick={() => {
              this.showMediaPopup();
            }}
          >
            Select
          </el-button>
          <div class='el-upload__tip'>
            Select {this.widgetSettings.allowed_types.join(',')}{' '}
          </div>
        </div>
        <div class='preview'>{this.renderPreview(h)}</div>
      </div>
    );
  }

  renderPreview(h) {
    if (this.selectedFile) {
      const type = this.selectedFile.getType();
      if (type === 'image') {
        return (
          <img
            class='img image-file el-avatar'
            style={{
              display: 'block',
              width: '50px',
              height: '50px',
            }}
            src={this.selectedFile.getUrl()}
          />
        );
      }
      return <div>{this.selectedFile.path}</div>;
    }
    return <div></div>;
  }

  componentRender(component, h) {
    const refModel = this.formModel['ref_' + this.fieldName];
    if (refModel) {
      const value = refModel[this.widgetSettings.referenced_field_name || 'id'];
      const label = refModel[this.widgetSettings.display_field_name || 'path'];
      if (!this.selectedFile) {
        this.selectedFile = Object.assign(new EngineFile(), {
          path: label,
          id: value,
          content_type: 'other',
        });
      }
    }
    return this.buildTemplate(h);
  }
}
