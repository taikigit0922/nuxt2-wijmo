import { reactive, toRefs, InjectionKey } from '@nuxtjs/composition-api'

interface State {
  dialog: boolean
  cd: string
}

export default function useListDialog() {
  const state = reactive<State>({
    dialog: false,
    cd: '',
  })
  return {
    ...toRefs(state),
  }
}
export type ListDialogType = ReturnType<typeof useListDialog>
export const ListDialogKey: InjectionKey<ListDialogType> =
  Symbol('UseListDialog')
