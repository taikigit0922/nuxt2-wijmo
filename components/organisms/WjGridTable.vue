<template>
  <div class="container-fluid">
    <div id="hoverRow">
      {{ selectedItem }}
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
        <wj-flex-grid-column binding="value" header="値1" width="*" />
        <wj-flex-grid-column binding="check" header="チェック" :width="100" />
        <wj-flex-grid-column
          binding="date"
          header="日付"
          format="d"
          :editor="editors.inputDate"
          width="*"
        />
        <wj-flex-grid-column binding="cd2" header="cd2" width="*">
          <wj-flex-grid-cell-template v-slot="cell" cell-type="Cell">
            <v-icon>mdi-magnify</v-icon>{{ cell.item.cd2 }}
          </wj-flex-grid-cell-template>
        </wj-flex-grid-column>
        <wj-flex-grid-column binding="value1" header="値2" width="*" />
        <wj-flex-grid-column binding="value2" header="値3" width="*" />
      </wj-flex-grid>
      <v-btn class="success" @click="toUpper">上に移動</v-btn>
      <v-btn class="success" @click="toLower">下に移動</v-btn>
      <v-btn class="success" @click="copyInsert">行コピー</v-btn>
      <v-btn class="success" @click="clearFilter">フィルター解除</v-btn>
    </div>
    <v-dialog v-model="dialog" width="400px">
      <list-dialog
        :cd="cd"
        @cancelClick="cancelClick"
        @define="define"
      ></list-dialog>
    </v-dialog>
    <v-dialog v-model="dialog2" width="400px">
      <search-list-dialog
        :cd2="cd2"
        @cancelClick="cancelClick"
        @define2="define2"
      ></search-list-dialog>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import '@grapecity/wijmo.styles/wijmo.css'
import '@grapecity/wijmo.vue2.grid'
import * as wjGrid from '@grapecity/wijmo.grid'
import { defineComponent, inject } from '@vue/composition-api'
import { WjGridKey, WjGridType } from '@/composables/use-wj-grid'
import '@grapecity/wijmo.vue2.grid.filter'
export default defineComponent({
  components: {
    ListDialog: () => import('@/components/molecules/ListDialog.vue'),
    SearchListDialog: () =>
      import('@/components/molecules/SearchListDialog.vue'),
  },
  setup() {
    const {
      flexGrid,
      selectedItem,
      data,
      itemMap,
      editors,
      dialog,
      dialog2,
      cd,
      cd2,
      row,
      formatItem,
      getCalculatedView,
      initGrid,
      toUpper,
      toLower,
      copyInsert,clearFilter
    } = inject(WjGridKey) as WjGridType
    const cancelClick = () => {
      dialog.value = false
      dialog2.value = false
    }
    const define = (value) => {
      const rowIndex: number = row.value.row
      data.value[rowIndex].cd = value

      dialog.value = false
      flexGrid.value.selection = new wjGrid.CellRange(
        row.value.row,
        row.value.col,
        row.value.row,
        row.value.col
      )
    }
    const define2 = (value) => {
      const rowIndex: number = row.value.row
      data.value[rowIndex].cd2 = value
      console.log(value)

      dialog2.value = false
      flexGrid.value.selection = new wjGrid.CellRange(
        row.value.row,
        row.value.col,
        row.value.row,
        row.value.col
      )
      console.log('undifined')
    }
    return {
      flexGrid,
      selectedItem,
      data,
      itemMap,
      editors,
      dialog,
      dialog2,
      cd,
      cd2,
      row,
      formatItem,
      getCalculatedView,
      initGrid,
      cancelClick,
      define,
      define2,
      toUpper,
      toLower,
      copyInsert,clearFilter
    }
  },
})
</script>
<style scoped>
.wj-flexgrid {
  height: 400px;
  margin: 10px 0;
}
</style>
<style>
/* css for hovering on non-header rows */
#hoverRow
  .wj-cells
  .wj-row:hover
  .wj-cell:not(.wj-state-selected):not(.wj-state-multi-selected) {
  transition: all 0.5s;
  background: rgb(255, 233, 200);
}
</style>
