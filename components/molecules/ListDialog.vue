<template>
  <div>
    <v-card>
      <v-card-title>リスト選択 </v-card-title>
      <v-card-text>
        <wj-flex-grid :items-source="items" :initialized="initGrid">
          <wj-flex-grid-column header="CD" binding="cd" width="*" />
          <wj-flex-grid-column header="値" binding="value" width="*" />
        </wj-flex-grid>
      </v-card-text>
      <v-card-actions>
        <v-btn class="primary" @click="defineClick">決定</v-btn>
        <v-btn class="error" @click="cancelClick">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Selector } from '@grapecity/wijmo.grid.selector'
import { FlexGrid, GridPanel } from '@grapecity/wijmo.grid'
import { defineComponent, ref, computed, watch } from '@vue/composition-api'
export default defineComponent({
  props: {
    cd: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
    const items = [
      { cd: '0001', value: '値1' },
      { cd: '0002', value: '値2' },
      { cd: '0003', value: '値3' },
      { cd: '0004', value: '値4' },
      { cd: '0005', value: '値5' },
    ]
    const selectedItem = ref()
    const cancelClick = () => {
      selectedItem.value = ''
      context.emit('cancelClick')
    }
    const defineClick = () => {
      context.emit('define', selectedItem.value)
    }
    const index = computed(() => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].cd === props.cd) {
          return i
        }
      }
      return 0
    })
    const flexGrid = ref()
    watch(index, () => {
      flexGrid.value.rows.forEach((el) => {
        el.isSelected = false
      })
      flexGrid.value.rows[index.value].isSelected = true
    })
    const initGrid = (grid: FlexGrid) => {
      grid.addEventListener(grid.hostElement, 'click', (e) => {
        const ht = grid.hitTest(e)
        for (let i = 0; i < grid.rows.length; i++) {
          if (i !== ht.row) {
            grid.rows[i].isSelected = false
          }
        }
      })
      flexGrid.value = grid
      grid.rows.forEach((el) => {
        el.isSelected = false
      })
      // 行選択のチェックボックスの設定
      const selector = new Selector(grid, {
        itemChecked: () => {
          selectedItem.value = grid.rows.filter(
            (r) => r.isSelected
          )[0].dataItem.cd
        },
      })
      selector.showCheckAll = false
      grid.rows[index.value].isSelected = true
    }

    return {
      items,
      index,
      defineClick,
      initGrid,
      cancelClick,
    }
  },
})
</script>
