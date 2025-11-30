import { create } from "zustand";

type RefreshState = {
  needsRefresh: boolean;
  setNeedsRefresh: (value: boolean) => void;
};

export const CalendarRefreshStore = create<RefreshState>((set) => ({
  needsRefresh: true,
  setNeedsRefresh: (value) => set({ needsRefresh: value })
}));

export const StandingsRefreshStore = create<RefreshState>((set) => ({
  needsRefresh: true,
  setNeedsRefresh: (value) => set ({ needsRefresh: value})
}));

export const HomeRefreshStore = create<RefreshState>((set) => ({
  needsRefresh: true,
  setNeedsRefresh: (value) => set ({ needsRefresh: value})
}));