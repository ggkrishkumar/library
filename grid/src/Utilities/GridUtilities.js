export const updatedActionsHeaderClass = () => {
    const tableContainerList = document.getElementsByClassName(
        "tableContainer__List"
    );
    if (tableContainerList && tableContainerList.length > 0) {
        const tableContainer = tableContainerList[0];
        const tableHeaders = document.getElementsByClassName("table-row--head");
        if (tableHeaders && tableHeaders.length > 0) {
            const tableHeader = tableHeaders[0];
            if (tableContainer.offsetHeight < tableContainer.scrollHeight) {
                if (!tableHeader.classList.contains("withScroll")) {
                    tableHeader.classList.add("withScroll");
                }
            } else {
                tableHeader.classList.remove("withScroll");
            }
        }
    }
};

export const findSelectedRows = (rows, selectedRowIds) => {
    const rowsSelectedByUser = [];
    if (rows && rows.length > 0 && selectedRowIds) {
        Object.entries(selectedRowIds).forEach((objEntry) => {
            if (objEntry && objEntry.length > 0) {
                const rowId = objEntry[0];
                const isSelected = objEntry[1];
                if (isSelected) {
                    const selectedRow = rows.find((flatRow) => {
                        return flatRow.id === rowId;
                    });
                    if (selectedRow) {
                        const { original } = selectedRow;
                        if (original) {
                            rowsSelectedByUser.push(original);
                        }
                    }
                }
            }
        });
    }
    return rowsSelectedByUser;
};

export const findSelectedRowIdAttributes = (selectedRows, idAttribute) => {
    const rowIdentifiers = [];
    if (selectedRows && selectedRows.length > 0 && idAttribute) {
        selectedRows.forEach((row) => {
            rowIdentifiers.push(row[idAttribute]);
        });
    }
    return rowIdentifiers;
};

export const findSelectedRowIdFromIdAttribute = (
    selectedRows,
    idAttribute,
    userSelectedRowIdentifiers
) => {
    if (
        selectedRows &&
        selectedRows.length > 0 &&
        userSelectedRowIdentifiers &&
        userSelectedRowIdentifiers.length > 0 &&
        idAttribute
    ) {
        const idAttributeValue = userSelectedRowIdentifiers[0];
        const selectedRow = selectedRows.find((row) => {
            return row.original[idAttribute] === idAttributeValue;
        });
        if (selectedRow) {
            return selectedRow.id;
        }
    }
    return null;
};

export const convertToIndividualColumns = (managableColumns) => {
    let modifiedColumns = [];
    managableColumns.forEach((item) => {
        const { columns } = item;
        if (columns && columns.length > 0) {
            modifiedColumns = [...modifiedColumns, ...columns];
        } else {
            modifiedColumns.push(item);
        }
    });
    return [...modifiedColumns];
};

export const checkdisplayOfGroupedColumns = (groupedColumn) => {
    if (groupedColumn) {
        const { headers } = groupedColumn;
        if (headers && headers.length > 0) {
            const headerToDisplay = headers.find((header) => {
                return header.display === true;
            });
            if (headerToDisplay) {
                return true;
            }
        }
    }
    return false;
};

export const checkIfGroupsortIsApplicable = (columns) => {
    const individualColumns = convertToIndividualColumns(columns);
    const sortableColumn = individualColumns.find(
        (col) => col.isSortable === true
    );
    if (sortableColumn) {
        return true;
    }
    return false;
};
