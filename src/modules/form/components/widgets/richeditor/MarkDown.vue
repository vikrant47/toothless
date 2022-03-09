<template>
  <editor
    ref="toastuiEditor"
    :initial-value="editorHtml"
    :options="editorOptions"
    :height="height"
    :initial-edit-type="editorType"
    :preview-style="previewStyle"
    @change="onEditorChange"
  />
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css'; // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import {Editor} from '@toast-ui/vue-editor';

export default defineComponent({
  name: 'MarkDown',
  components: {
    editor: Editor,
  },
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
      default: '300px',
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
      editorText: this.value,
      editorOptions: this.options,
    };
  },
  computed: {
    editorHtml(): string {
      return this['value'];
    },
  },
  watch: {
    value: {
      handler(value) {
        this['$refs']?.toastuiEditor?.invoke('setHtml', value);
      },
    },
  },
  mounted() {
    this.$refs.toastuiEditor.editor.eventManager.listen(
      'pasteBefore',
      function (event) {
        /* var html = event.clipboardContainer.innerHTML;
      var doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('span').forEach(function(el) {
        el.outerHTML = el.textContent;
      });
      html = doc.body;
      event.clipboardContainer.innerHTML = html.outerHTML;*/
      }
    );
  },
  methods: {
    onEditorChange() {
      this.$emit('change', this.$refs.toastuiEditor.invoke('getHtml'));
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
