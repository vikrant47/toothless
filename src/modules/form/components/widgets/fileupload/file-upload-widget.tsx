import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { EngineFileService } from '@/modules/engine/services/engine.file.service';

export default class FileUploadWidget extends BaseWidget {
  fileList = []
  palletSettings = {
    label: 'File Upload',
    icon: 'upload',
  }

  /** *handlers**/
  handlePreview() {}

  handleRemove() {}

  beforeRemove() {}

  handleExceed() {}

  updateValueFromFileList(fileList) {
    if (fileList) {
      if (fileList.length > 0) {
        this.setValue(fileList[0].response.contents);
      } else {
        this.setValue(null);
      }
    }
  }

  overrideWidgetSettings(widgetSettings) {
    return Object.assign(
      {
        multiple: false,
        fileList: [],
      },
      widgetSettings
    );
  }

  buildTemplate(h) {
    return (
      <el-upload
        class='upload-demo'
        props={{
          'on-success': (response, file, fileList) => {
            this.updateValueFromFileList(fileList);
          },
          'on-remove': (file, fileList) => {
            this.updateValueFromFileList(fileList);
          },
        }}
        action={EngineFileService.getUploadUrl()}
        multiple={this.widgetSettings.multiple}
        limit={this.widgetSettings.limit}
        fileList={this.fileList}
      >
        <el-button size='small' type='primary'>
          Upload
        </el-button>
        <div v-slot:tip class='el-upload__tip'>
          {this.widgetSettings.title}
        </div>
      </el-upload>
    );
  }

  componentRender(component, h) {
    return this.buildTemplate(h);
  }
}
