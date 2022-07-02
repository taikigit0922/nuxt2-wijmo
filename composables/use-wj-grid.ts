import {
  InjectionKey,
  reactive,
  toRefs,
  computed,
  ref,
} from '@nuxtjs/composition-api'
import { InputDate } from '@grapecity/wijmo.input'
import { CollectionView, PopupPosition, Tooltip } from '@grapecity/wijmo'
import { Selector } from '@grapecity/wijmo.grid.selector'
import { FlexGrid } from '@grapecity/wijmo.grid'
import * as wjGrid from '@grapecity/wijmo.grid'

interface State {
  flexGrid: FlexGrid
  selectedItems: []
  selectedItem: {}
  data: {
    cd: string
    cd2: string
    check: boolean
    date: Date
  }[]
  items: { cd: string; value: string }[]
  items2: { cd2: string; value1: string; value2: string }[]
  editors: { inputDate: InputDate }
  hdrTips: Tooltip
  dialog: boolean
  dialog2: boolean
  cd: string
  cd2: string
  row: {
    row: number
    col: number
  }
}

export default function useWjGrid() {
  const state = reactive<State>({
    flexGrid: '',
    selectedItems: [],
    selectedItem: {},
    data: [
      { cd: '0001', check: false, date: new Date(), cd2: '00001' },
      { cd: '0002', check: true, date: new Date(), cd2: '00002' },
      { cd: '0003', check: true, date: new Date(), cd2: '00003' },
      { cd: '0004', check: true, date: new Date(), cd2: '00004' },
      { cd: '0005', check: false, date: new Date(), cd2: '00005' },
    ],
    items: [
      { cd: '0001', value: '値1' },
      { cd: '0002', value: '値2' },
      { cd: '0003', value: '値3' },
      { cd: '0004', value: '値4' },
      { cd: '0005', value: '値5' },
    ],
    items2: [
      { cd2: '00001', value1: '値1-1', value2: '値2-1' },
      { cd2: '00002', value1: '値1-2', value2: '値2-2' },
      { cd2: '00003', value1: '値1-3', value2: '値2-3' },
      { cd2: '00004', value1: '値1-4', value2: '値2-4' },
      { cd2: '00005', value1: '値1-5', value2: '値2-5' },
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
    dialog: false,
    dialog2: false,
    cd: '',
    cd2: '',
    row: {
      row: 0,
      col: 0,
    },
  })
  for (let i = 0; i < 1000; i++) {
    state.data.push({
      cd: '0001',
      check: false,
      date: new Date(),
      cd2: '00001',
    })
  }
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
        // 値に表示する値をcdから参照
        value: ($: any) => state.items.find((el) => el.cd === $.cd)!.value,
        value1: ($: any) => state.items2.find((el) => el.cd2 === $.cd2)!.value1,
        value2: ($: any) => state.items2.find((el) => el.cd2 === $.cd2)!.value2,
        // 値1に表示する値をcd2から参照

        // string-based expressions
        fullNameStr: '[$.cd, $.header1].join(" ")',
        value1Str: '($) => $.cd * 2',
        taxStr: '$.value1 * 0.12',
      },
    })
  }
  const initGrid = (grid: FlexGrid) => {
    state.flexGrid = grid
    // 行選択のチェックボックスの設定
    const selector = new Selector(grid, {
      itemChecked: () => {
        state.selectedItems = grid.rows.filter((r) => r.isSelected)
      },
    })
    // 行番号を表示する設定
    const extraColumn = new wjGrid.Column()
    extraColumn.width = 70
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
    // クリックイベントの追加
    grid.addEventListener(grid.hostElement, 'click', (e) => {
      console.log('click')
      const ht = grid.hitTest(e)
      state.row.row = ht.row
      state.row.col = ht.col
    })
    // ダブルクリックイベントの追加
    grid.addEventListener(grid.hostElement, 'dblclick', (e) => {
      const ht = grid.hitTest(e)
      if (grid.columnHeaders.columns[ht.col].header === 'cd') {
        state.cd = grid.cells.getCellData(ht.row, ht.col, true)
        state.dialog = true
      } else if (grid.columnHeaders.columns[ht.col].header === 'cd2') {
        state.cd2 = grid.cells.getCellData(ht.row, ht.col, true)
        state.dialog2 = true
      }
    })

    grid.selectionMode = 4
  }
  const _updateCurrentInfo = () => {
    state.selectedItem = state.flexGrid.collectionView.currentItem
  }
  // 選択中の行を上の行と入れ替え
  const toUpper = () => {
    state.flexGrid.rows.moveElement(state.row.row, state.row.row - 1)
    // 入れ替え後、フォーカスを上に移動
    state.flexGrid.selection = new wjGrid.CellRange(
      state.row.row - 1,
      state.row.col,
      state.row.row - 1,
      state.row.col
    )
    state.row.row -= 1
  }
  // 選択中の行を下の行と入れ替え
  const toLower = () => {
    state.flexGrid.rows.moveElement(state.row.row, state.row.row + 1)
    // 入れ替え後、フォーカスを下に移動
    state.flexGrid.selection = new wjGrid.CellRange(
      state.row.row + 1,
      state.row.col,
      state.row.row + 1,
      state.row.col
    )
    state.row.row += 1
  }
  // 行コピー＆挿入
  const copyInsert = () => {
    console.log('選択行', state.row)
    console.log('選択データ', state.data[state.row.row])
    state.data.splice(state.row.row, 0, state.data[state.row.row])
    // 挿入後、フォーカスを下に移動
    state.flexGrid.selection = new wjGrid.CellRange(
      state.row.row + 1,
      state.row.col,
      state.row.row + 1,
      state.row.col
    )
    state.row.row += 1
  }
  return {
    ...toRefs(state),
    itemMap,
    formatItem,
    getCalculatedView,
    initGrid,
    toUpper,
    toLower,
    copyInsert,
  }
}

export type WjGridType = ReturnType<typeof useWjGrid>
export const WjGridKey: InjectionKey<WjGridType> = Symbol('UseWjGrid')
