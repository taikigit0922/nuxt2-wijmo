<template>
  <div class="container-fluid">
    <wj-flex-grid :items-source="items" :initialized="initGrid">
      <wj-flex-grid-column header="CD" binding="cd" width="*" />
      <wj-flex-grid-column header="値" binding="value" width="*" />
    </wj-flex-grid>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from '@vue/composition-api'
import { Selector } from '@grapecity/wijmo.grid.selector'
import { FlexGrid } from '@grapecity/wijmo.grid'
import { hasItems } from '@grapecity/wijmo'
import { WjGridKey, WjGridType } from '@/composables/use-wj-grid'

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    cd: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const initGrid = (grid: FlexGrid) => {
      // 行選択のチェックボックスの設定
      const selector = new Selector(grid, {
        itemChecked: (e) => {
          context.emit(
            'defineClick',
            grid.rows.filter((r) => r.isSelected)[0].dataItem.cd
          )
        },
      })
      selector.showCheckAll = false
      grid.rows[props.index].isSelected = true
    }
    return {
      initGrid,
    }
  },
})
</script>
