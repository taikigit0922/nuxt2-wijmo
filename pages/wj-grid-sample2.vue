<template>
  <v-card>
    <v-card-title>一覧</v-card-title>
    <v-card-text>
      <wj-grid-table></wj-grid-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, provide } from '@vue/composition-api'
import useWjGrid, { WjGridKey } from '@/composables/use-wj-grid'
export default defineComponent({
  components: {
    WjGridTable: () => import('@/components/organisms/WjGridTable.vue'),
  },
  setup() {
    provide(WjGridKey, useWjGrid())
  },
})
</script>
