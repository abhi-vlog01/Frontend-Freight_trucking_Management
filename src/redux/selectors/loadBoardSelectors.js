import { createSelector } from 'reselect';

// Base selectors
export const selectLoadBoardState = (state) => state.loadBoard;

export const selectLoads = (state) => state.loadBoard.loads;
export const selectOriginalLoads = (state) => state.loadBoard.originalLoads;
export const selectLoadBoardLoading = (state) => state.loadBoard.loading;
export const selectLoadBoardError = (state) => state.loadBoard.error;
export const selectLastFetched = (state) => state.loadBoard.lastFetched;
export const selectTabCountsFromState = (state) => state.loadBoard.tabCounts;

// Tab counts: use stored tabCounts when per-tab fetch is used, else derive from loads
export const selectTabCounts = createSelector(
  [selectLoads, selectTabCountsFromState],
  (loads, tabCountsFromState) => {
    if (tabCountsFromState && Array.isArray(tabCountsFromState) && tabCountsFromState.length >= 4) {
      return tabCountsFromState;
    }
    if (!loads || loads.length === 0) return [0, 0, 0, 0];
    const normalize = (status) => (status ? status.toLowerCase() : '');
    const pending = loads.filter((load) =>
      ['pending', 'approval', 'pending approval', 'posted'].includes(normalize(load.status))
    ).length;
    const bidding = loads.filter((load) =>
      ['bidding', 'bid received', 'posted'].includes(normalize(load.status))
    ).length;
    const inTransit = loads.filter((load) =>
      ['assigned', 'in transit', 'picked up'].includes(normalize(load.status))
    ).length;
    const delivered = loads.filter((load) =>
      ['delivered', 'completed'].includes(normalize(load.status))
    ).length;
    return [pending, bidding, inTransit, delivered];
  }
);


