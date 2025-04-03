const getQuery = (pageNo, pageSize) => {
    return `&pageNo=${pageNo}&PageSize${pageSize}`;
}

export {
    getQuery
};