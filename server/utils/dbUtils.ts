/**
 * JanSamadhan Database Utilities
 * Reusable helpers for pagination, parameterized filtering, safe sorting, search, and error sanitization.
 */

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export interface QueryFilter {
  field: string;
  value: unknown;
  operator?: '=' | 'ILIKE' | 'IN' | '>' | '<' | '>=' | '<=';
}

/**
 * Validates and calculates pagination limits and offsets.
 */
export const buildPagination = (options: PaginationOptions = {}) => {
  const page = Math.max(1, options.page ? Number(options.page) : 1);
  const requestedLimit = options.limit ? Number(options.limit) : 10;
  const limit = Math.min(100, Math.max(1, requestedLimit));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Sanitizes sorting inputs against an allowlist of valid columns to prevent SQL injection.
 */
export const buildOrderBy = (
  sortOptions: SortOptions = {},
  allowedColumns: Record<string, string>,
  defaultColumnKey: string,
  defaultOrder: 'ASC' | 'DESC' = 'DESC'
): string => {
  const columnKey = sortOptions.sortBy || defaultColumnKey;
  const sqlColumn = allowedColumns[columnKey] || allowedColumns[defaultColumnKey];
  const rawOrder = (sortOptions.sortOrder || defaultOrder).toUpperCase();
  const order = rawOrder === 'ASC' ? 'ASC' : 'DESC';

  return `ORDER BY ${sqlColumn} ${order}`;
};

/**
 * Builds parameterized WHERE clauses for filtering and search.
 */
export interface WhereBuilderResult {
  whereClause: string;
  params: unknown[];
  nextParamIndex: number;
}

export const buildWhereBuilder = (initialParamIndex = 1) => {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = initialParamIndex;

  return {
    addFilter: (column: string, value: unknown, operator: '=' | 'ILIKE' | '>' | '<' | '>=' | '<=' = '=') => {
      if (value !== undefined && value !== null && value !== '') {
        if (operator === 'ILIKE') {
          conditions.push(`${column} ILIKE $${paramIndex}`);
          params.push(`%${value}%`);
        } else {
          conditions.push(`${column} ${operator} $${paramIndex}`);
          params.push(value);
        }
        paramIndex++;
      }
    },
    addSearch: (columns: string[], searchKeyword?: string) => {
      if (searchKeyword && searchKeyword.trim().length > 0) {
        const clean = `%${searchKeyword.trim()}%`;
        const subConditions = columns.map((col) => `${col} ILIKE $${paramIndex}`);
        conditions.push(`(${subConditions.join(' OR ')})`);
        params.push(clean);
        paramIndex++;
      }
    },
    addRaw: (condition: string, ...values: unknown[]) => {
      conditions.push(condition);
      for (const val of values) {
        params.push(val);
        paramIndex++;
      }
    },
    build: (): WhereBuilderResult => ({
      whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
      nextParamIndex: paramIndex,
    }),
  };
};

/**
 * Sanitizes DB errors to prevent leaking raw connection or table structure details.
 */
export const handleDbError = (err: unknown, context: string): never => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[JanSamadhan DB Error] ${context}:`, message);
  throw new Error(`Database operation failed during ${context}. Please try again later.`, { cause: err });
};
