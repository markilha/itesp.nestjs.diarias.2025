export function getPaginatedQuery(queryBuilder, startRow:number, endRow:number) {
  
    return `
       WITH base_query AS (${queryBuilder.getQuery()}),
      count_query AS (SELECT COUNT(*) as total_count FROM base_query),
      paginated_data AS (SELECT a.*, ROWNUM rnum 
        FROM (SELECT * FROM base_query) a 
        WHERE ROWNUM <= ${endRow}
      )
      SELECT pd.*, cq.total_count
      FROM paginated_data pd
      CROSS JOIN count_query cq
      WHERE pd.rnum >= ${startRow}
    `;
  }
  