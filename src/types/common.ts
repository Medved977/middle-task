import { IUser } from "./User";

interface ITableColumn {
  key: string;
  label: string;
  filterType: string;
  clickable?: Boolean;
}

export type TableColumns = ITableColumn[];

export type TableRow = IUser;

export type TableData = TableRow[];