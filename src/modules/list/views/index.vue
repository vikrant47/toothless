<template>
  <div class="app-container">
    <EnList
      :model-alias="modelAlias"
      :pagination="{}"
      :toolbar="true"
      :list="list"
      :remote="true"
      @cellClick="cellClick"
    />
  </div>
</template>

<script lang="ts">
import EnList from '@/modules/list/components/list/EnList.vue';
import {useRoute} from 'vue-router'

export default {
  name: 'ListView',
  components: {EnList},
  data() {
    const route = useRoute();
    return {modelAlias: route.params.modelAlias, list: route.params.list};
  },
  beforeCreate() {
    // @ts-ignore
    //this.modelAlias = this.$route.params.modelAlias;
    // @ts-ignore
    //this.list = this.$route.params.list;
  },
  methods: {
    cellClick(event, row, column) {
    },
  },
};
</script>

<style scoped></style>
