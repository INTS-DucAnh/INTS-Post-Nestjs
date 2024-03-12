export type ActionOnTarget = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';
export type ActionsDto = {
  target: string;
  action: ActionOnTarget[];
};
