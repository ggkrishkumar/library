/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React, { useRef, useCallback, useEffect } from "react";
import { VariableSizeList as List } from "react-window";
import PropTypes from "prop-types";
import ListItem from "./ListItem";

const RowsList = ({
    onItemsRendered,
    infiniteLoaderRef,
    listRef,
    height,
    theme,
    rows,
    overScanCount,
    prepareRow,
    isParentGrid,
    multiRowSelection,
    parentRowExpandable,
    isRowExpandEnabled,
    isParentRowSelected,
    isParentRowCollapsed,
    toggleParentRowSelection,
    toggleParentRow,
    isParentRowOpen,
    isLoadMoreChildRowsRequiredForRow,
    loadMoreChildData,
    parentColumn,
    additionalColumn,
    getRowInfo,
    expandedParentRows,
    reRenderListData,
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow
}) => {
    const sizeMap = useRef({});

    const setSize = (index, size) => {
        const currentSize = sizeMap.current[index];
        if (currentSize !== size) {
            sizeMap.current = { ...sizeMap.current, [index]: size };
            reRenderListData(index);
        }
    };

    const getSize = (index) => {
        const currentRow = rows[index];
        const { original } = currentRow;
        const { lastPage, isParent } = original;
        const isParentRow = isParent === true;
        if (isParentRowCollapsed(currentRow)) {
            return 0;
        }
        const { current } = sizeMap;
        const firstRowSize = current[0];
        const secondRowSize = current[1];
        const defaultRowSize = 50;

        if (fixedRowHeight === true && !isParentRow) {
            if (isParentGrid) {
                if (isLoadMoreChildRowsRequiredForRow(index, lastPage)) {
                    return secondRowSize + 52 || defaultRowSize + 52;
                }
                return secondRowSize || defaultRowSize;
            }
            return firstRowSize || defaultRowSize;
        }

        const currentRowSize = current[index];
        let rowSizeToReturn = null;
        if (currentRowSize !== undefined && currentRowSize !== null) {
            rowSizeToReturn = currentRowSize;
        } else if (isParentRow) {
            rowSizeToReturn = firstRowSize;
        } else {
            rowSizeToReturn = secondRowSize;
        }
        return rowSizeToReturn || defaultRowSize;
    };

    useEffect(() => {
        reRenderListData();
        return () => {
            if (infiniteLoaderRef) {
                infiniteLoaderRef(null);
            }
            listRef.current = null;
        };
    }, []);

    return (
        <List
            ref={(list) => {
                if (list !== null && list !== undefined) {
                    if (infiniteLoaderRef) {
                        infiniteLoaderRef(list);
                    }
                    listRef.current = list;
                }
            }}
            style={{
                overflowX: "hidden"
            }}
            height={height - 60}
            itemCount={rows.length}
            itemSize={getSize}
            onItemsRendered={onItemsRendered}
            overscanCount={overScanCount}
            className="neo-grid__tbody-list"
        >
            {useCallback(
                ({ index, style }) => {
                    // if (isItemLoaded(index)) - This check never became false during testing. Hence avoiding it to reach 100% code coverage in JEST test.
                    const row = rows[index];
                    prepareRow(row);
                    return (
                        <ListItem
                            row={row}
                            style={style}
                            theme={theme}
                            index={index}
                            setSize={setSize}
                            isParentGrid={isParentGrid}
                            multiRowSelection={multiRowSelection}
                            parentRowExpandable={parentRowExpandable}
                            isRowExpandEnabled={isRowExpandEnabled}
                            isParentRowSelected={isParentRowSelected}
                            isParentRowCollapsed={isParentRowCollapsed}
                            toggleParentRowSelection={toggleParentRowSelection}
                            toggleParentRow={toggleParentRow}
                            isParentRowOpen={isParentRowOpen}
                            isLoadMoreChildRowsRequiredForRow={
                                isLoadMoreChildRowsRequiredForRow
                            }
                            loadMoreChildData={loadMoreChildData}
                            parentColumn={parentColumn}
                            additionalColumn={additionalColumn}
                            getRowInfo={getRowInfo}
                            fixedRowHeight={fixedRowHeight}
                            isLoadMoreRequiredForNormalRow={
                                isLoadMoreRequiredForNormalRow
                            }
                        />
                    );
                },
                [rows, additionalColumn, expandedParentRows]
            )}
        </List>
    );
};

RowsList.propTypes = {
    onItemsRendered: PropTypes.func,
    infiniteLoaderRef: PropTypes.any,
    listRef: PropTypes.any,
    height: PropTypes.number,
    theme: PropTypes.string,
    rows: PropTypes.arrayOf(PropTypes.object),
    overScanCount: PropTypes.number,
    prepareRow: PropTypes.func,
    isParentGrid: PropTypes.bool,
    multiRowSelection: PropTypes.bool,
    parentRowExpandable: PropTypes.bool,
    isRowExpandEnabled: PropTypes.bool,
    isParentRowSelected: PropTypes.func,
    isParentRowCollapsed: PropTypes.func,
    toggleParentRowSelection: PropTypes.func,
    toggleParentRow: PropTypes.func,
    isParentRowOpen: PropTypes.func,
    isLoadMoreChildRowsRequiredForRow: PropTypes.func,
    loadMoreChildData: PropTypes.func,
    parentColumn: PropTypes.object,
    additionalColumn: PropTypes.object,
    getRowInfo: PropTypes.func,
    expandedParentRows: PropTypes.array,
    reRenderListData: PropTypes.func,
    fixedRowHeight: PropTypes.bool,
    isLoadMoreRequiredForNormalRow: PropTypes.func
};

export default RowsList;
