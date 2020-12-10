import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import memoize from "lodash.memoize";
import {
    extractColumns,
    extractAdditionalColumn
} from "./Utilities/ColumnsUtilities";
import Customgrid from "./Customgrid";
// Old method - eslint-disable-next-line import/no-unresolved
// import "!style-loader!css-loader!sass-loader!./Styles/main.scss";
// lazy styles inclusion via styleloader
import __cmpStyles from "./Styles/main.scss";

const processedData = (gridData, parentIdAttribute) => {
    if (gridData && gridData.length > 0) {
        const processedGridData = [];
        gridData.forEach((gridDataItem) => {
            const updatedData = { ...gridDataItem };
            updatedData.isParent = true;
            delete updatedData.childData;
            processedGridData.push(updatedData);
            const { childData } = gridDataItem;
            if (childData && parentIdAttribute) {
                const parentId = gridDataItem[parentIdAttribute];
                const { data } = childData;
                if (
                    data &&
                    data.length > 0 &&
                    parentId !== null &&
                    parentId !== undefined
                ) {
                    const {
                        pageNum,
                        endCursor,
                        pageSize,
                        lastPage
                    } = childData;
                    data.forEach((dataItem) => {
                        const updatedDataItem = dataItem;
                        updatedDataItem[parentIdAttribute] = parentId;
                        updatedDataItem.pageNum = pageNum;
                        updatedDataItem.endCursor = endCursor;
                        updatedDataItem.pageSize = pageSize;
                        updatedDataItem.lastPage = lastPage;
                        processedGridData.push(updatedDataItem);
                    });
                }
            }
        });
        return processedGridData;
    }
    return [];
};
const getProcessedData = memoize(processedData);

const Grid = (props) => {
    useEffect(() => {
        if (__cmpStyles.use) {
            __cmpStyles.use();
        }
        return () => {
            if (__cmpStyles.unuse) {
                __cmpStyles.unuse();
            }
        };
    }, []);

    const {
        className,
        theme,
        title,
        gridHeight,
        gridWidth,
        gridData,
        rowsToOverscan,
        idAttribute,
        paginationType,
        pageInfo,
        loadMoreData,
        serverSideSorting,
        columns,
        columnToExpand,
        parentColumn,
        parentIdAttribute,
        parentRowExpandable,
        parentRowsToExpand,
        rowActions,
        onRowUpdate,
        onRowSelect,
        getRowInfo,
        expandableColumn,
        CustomPanel,
        multiRowSelection,
        gridHeader,
        rowSelector,
        globalSearch,
        columnFilter,
        groupSort,
        columnChooser,
        exportData,
        onGridRefresh,
        rowsToSelect,
        rowsToDeselect,
        fileName
    } = props;

    // Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    // Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    // To check if useEffect Call is completed or not
    const [isLoaded, setIsLoaded] = useState(false);

    // Logic for searching in each column
    const searchColumn = (column, original, searchText) => {
        // Check if row is parent row
        const { isParent } = original;
        // Return value
        let isValuePresent = isParent === true;
        // Find the accessor node and inner cells array of each column
        const { accessor, innerCells } = column;
        // Find accessor value of a column
        const rowAccessorValue = original[accessor];
        if (rowAccessorValue !== null && rowAccessorValue !== undefined) {
            // Check if inner cells are available and save value to boolean var
            const isInnerCellsPresent = innerCells && innerCells.length > 0;
            // Check if the column needs to be skipped from search
            if (column.isSearchable) {
                // Enter if cell value is object or array
                if (
                    typeof rowAccessorValue === "object" &&
                    isInnerCellsPresent
                ) {
                    // Enter if cell value is array
                    if (rowAccessorValue.length > 0) {
                        // Loop through cell array value and check if searched text is present
                        rowAccessorValue.forEach((value) => {
                            innerCells.forEach((cell) => {
                                const dataAccessor = value[cell.accessor];
                                const isSearchEnabled = cell.isSearchable;
                                if (
                                    dataAccessor &&
                                    isSearchEnabled &&
                                    dataAccessor
                                        .toString()
                                        .toLowerCase()
                                        .includes(searchText)
                                ) {
                                    isValuePresent = true;
                                }
                            });
                        });
                    } else {
                        // If cell value is an object, loop through inner cells and check if searched text is present
                        innerCells.forEach((cell) => {
                            const dataAccessor =
                                original[accessor][cell.accessor];
                            const isSearchEnabled = cell.isSearchable;
                            if (
                                dataAccessor &&
                                isSearchEnabled &&
                                dataAccessor
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchText)
                            ) {
                                isValuePresent = true;
                            }
                        });
                    }
                } else {
                    // If cell value is not an object or array, convert it to text and check if searched text is present
                    const dataAccessor = original[accessor];
                    if (
                        dataAccessor &&
                        dataAccessor
                            .toString()
                            .toLowerCase()
                            .includes(searchText)
                    ) {
                        isValuePresent = true;
                    }
                }
            }
        }
        return isValuePresent;
    };

    // Gets triggered when one row item is updated
    const updateRowInGrid = (original, updatedRow) => {
        if (onRowUpdate) {
            onRowUpdate(original, updatedRow);
        }
    };

    // Local state value for holding columns configuration
    const [gridColumns, setGridColumns] = useState([]);

    // Local state value for holding the additional column configuration
    const [additionalColumn, setAdditionalColumn] = useState(null);

    const isParentGrid = parentColumn !== null && parentColumn !== undefined;

    // #region - Group sorting logic
    // Function to return sorting logic based on the user selected order of sort
    const compareValues = (compareOrder, v1, v2) => {
        let returnValue = 0;
        if (compareOrder === "Ascending") {
            if (v1 > v2) {
                returnValue = 1;
            } else if (v1 < v2) {
                returnValue = -1;
            }
            return returnValue;
        }
        if (v1 < v2) {
            returnValue = 1;
        } else if (v1 > v2) {
            returnValue = -1;
        }
        return returnValue;
    };
    // Function to return sorted data
    const getSortedData = (originalData, groupSortOptions) => {
        if (
            originalData &&
            originalData.length > 0 &&
            groupSortOptions &&
            groupSortOptions.length > 0
        ) {
            if (
                isParentGrid &&
                parentIdAttribute !== null &&
                parentIdAttribute !== undefined
            ) {
                let sortedTreeData = [];
                const parentDataFromOriginalData = originalData.filter(
                    (dataToFilter) => {
                        let returnValue = false;
                        if (dataToFilter) {
                            const { isParent } = dataToFilter;
                            returnValue = isParent === true;
                        }
                        return returnValue;
                    }
                );
                parentDataFromOriginalData.forEach((dataFromGrid) => {
                    if (dataFromGrid) {
                        sortedTreeData.push(dataFromGrid);
                        const parentIdentifier =
                            dataFromGrid[parentIdAttribute];
                        if (
                            parentIdentifier !== null &&
                            parentIdentifier !== undefined
                        ) {
                            const childRowsOfParent = originalData.filter(
                                (origData) => {
                                    return (
                                        origData &&
                                        origData.isParent !== true &&
                                        origData[parentIdAttribute] ===
                                            parentIdentifier
                                    );
                                }
                            );
                            if (
                                childRowsOfParent &&
                                childRowsOfParent.length > 0
                            ) {
                                const sortedChildData = childRowsOfParent.sort(
                                    (x, y) => {
                                        let compareResult = 0;
                                        groupSortOptions.forEach((option) => {
                                            const {
                                                sortBy,
                                                sortOn,
                                                order
                                            } = option;
                                            const xSortBy = x[sortBy];
                                            const ySortBy = y[sortBy];
                                            let xSortOn = null;
                                            let ySortOn = null;
                                            if (
                                                xSortBy !== null &&
                                                xSortBy !== undefined
                                            ) {
                                                xSortOn = xSortBy[sortOn];
                                            }
                                            if (
                                                ySortBy !== null &&
                                                ySortBy !== undefined
                                            ) {
                                                ySortOn = ySortBy[sortOn];
                                            }
                                            const newResult =
                                                sortOn === "value"
                                                    ? compareValues(
                                                          order,
                                                          xSortBy,
                                                          ySortBy
                                                      )
                                                    : compareValues(
                                                          order,
                                                          xSortOn,
                                                          ySortOn
                                                      );
                                            compareResult =
                                                compareResult || newResult;
                                        });
                                        return compareResult;
                                    }
                                );
                                sortedTreeData = [
                                    ...sortedTreeData,
                                    ...sortedChildData
                                ];
                            }
                        }
                    }
                });
                return sortedTreeData;
            }
            return originalData.sort((x, y) => {
                let compareResult = 0;
                if (
                    x !== null &&
                    x !== undefined &&
                    y !== null &&
                    y !== undefined
                )
                    groupSortOptions.forEach((option) => {
                        const { sortBy, sortOn, order } = option;
                        const xSortBy = x[sortBy];
                        const ySortBy = y[sortBy];
                        let xSortOn = null;
                        let ySortOn = null;
                        if (xSortBy !== null && xSortBy !== undefined) {
                            xSortOn = xSortBy[sortOn];
                        }
                        if (ySortBy !== null && ySortBy !== undefined) {
                            ySortOn = ySortBy[sortOn];
                        }
                        const newResult =
                            sortOn === "value"
                                ? compareValues(order, xSortBy, ySortBy)
                                : compareValues(order, xSortOn, ySortOn);
                        compareResult = compareResult || newResult;
                    });
                return compareResult;
            });
        }
        return originalData;
    };
    // #endregion

    const loadChildData = (row) => {
        if (row && parentIdAttribute) {
            const { lastPage, pageNum, pageSize, endCursor } = row;
            const isIntialLoad =
                lastPage === undefined &&
                pageNum === undefined &&
                pageSize === undefined &&
                endCursor === undefined;
            const parentId = row[parentIdAttribute];
            if (
                (lastPage === false || isIntialLoad) &&
                parentId !== null &&
                parentId !== undefined
            ) {
                let pageInfoObj = null;
                if (paginationType === "cursor") {
                    if (endCursor !== null && endCursor !== undefined) {
                        pageInfoObj = {
                            endCursor,
                            pageSize
                        };
                    }
                    loadMoreData(pageInfoObj, parentId);
                } else {
                    if (
                        pageNum !== null &&
                        pageNum !== undefined &&
                        typeof pageNum === "number"
                    ) {
                        pageInfoObj = {
                            pageNum: pageNum + 1,
                            pageSize
                        };
                    }
                    loadMoreData(pageInfoObj, parentId);
                }
            }
        }
    };

    // Gets called when page scroll reaches the bottom of the grid.
    // Trigger call back and get the grid data updated.
    const loadNextPage = () => {
        if (pageInfo) {
            const { lastPage, pageNum, pageSize, endCursor } = pageInfo;
            if (lastPage === false) {
                setIsNextPageLoading(true);
                if (paginationType === "cursor") {
                    loadMoreData({
                        endCursor,
                        pageSize
                    });
                } else {
                    loadMoreData({
                        pageNum: pageNum + 1,
                        pageSize
                    });
                }
            }
        }
    };

    useEffect(() => {
        setIsNextPageLoading(false);
    }, [gridData, pageInfo]);

    useEffect(() => {
        setGridColumns(
            extractColumns(
                columns,
                searchColumn,
                isDesktop,
                updateRowInGrid,
                expandableColumn,
                isParentGrid
            )
        );
        setAdditionalColumn(
            extractAdditionalColumn(columnToExpand, isDesktop, updateRowInGrid)
        );
    }, [columns, columnToExpand]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    let processedGridData = gridData && gridData.length > 0 ? gridData : [];
    if (isParentGrid) {
        processedGridData = getProcessedData(gridData, parentIdAttribute);
    }

    if (isLoaded) {
        if (!(gridColumns && gridColumns.length > 0)) {
            return (
                <div
                    data-testid="gridComponent"
                    className={`neo-grid ${className || ""}`}
                >
                    <h2 data-testid="nocolumnserror" className="ng-error">
                        Invalid Column Configuration
                    </h2>
                </div>
            );
        }
        return (
            <div
                data-testid="gridComponent"
                className={`neo-grid ${className || ""} ${
                    theme === "portal" ? "neo-grid--portal" : ""
                }`}
                style={{ width: gridWidth || "100%" }}
            >
                <Customgrid
                    isDesktop={isDesktop}
                    title={title}
                    gridHeight={gridHeight}
                    theme={theme}
                    managableColumns={gridColumns}
                    expandedRowData={additionalColumn}
                    parentColumn={parentColumn}
                    parentIdAttribute={parentIdAttribute}
                    parentRowExpandable={parentRowExpandable}
                    parentRowsToExpand={parentRowsToExpand}
                    loadChildData={loadChildData}
                    isParentGrid={isParentGrid}
                    gridData={processedGridData}
                    rowsToOverscan={rowsToOverscan}
                    idAttribute={idAttribute}
                    isPaginationNeeded={
                        pageInfo !== undefined &&
                        pageInfo !== null &&
                        !isParentGrid
                    }
                    totalRecordsCount={pageInfo ? pageInfo.total : 0}
                    updateRowInGrid={updateRowInGrid}
                    searchColumn={searchColumn}
                    onRowSelect={onRowSelect}
                    getRowInfo={getRowInfo}
                    expandableColumn={expandableColumn}
                    rowActions={rowActions}
                    hasNextPage={pageInfo ? !pageInfo.lastPage : false}
                    isNextPageLoading={isNextPageLoading}
                    loadNextPage={loadNextPage}
                    serverSideSorting={serverSideSorting}
                    getSortedData={getSortedData}
                    CustomPanel={CustomPanel}
                    multiRowSelection={multiRowSelection}
                    gridHeader={gridHeader}
                    rowSelector={rowSelector}
                    globalSearch={globalSearch}
                    columnFilter={columnFilter}
                    groupSort={groupSort}
                    columnChooser={columnChooser}
                    exportData={exportData}
                    fileName={fileName}
                    onGridRefresh={onGridRefresh}
                    rowsToSelect={rowsToSelect}
                    rowsToDeselect={rowsToDeselect}
                />
                {isNextPageLoading ? (
                    <div className="ng-loader">
                        <div className="ng-loader__dots-block">
                            <span className="ng-loader__dots" />
                            <span className="ng-loader__dots" />
                            <span className="ng-loader__dots" />
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
    return null;
};

Grid.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.string,
    title: PropTypes.string,
    gridHeight: PropTypes.string,
    gridWidth: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.object),
    columnToExpand: PropTypes.object,
    parentColumn: PropTypes.object,
    parentIdAttribute: PropTypes.string,
    parentRowExpandable: PropTypes.bool,
    parentRowsToExpand: PropTypes.array,
    gridData: PropTypes.arrayOf(PropTypes.object),
    rowsToOverscan: PropTypes.number,
    idAttribute: PropTypes.string,
    paginationType: PropTypes.string,
    pageInfo: PropTypes.object,
    loadMoreData: PropTypes.func,
    serverSideSorting: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowSelect: PropTypes.func,
    getRowInfo: PropTypes.func,
    expandableColumn: PropTypes.bool,
    rowActions: PropTypes.any,
    CustomPanel: PropTypes.any,
    multiRowSelection: PropTypes.bool,
    gridHeader: PropTypes.bool,
    rowSelector: PropTypes.bool,
    globalSearch: PropTypes.bool,
    columnFilter: PropTypes.bool,
    groupSort: PropTypes.bool,
    columnChooser: PropTypes.bool,
    exportData: PropTypes.bool,
    onGridRefresh: PropTypes.func,
    rowsToSelect: PropTypes.array,
    rowsToDeselect: PropTypes.array,
    fileName: PropTypes.string
};

export default Grid;
