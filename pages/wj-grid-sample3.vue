<template>
  <div class="container-fluid">
    <p v-html="selectedItem"></p>
    <wj-flex-grid :items-source="data" :initialized="flexInitialized">
      <wj-flex-grid-column :header="'国'" :binding="'country'" width="2*" />
      <wj-flex-grid-column
        :header="'売上'"
        :binding="'sales'"
        width="*"
        format="n2"
      />
      <wj-flex-grid-column
        :header="'費用'"
        :binding="'expenses'"
        width="*"
        format="n2"
      />
    </wj-flex-grid>
  </div>
</template>

<script>
import '@grapecity/wijmo.styles/wijmo.css'
import '@grapecity/wijmo.vue2.grid'
import * as wjcCore from '@grapecity/wijmo'

export default {
  data() {
    return {
      data: this._getData(),
      selectedItem: '',
    }
  },
  methods: {
    flexInitialized(flexgrid) {
      this.flex = flexgrid
      // sort the data by country
      const sd = new wjcCore.SortDescription('country', true)
      flexgrid.collectionView.sortDescriptions.push(sd)
      flexgrid.collectionView.currentChanged.addHandler(
        this._updateCurrentInfo.bind(this)
      )
      this._updateCurrentInfo()
    },

    _getData() {
      // create some random data
      const countries = 'アメリカ,ドイツ,イギリス,日本,イタリア,ギリシャ'.split(
        ','
      )
      const data = []
      for (let i = 0; i < countries.length; i++) {
        data.push({
          id: i,
          country: countries[i],
          sales: Math.random() * 10000,
          expenses: Math.random() * 5000,
        })
      }

      return data
    },

    _updateCurrentInfo() {
      this.selectedItem = wjcCore.format(
        '国: <b>{country}</b>、売上: <b>{sales:c0}</b>、費用: <b>{expenses:c0}</b>',
        this.flex.collectionView.currentItem
      )
    },
  },
}
</script>

<style>
.wj-flexgrid {
  height: 400px;
  margin: 6px 0;
}
</style>
