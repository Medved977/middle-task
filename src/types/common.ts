interface ITableColumn {
  key: string;
  label: string;
  clickable?: Boolean;
}

export type TableColumns = ITableColumn[];