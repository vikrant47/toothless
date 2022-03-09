import {TenantService} from '@/modules/engine/services/tenant.service';
import {RestQuery} from '@/modules/engine/services/rest.query';
import * as _ from 'lodash';
import {Pagination} from '@/modules/list/models/pagination';
import {Engine} from '@/modules/engine/core/engine';

export class EngineFile {
  static FILE_CONTENT_TYPES = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'application/xml': 'xml',
    'application/pdf': 'pdf',
    'application/json': 'json',
  }
  static FILE_TYPES = {
    jpg: 'image',
    png: 'image',
    jpeg: 'image',
    gif: 'image',
  }
  protected path: string;
  protected content_type: string;

  static getFileTypeByPath(filePath) {
    const extension = filePath.split('.').pop();
    if (extension) {
      return this.FILE_TYPES[extension] || 'file';
    }
    return 'file';
  }

  selected = false

  constructor(file = {}) {
    Object.assign(this, file);
  }

  getType() {
    if (this.path) {
      return EngineFile.getFileTypeByPath(this.path);
    }
    return null;
  }

  isImage(file) {
    return this.content_type.indexOf('image') > -1;
  }

  getUrl() {
    return Engine.getMediaServerUrl(this.path);
  }
}

export class EngineFileService {
  static APIS = {
    upload: '/engine/file/upload',
  }
  private rootFolder: any;

  static getApiUrl(api) {
    return '/api' + TenantService.getInstance().getBaseTenantUrl() + api;
  }

  /** This will return the upload url*/
  static getUploadUrl() {
    return this.getApiUrl(this.APIS.upload);
  }

  selectableTypes = ['all']
  loading = false
  files: any[] = []
  pagination

  constructor(pagination = null) {
    this.pagination = pagination || new Pagination();
  }

  async init(rootFolderId) {
    this.loading = true;
    try {
      this.rootFolder = await this.getFile(rootFolderId);
    } finally {
      this.loading = false;
    }
  }

  async getFile(fileId) {
    const result = await new RestQuery('engine_system_files').findById(fileId);
    return result.contents;
  }

  async listFiles(query = {}) {
    this.loading = true;
    try {
      return await new RestQuery('engine_system_files').findAll({
        where: {
          parent_folder_id: this.rootFolder.id,
        },
      });
    } finally {
      this.loading = false;
    }
  }

  async refresh(query = {}) {
    this.clearSelection();
    let condition: any = {
      parent_folder_id: this.rootFolder.id,
    };
    if (!_.isEmpty(query)) {
      condition = {
        $and: [condition, query],
      };
    }
    this.loading = true;
    try {
      const response = await new RestQuery('engine_system_files').paginate({
        where: condition,
        page: this.pagination.page,
        limit: this.pagination.limit,
        order: [
          {
            field: 'name',
            direction: 'asc',
          },
        ],
      });
      this.files = response.contents.data.map((file) => {
        return new EngineFile(file);
      });
      this.pagination.total = response.contents.total;
      return response;
    } finally {
      this.loading = false;
    }
  }

  navigate(rootFolder) {
    this.rootFolder = rootFolder;
    return this.refresh();
  }

  getSelected() {
    return this.files.filter((f: any) => f.selected);
  }

  clearSelection() {
    for (const file of this.files) {
      file.selected = false;
    }
    return this;
  }

  isSelectable(file) {
    if (this.selectableTypes.indexOf('all') >= 0) {
      return true;
    }
    return this.selectableTypes.indexOf(file.content_type) >= 0;
  }

  allowSelections(contentTypes) {
    this.selectableTypes = contentTypes;
  }
}
