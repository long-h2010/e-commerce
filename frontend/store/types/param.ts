export type Pagination = { page: number; limit?: number | string };

export type Filter = {
  field: string;
  operator: string;
  value: string | number | null;
};

export type Sorter = {
  field: string;
  order: 'asc' | 'desc';
};

export type Params = {
  pagination?: Pagination;
  filters?: Filter[];
  sorters?: Sorter[];
};
