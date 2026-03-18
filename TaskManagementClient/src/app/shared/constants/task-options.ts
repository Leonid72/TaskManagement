import { Priority, TaskStatus } from '../../core/models/task.model';
import { SelectOption } from '../components/select-dropdown/select-dropdown.component';

export const PRIORITY_OPTIONS: SelectOption[] = [
  { value: Priority.Low,    label: 'task.priority.Low' },
  { value: Priority.Medium, label: 'task.priority.Medium' },
  { value: Priority.High,   label: 'task.priority.High' },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { value: TaskStatus.Todo,       label: 'task.status.Todo' },
  { value: TaskStatus.InProgress, label: 'task.status.InProgress' },
  { value: TaskStatus.Done,       label: 'task.status.Done' },
];
