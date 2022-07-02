<template>
  <div>
    <v-card>
      <v-card-title>入力補助 </v-card-title>
      <v-card-text>
        <wj-flex-grid :items-source="items2" :initialized="initGrid">
          <wj-flex-grid-column header="CD2" binding="cd2" width="*" />
          <wj-flex-grid-column header="値1" binding="value1" width="*" />
          <wj-flex-grid-column header="値2" binding="value2" width="*" />
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
import { FlexGrid } from '@grapecity/wijmo.grid'
import { defineComponent, ref, computed, watch } from '@vue/composition-api'
export default defineComponent({
  props: {
    cd2: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
    const items2 = [
      { cd2: '00001', value1: '値1-1', value2: '値2-1' },
      { cd2: '00002', value1: '値1-2', value2: '値2-2' },
      { cd2: '00003', value1: '値1-3', value2: '値2-3' },
      { cd2: '00004', value1: '値1-4', value2: '値2-4' },
      { cd2: '00005', value1: '値1-5', value2: '値2-5' },
    ]
    const selectedItem = ref()
    const cancelClick = () => {
      selectedItem.value = ''
      context.emit('cancelClick')
    }
    const defineClick = () => {
      context.emit('define2', selectedItem.value)
    }
    const index = computed(() => {
      for (let i = 0; i < items2.length; i++) {
        if (items2[i].cd2 === props.cd2) {
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
          )[0].dataItem.cd2
        },
      })
      selector.showCheckAll = false
      grid.rows[index.value].isSelected = true
    }

    return {
      items2,
      index,
      defineClick,
      initGrid,
      cancelClick,
    }
  },
})
</script>
