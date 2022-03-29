<template>
  <ckeditor
    v-model="editorText"
    :editor="editor"
    :config="editorOptions"
    @input="onEditorChange"
    @mounted="onMounted($event)"></ckeditor>
  <!--  <editor
      ref="toastuiEditor"
      :initial-value="editorHtml"
      :options="editorOptions"
      :height="height"
      :initial-edit-type="editorType"
      :preview-style="previewStyle"
      @change="onEditorChange"
    />-->
</template>

<script lang="ts">
// import 'codemirror/lib/codemirror.css'; // Editor's Dependency Style
// import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
// import {Editor} from '@toast-ui/vue-editor';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default defineComponent({
  name: 'MarkDown',
  props: {
    value: {
      type: String,
      default: '',
    },
    previewStyle: {
      type: String,
      default: 'vertical',
    },
    editorType: {
      type: String,
      default: 'wysiwyg',
    },
    height: {
      type: String,
      default: '300',
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      editorConfig: {},
      editor: ClassicEditor,
      editorText: this.value,
      editorOptions: Object.assign({height: this.height}, this.options),
      editorInstance: null,
      initialized: false,
    };
  },
  computed: {
    editorHtml(): string {
      return this['value'];
    },
  },
  watch: {
    editorText: {
      handler(value) {
        console.log('editor text changed')
        this.$emit('change', this.editorText);
      },
    },
  },
  mounted() {
  },
  beforeUpdate() {
    //@ts-ignore
    if (!this.initialized && this.value !== this.editorText) {
      //@ts-ignore
      this.editorText = this.value;
      this.initialized = true;
    }
  },
  methods: {
    onMounted(editor) {
      console.log("ckeditor mounted");
      this.editorInstance = editor;
      editor.on('change', () => {
        console.log('ckeditor onchange');
        let html = editor.getData();
        if (html !== this.editorText) {
          this.$emit('changed', html);
        }
      });
    },
    onEditorChange() {
      this.$emit('change', this.editorText);
    },
  },
});
</script>

<style scoped>
.text {
  text-align: left;
}

::v-deep .w-e-text-container {
  height: 420px !important;
}
</style>
