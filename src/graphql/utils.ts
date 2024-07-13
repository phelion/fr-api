export const typeSafeUpdate = (oldValue: any, newValue: any) =>
    typeof newValue === 'undefined' ? oldValue : newValue