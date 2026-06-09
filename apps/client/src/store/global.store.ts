import { create } from "zustand"

interface GlobalState {
  isdeveloperMode: boolean
  autoFlip: boolean
  toggleDeveloperMode: () => void
  toggleAutoFlip: () => void
}

const useGlobalStore = create<GlobalState>((set) => ({
  isdeveloperMode: false,
  autoFlip: false,
  toggleDeveloperMode: () =>
    set((state) => ({ isdeveloperMode: !state.isdeveloperMode })),
  toggleAutoFlip: () =>
    set((state) => ({ autoFlip: !state.autoFlip })),
}))

export default useGlobalStore
