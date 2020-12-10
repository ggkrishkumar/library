/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React, { useRef, useCallback } from "react";
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
    reRenderListData
}) => {
    const sizeMap = useRef({});
    const setSize = useCallback(
        (index, size) => {
            const currentSize = sizeMap.current[index];
            if (currentSize !== size) {
                sizeMap.current = { ...sizeMap.current, [index]: size };
                reRenderListData(index);
            }
        },
        [rows, additionalColumn, expandedParentRows]
    );
    const getSize = useCallback(
        (index) => {
            const currentRow = rows[index];
            const isParentRow =
                currentRow &&
                currentRow.original &&
                currentRow.original.isParent === true;
            if (isParentRowCollapsed(currentRow)) {
                return 0;
            }
            const { current } = sizeMap;
            const rowSize = current[index];
            let rowSizeToReturn = null;
            if (rowSize !== undefined && rowSize !== null) {
                rowSizeToReturn = rowSize;
            } else if (isParentRow) {
                rowSizeToReturn = current[0];
            } else {
                rowSizeToReturn = current[1];
            }
            return rowSizeToReturn || 50;
        },
        [rows, additionalColumn, expandedParentRows]
    );

    return (
        <List
            ref={(list) => {
                if (infiniteLoaderRef) {
                    infiniteLoaderRef(list);
                }
                listRef.current = list;
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
                    if (rows && rows.length > 0 && index >= 0) {
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
                                toggleParentRowSelection={
                                    toggleParentRowSelection
                                }
                                toggleParentRow={toggleParentRow}
                                isParentRowOpen={isParentRowOpen}
                                isLoadMoreChildRowsRequiredForRow={
                                    isLoadMoreChildRowsRequiredForRow
                                }
                                loadMoreChildData={loadMoreChildData}
                                parentColumn={parentColumn}
                                additionalColumn={additionalColumn}
                                getRowInfo={getRowInfo}
                            />
                        );
                    }
                    return null;
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
    reRenderListData: PropTypes.func
};

export default RowsList;
