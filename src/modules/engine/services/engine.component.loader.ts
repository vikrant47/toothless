import TabularListView from '@/modules/list/components/list/TabularListView';
import EnForm from '@/modules/form/components/engine/form/EnForm';
import MediaLibrary from '@/modules/engine/components/file/MediaLibrary';
import FormRenderer from '@/modules/form/views/FormRenderer';
import Parser from '@/modules/form/components/widgets/form-designer/render/Parser';

export class EngineComponentLoader {
  static getComponents() {
    return {
      Parser,
      TabularListView,
      MediaLibrary,
      EnForm,
      FormRenderer,
    };
  }

  static getComponent(name) {
    return this.getComponents()[name];
  }
}
