const nestQuery = (query,identifier) => {
  return `    
      (SELECT array_to_json(array_agg(row_to_json(x)))
      FROM (${query}) x)
      `
}


module.exports = {
  nestQuery,
}