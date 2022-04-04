<template>
  <div class="pagination-wrapper">
    <div class="pagination">
      <el-pagination
        v-model:page-size="paginationModel.limit"
        v-model:current-page="paginationModel.page"
        background
        :total="paginationModel.total"
        :page-sizes="paginationModel.pageSizes"
        style="margin-top: 8px"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="paginationModel.sizeChange()"
        @current-change="paginationModel.currentChange()"
      />
      <el-button
        class="pagination-refresh"
        size="large"
        :icon="EluIconRefresh"
        type="text"
        @click="$emit('refresh-click')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Refresh as EluIconRefresh } from '@element-plus/icons'; /*
import lang from 'element-plus/lib/locale/lang/en';
import locale from 'element-plus/lib/locale';*/
import { Pagination } from '@/modules/list/models/pagination';

export default defineComponent({
  name: 'EnPagination',
  props: {
    paginationModel: {
      type: Pagination,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      EluIconRefresh,
    };
  },
});
</script>

<style>
.pagination-wrapper .pagination .pagination-refresh {
  padding-top: 15px;
}
.pagination-wrapper .pagination {
  float: right;
  display: flex;
}
</style>
