import {
  InjectionKey,
  reactive,
  toRefs,
  computed,
} from '@nuxtjs/composition-api'
import { InputDate } from '@grapecity/wijmo.input'
import { CollectionView, PopupPosition, Tooltip } from '@grapecity/wijmo'
import { Selector } from '@grapecity/wijmo.grid.selector'
import { FlexGrid } from '@grapecity/wijmo.grid'
import * as wjGrid from '@grapecity/wijmo.grid'

interface State {
  selectedItems: []
  data: {}[]
  items: { cd: string; value: string }[]
  editors: { inputDate: InputDate }
  hdrTips: Tooltip
}

export default function useWjGrid() {
  const state = reactive<State>({
    selectedItems: [],
    data: [
      { cd: '0001', check: false, date: new Date() },
      { cd: '0002', check: true, date: new Date() },
      { cd: '0003', check: true, date: new Date() },
      { cd: '0004', check: true, date: new Date() },
      { cd: '0005', check: false, date: new Date() },
    ],
    items: [
      { cd: '0001', value: '値1' },
      { cd: '0002', value: '値2' },
      { cd: '0003', value: '値3' },
      { cd: '0004', value: '値4' },
      { cd: '0005', value: '値5' },
    ],
    editors: {
      inputDate: new InputDate(document.createElement('div')),
    },
    hdrTips: new Tooltip({
      position: PopupPosition.RightTop,
      showAtMouse: true,
      showDelay: 600,
      cssClass: 'hdr-tip',
    }),
  })
  const itemMap: any = computed({
    get: () => {
      const itemMaps: any[] = []
      state.items.forEach((el: any) => {
        itemMaps.push(el.cd)
      })
      return itemMaps
    },
    set: (value: any) => (itemMap.cd = value),
  })
  const formatItem = (s: any, e: any) => {
    if (e.panel === s.columnHeaders) {
      state.hdrTips.setTooltip(
        e.cell,
        '列の名前:<br/>' +
          '<span class="col-header">' +
          e.getColumn().header +
          '</span>'
      )
    }
  }
  const getCalculatedView = () => {
    return new CollectionView(state.data, {
      calculatedFields: {
        // function-based expressions
        value1: ($: any) => state.items.find((el) => el.cd === $.cd)!.value,

        // string-based expressions
        fullNameStr: '[$.cd, $.header1].join(" ")',
        value1Str: '($) => $.cd * 2',
        taxStr: '$.value1 * 0.12',
      },
    })
  }
  const initGrid = (grid: FlexGrid) => {
    const selector = new Selector(grid, {
      itemChecked: () => {
        state.selectedItems = grid.rows.filter((r) => r.isSelected)
      },
    })
    const extraColumn = new wjGrid.Column()
    const panel = grid.rowHeaders
    panel.columns.splice(0, 0, extraColumn)
    for (let r = 0; r < grid.rowHeaders.rows.length; r++) {
      grid.rowHeaders.setCellData(r, 0, r + 1)
    }
    grid.refreshing.addHandler(() => {
      for (let r = 0; r < grid.rowHeaders.rows.length; r++) {
        grid.rowHeaders.setCellData(r, 0, r + 1)
      }
    })
  }
  return {
    ...toRefs(state),
    itemMap,
    formatItem,
    getCalculatedView,
    initGrid,
  }
}

export type WjGridType = ReturnType<typeof useWjGrid>
export const WjGridKey: InjectionKey<WjGridType> = Symbol('UseWjGrid')
