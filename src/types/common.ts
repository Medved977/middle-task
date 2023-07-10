interface ITableColumn {
  key: string;
  label: string;
  filterType: string;
  clickable?: Boolean;
}

export type TableColumns = ITableColumn[];

export type TableRow = Record<string, any>;

export type TableData = TableRow[];