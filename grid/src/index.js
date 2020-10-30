import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    extractColumns,
    extractAdditionalColumn
} from "./Utilities/ColumnsUtilities";
import Customgrid from "./Customgrid";
// eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./Styles/main.scss";

const Grid = (props) => {
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
        columns,
        columnToExpand,
        rowActions,
        rowActionCallback,
        getRowEditOverlay,
        onRowUpdate,
        onRowDelete,
        onRowSelect,
        getRowInfo,
        calculateRowHeight,
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
        rowsToDeselect
    } = props;

    // Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    // Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    // Logic for searching in each column
    const searchColumn = (column, original, searchText) => {
        // Return value
        let isValuePresent = false;
        // Find the accessor node and inner cells array of each column
        const { accessor, innerCells } = column;
        // Find accessor value of a column
        const rowAccessorValue = original[accessor];
        // Check if inner cells are available and save value to boolean var
        const isInnerCellsPresent = innerCells && innerCells.length > 0;
        // Check if the column needs to be skipped from search
        if (column.isSearchable) {
            // Enter if cell value is object or array
            if (typeof rowAccessorValue === "object" && isInnerCellsPresent) {
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
                        const dataAccessor = original[accessor][cell.accessor];
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
                    dataAccessor.toString().toLowerCase().includes(searchText)
                ) {
                    isValuePresent = true;
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

    // Gets triggered when one row item is deleted
    const deleteRowFromGrid = (original) => {
        if (onRowDelete) {
            onRowDelete(original);
        }
    };

    // Local state value for holding columns configuration
    const [gridColumns, setGridColumns] = useState([]);

    // Local state value for holding the additional column configuration
    const [additionalColumn, setAdditionalColumn] = useState(null);

    // Add logic to calculate height of each row, based on the content of  or more columns
    // This can be used only if developer using the component has not passed a function to calculate row height
    const calculateDefaultRowHeight = (row, columnsInGrid) => {
        // Minimum height for each row
        let rowHeight = 50;
        if (columnsInGrid && columnsInGrid.length > 0 && row) {
            // Get properties of a row
            const { original, isExpanded } = row;
            // Find the column with maximum width configured, from grid columns list
            const columnWithMaxWidth = [...columnsInGrid].sort((a, b) => {
                return b.width - a.width;
            })[0];
            // Get column properties including the user resized column width (totalFlexWidth)
            const { id, width, totalFlexWidth } = columnWithMaxWidth;
            // Get row value of that column
            const rowValue = original[id];
            if (rowValue) {
                // Find the length of text of data in that column
                const textLength = Object.values(rowValue).join(",").length;
                // This is a formula that was created for the test data used.
                rowHeight += Math.ceil((80 * textLength) / totalFlexWidth);
                const widthVariable =
                    totalFlexWidth > width
                        ? totalFlexWidth - width
                        : width - totalFlexWidth;
                rowHeight += widthVariable / 1000;
            }
            // Add logic to increase row height if row is expanded
            if (isExpanded && additionalColumn) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    additionalColumn.innerCells &&
                    additionalColumn.innerCells.length > 0
                        ? additionalColumn.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    };

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
            return originalData.sort((x, y) => {
                let compareResult = 0;
                groupSortOptions.forEach((option) => {
                    const { sortBy, sortOn, order } = option;
                    const newResult =
                        sortOn === "value"
                            ? compareValues(order, x[sortBy], y[sortBy])
                            : compareValues(
                                  order,
                                  x[sortBy][sortOn],
                                  y[sortBy][sortOn]
                              );
                    compareResult = compareResult || newResult;
                });
                return compareResult;
            });
        }
        return originalData;
    };
    // #endregion

    // Gets called when page scroll reaches the bottom of the grid.
    // Trigger call back and get the grid data updated.
    const loadNextPage = () => {
        if (pageInfo) {
            const { lastPage, pageNum, pageSize, endCursor } = pageInfo;
            if (!lastPage) {
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
                expandableColumn
            )
        );
    }, [columns]);

    useEffect(() => {
        setAdditionalColumn(
            extractAdditionalColumn(columnToExpand, isDesktop, updateRowInGrid)
        );
    }, [columnToExpand]);

    if (!(gridData && gridData.length > 0)) {
        return (
            <div
                data-testid="gridComponent"
                className={`grid-component-container ${className || ""}`}
            >
                <h2 style={{ textAlign: "center", marginTop: "70px" }}>
                    <span className="error">Invalid Data</span>
                </h2>
            </div>
        );
    }
    if (!(gridColumns && gridColumns.length > 0)) {
        return (
            <div
                data-testid="gridComponent"
                className={`grid-component-container ${className || ""}`}
            >
                <h2 style={{ textAlign: "center", marginTop: "70px" }}>
                    <span className="error">Invalid Column Configuration</span>
                </h2>
            </div>
        );
    }

    return (
        <div
            data-testid="gridComponent"
            className={`grid-component-container ${className || ""} ${
                theme === "portal" ? "neo-grid-portal" : ""
            }`}
        >
            <Customgrid
                theme={theme}
                title={title}
                gridHeight={gridHeight}
                gridWidth={gridWidth}
                managableColumns={gridColumns}
                expandedRowData={additionalColumn}
                gridData={gridData}
                rowsToOverscan={rowsToOverscan}
                idAttribute={idAttribute}
                totalRecordsCount={pageInfo ? pageInfo.total : 0}
                getRowEditOverlay={getRowEditOverlay}
                updateRowInGrid={updateRowInGrid}
                deleteRowFromGrid={deleteRowFromGrid}
                searchColumn={searchColumn}
                onRowSelect={onRowSelect}
                getRowInfo={getRowInfo}
                calculateRowHeight={
                    calculateRowHeight &&
                    typeof calculateRowHeight === "function"
                        ? calculateRowHeight
                        : calculateDefaultRowHeight
                }
                expandableColumn={expandableColumn}
                rowActions={rowActions}
                rowActionCallback={rowActionCallback}
                hasNextPage={pageInfo ? !pageInfo.lastPage : false}
                isNextPageLoading={isNextPageLoading}
                loadNextPage={loadNextPage}
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
                onGridRefresh={onGridRefresh}
                rowsToSelect={rowsToSelect}
                rowsToDeselect={rowsToDeselect}
            />
            {isNextPageLoading ? (
                <div id="loader" className="background">
                    <div className="dots container">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

Grid.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.string,
    title: PropTypes.string,
    gridHeight: PropTypes.string,
    gridWidth: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.object),
    columnToExpand: PropTypes.object,
    gridData: PropTypes.arrayOf(PropTypes.object),
    rowsToOverscan: PropTypes.number,
    idAttribute: PropTypes.string,
    paginationType: PropTypes.string,
    pageInfo: PropTypes.object,
    loadMoreData: PropTypes.func,
    getRowEditOverlay: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
    onRowSelect: PropTypes.func,
    getRowInfo: PropTypes.func,
    calculateRowHeight: PropTypes.func,
    expandableColumn: PropTypes.bool,
    rowActions: PropTypes.arrayOf(PropTypes.object),
    rowActionCallback: PropTypes.func,
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
    rowsToDeselect: PropTypes.array
};

export default Grid;
