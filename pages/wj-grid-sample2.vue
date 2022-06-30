<template>
  <wj-grid-table></wj-grid-table>
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
