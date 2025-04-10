export type TaskType = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

export type RootStackParamList = {
  Home: undefined;
  AddEditTask: { task?: TaskType };
};
