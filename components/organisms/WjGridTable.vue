<template>
  <div class="container-fluid">
    <div id="hoverRow">
      <wj-flex-grid
        :alternating-row-step="0"
        :items-source="getCalculatedView()"
        :format-item="formatItem"
        :key-action-tab="2"
        :initialized="initGrid"
      >
        <wj-flex-grid-filter />
        <!-- regular fields -->
        <wj-flex-grid-column
          binding="cd"
          header="cd"
          width="*"
          :data-map="itemMap"
        />
        <wj-flex-grid-column binding="value1" header="値1" width="*" />
        <wj-flex-grid-column binding="check" header="チェック" :width="100" />
        <wj-flex-grid-column
          binding="date"
          header="日付です"
          format="d"
          :editor="editors.inputDate"
          width="*"
        />
      </wj-flex-grid>
    </div>
  </div>
</template>

<script lang="ts">
import '@grapecity/wijmo.styles/wijmo.css'
import '@grapecity/wijmo.vue2.grid'
import { defineComponent, inject } from '@vue/composition-api'
import { WjGridKey, WjGridType } from '@/composables/use-wj-grid'
import '@grapecity/wijmo.vue2.grid.filter'
export default defineComponent({
  setup() {
    const { data, itemMap, editors, formatItem, getCalculatedView, initGrid } =
      inject(WjGridKey) as WjGridType
    return {
      data,
      itemMap,
      editors,
      formatItem,
      getCalculatedView,
      initGrid,
    }
  },
})
</script>
<style>
.wj-flexgrid {
  height: 150px;
  margin: 10px 0;
}
/* css for hovering on non-header rows */
#hoverRow
  .wj-cells
  .wj-row:hover
  .wj-cell:not(.wj-state-selected):not(.wj-state-multi-selected) {
  transition: all 0.5s;
  background: rgb(255, 233, 200);
}
</style>
