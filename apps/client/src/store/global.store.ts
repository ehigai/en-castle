import { create } from "zustand"

interface GlobalState {
  isdeveloperMode: boolean
  autoFlip: boolean
  showNotations: boolean
  toggleDeveloperMode: () => void
  toggleAutoFlip: () => void
  toggleNotations: () => void
}

const useGlobalStore = create<GlobalState>((set) => ({
  isdeveloperMode: false,
  autoFlip: false,
  showNotations: false,
  toggleDeveloperMode: () =>
    set((state) => ({ isdeveloperMode: !state.isdeveloperMode })),
  toggleAutoFlip: () => set((state) => ({ autoFlip: !state.autoFlip })),
  toggleNotations: () =>
    set((state) => ({ showNotations: !state.showNotations })),
}))

export default useGlobalStore
