export const updatedActionsHeaderClass = (isDesktop) => {
    if (isDesktop) {
        const tableContainerList = document.getElementsByClassName(
            "neo-grid__tbody-list"
        );
        if (tableContainerList && tableContainerList.length > 0) {
            const tableContainer = tableContainerList[0];
            const tableHeaders = document.getElementsByClassName(
                "neo-grid__thead"
            );
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

export const findSelectedRows = (rows, selectedRowIds, getRowInfo) => {
    const rowsSelectedByUser = [];
    if (rows && rows.length > 0 && selectedRowIds) {
        Object.entries(selectedRowIds).forEach((objEntry) => {
            if (objEntry && objEntry.length > 0) {
                const rowId = objEntry[0];
                const isSelected = objEntry[1];
                if (isSelected) {
                    const selectedRow = rows.find((flatRow) => {
                        if (getRowInfo && typeof getRowInfo === "function") {
                            const rowInfo = getRowInfo(flatRow.original);
                            return (
                                !(
                                    rowInfo && rowInfo.isRowSelectable === false
                                ) && flatRow.id === rowId
                            );
                        }
                        return flatRow.id === rowId;
                    });
                    if (selectedRow) {
                        const { original } = selectedRow;
                        if (original) {
                            const { isParent } = original;
                            if (isParent !== true) {
                                rowsSelectedByUser.push(original);
                            }
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
            const rowIdValue = row[idAttribute];
            if (rowIdValue !== null && rowIdValue !== undefined) {
                rowIdentifiers.push(rowIdValue);
            }
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

export const findDeSelectedRows = (
    selectedRows,
    oldUserSelectedRowIdentifiers,
    currentUserSelectedRowIdentifiers,
    idAttribute
) => {
    const deSelectedRows = [];
    if (
        selectedRows &&
        selectedRows.length > 0 &&
        oldUserSelectedRowIdentifiers &&
        oldUserSelectedRowIdentifiers.length > 0 &&
        idAttribute
    ) {
        oldUserSelectedRowIdentifiers.forEach((oldAttr) => {
            if (!currentUserSelectedRowIdentifiers.includes(oldAttr)) {
                const deSelectedRow = selectedRows.find((row) => {
                    return row.original[idAttribute] === oldAttr;
                });
                if (deSelectedRow && deSelectedRow.original) {
                    deSelectedRows.push(deSelectedRow.original);
                }
            }
        });
    }
    return deSelectedRows;
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

export const findAllChildRows = (allRows) => {
    if (allRows && allRows.length > 0) {
        return allRows.filter((row) => {
            let returnValue = false;
            if (row) {
                const { original } = row;
                if (original) {
                    const { isParent } = original;
                    returnValue = isParent !== true;
                }
            }
            return returnValue;
        });
    }
    return [];
};
