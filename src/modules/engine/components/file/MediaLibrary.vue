<template>
  <div v-loading="fileService.loading" class="file-explorer-wrapper">
    <div class="navigation">
      <el-button :icon="EluIconBack" class="back nav-button" />
      <el-button :icon="EluIconRight" class="next nav-button" />
      <div class="path">
        <el-input v-model="currentPath" readonly />
      </div>
    </div>
    <ul v-if="fileService.files.length > 0" class="icon-list">
      <li
        v-for="file in fileService.files"
        :key="file.id"
        :span="4"
        :class="{ selected: file.selected === true }"
        @click="toggleSelect(file)"
        @dblclick="explorer(file)"
      >
        <div class="selection">
          <input
            v-if="fileService.isSelectable(file)"
            v-model="file.selected"
            type="checkbox"
            @change="selectionChanged()"
          >
        </div>
        <div v-if="file.content_type === 'folder'" class="folder file-item">
          <span>
            <el-icon><elu-icon-folder /></el-icon>
          </span>
          <span class="icon-name">{{ file.name }}</span>
        </div>
        <div v-else class="file file-item">
          <div
            v-if="file.isImage()"
            :style="{ 'background-image': 'url(' + file.getUrl() + ')' }"
            class="image-file"
          >
            <span class="icon-name">{{ file.name }}</span>
          </div>
          <div v-else class="unknown-file-type">
            <span class="icon-name">{{ file.name }}</span>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="empty-folder">No files exists in this directory</div>
  </div>
</template>

<script>
import {
  Folder as EluIconFolder,
  Back as EluIconBack,
  Right as EluIconRight,
} from '@element-plus/icons';

import { EngineFileService } from '@/modules/engine/services/engine.file.service';
import $router from '@/router';
import { EngineList } from '@/modules/list/engine-api/engine.list';
import { LIST_EVENTS } from '@/modules/list/engine-api/list-events';
import { Engine } from '@/modules/engine/core/engine';

export default {
  name: 'EnMediaLibrary',
  components: {
    EluIconFolder,
  },
  props: {
    rootFolder: {
      type: String,
      default: import.meta.env.VUE_APP_ROOT_MEDIA_FOLDER_ID,
    },
    engineList: {
      type: EngineList,
      default: null,
    },
  },
  data() {
    return {
      currentPath: '/',
      files: [],
      fileService: new EngineFileService(
        this.engineList && this.engineList.pagination
      ),
      EluIconBack,
      EluIconRight,
    };
  },
  watch: {
    async '$route.query.folderId'() {
      if (this.fileService.rootFolder.id !== this.$route.query.folderId) {
        await this.fileService.init(
          this.$route.query.folderId || this.rootFolder
        );
      }
      await this.refresh();
    },
  },
  created() {
    if (this.engineList) {
      this.engineList.addContext('fileService', this.fileService);
    }
    this.$emit('created', { service: this.fileService });
  },
  async mounted() {
    await this.fileService.init(
      (this.rootFolder === import.meta.env.VUE_APP_ROOT_MEDIA_FOLDER_ID &&
        this.$route.query.folderId) ||
        this.rootFolder
    );
    await this.refresh();
    if (this.engineList) {
      this.engineList.settings.remote = false;
      this.engineList.on(LIST_EVENTS.model.beforeFetch, () => {
        this.refresh();
      });
    }
  },
  methods: {
    generateFileUrl(file) {
      return Engine.getMediaServerUrl(file.path);
    },
    async refresh() {
      if (this.engineList) {
        await this.fileService.refresh(await this.engineList.getQuery());
      } else {
        await this.fileService.refresh();
      }
      this.currentPath = this.fileService.rootFolder.path;
    },
    toggleSelect(file) {},
    selectionChanged() {
      if (this.engineList) {
        this.engineList.selection = this.fileService.getSelected();
      }
    },
    async explorer(file) {
      if (file.content_type === 'folder') {
        this.fileService.rootFolder = file;
        // router.push({ path: 'register', query: { plan: 'private' }});
        $router.push({
          path: $router.currentRoute.path,
          query: Object.assign({}, $router.currentRoute.query, {
            folderId: file.id,
          }),
        });
      }
    },
  },
};
</script>

<style scoped>
.file-explorer-wrapper {
  background-color: white;
  padding: 10px;
  min-height: 65vh;
}

.empty-folder {
  width: 100%;
  text-align: center;
  vertical-align: middle;
  line-height: 300px;
  color: #989b9c;
}

.navigation {
  display: flex;
}

.navigation .nav-button {
  margin-left: 5px;
}

.navigation .path {
  margin-left: 4px;
  /*padding-top: 8px;
  padding-left: 15px;
  border: 1px solid #e0e3e5;
  padding-right: 10px;*/
  color: #304156;
  width: 100%;
}
</style>
