export const initialState = { screen: 'plans', selected: null, checks: {}, finished: {} };
export function packingActionTitle(packedCount, total) {
  return packedCount >= total ? 'Complete packing list' : 'Finish packing';
}
export function packingActionHint(packedCount, total) {
  const remaining = total - packedCount;
  if (remaining <= 0) return 'All items are checked. Mark the list complete.';
  return remaining === 1 ? '1 item still to pack.' : `${remaining} items still to pack.`;
}
export function reduce(state, action) {
  switch (action.type) {
    case 'open': return { ...state, selected: action.id, screen: state.finished[action.id] ? 'done' : 'pack' };
    case 'back': return { ...state, screen: state.screen === 'done' ? 'pack' : 'plans' };
    case 'plans': return { ...state, screen: 'plans' };
    case 'toggle': {
      const checks = state.checks[state.selected] || [];
      return { ...state, checks: { ...state.checks, [state.selected]: checks.includes(action.item) ? checks.filter(x => x !== action.item) : [...checks, action.item] }, finished: { ...state.finished, [state.selected]: false } };
    }
    case 'finish': return action.items.every(x => (state.checks[state.selected] || []).includes(x)) ? { ...state, screen: 'done', finished: { ...state.finished, [state.selected]: true } } : state;
    case 'restart': return { ...state, screen: 'pack', checks: { ...state.checks, [state.selected]: [] }, finished: { ...state.finished, [state.selected]: false } };
    default: return state;
  }
}
