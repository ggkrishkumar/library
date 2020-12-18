import React from "react";
import PropTypes from "prop-types";
import ParentItem from "./ParentItem";
import RowItem from "./RowItem";

const ListItem = ({
    row,
    style,
    theme,
    index,
    setSize,
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
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow
}) => {
    if (isParentRowCollapsed(row)) {
        return null;
    }

    const { original } = row;
    const { isParent, lastPage } = original;
    if (isParent === true && isParentGrid) {
        return (
            <div className="ng-accordion" style={style}>
                <ParentItem
                    row={row}
                    index={index}
                    setSize={setSize}
                    multiRowSelection={multiRowSelection}
                    parentRowExpandable={parentRowExpandable}
                    isParentRowSelected={isParentRowSelected}
                    toggleParentRowSelection={toggleParentRowSelection}
                    toggleParentRow={toggleParentRow}
                    isParentRowOpen={isParentRowOpen}
                    parentColumn={parentColumn}
                />
            </div>
        );
    }

    // Add classname passed by developer from getRowInfo prop to required rows
    let rowClassName = "";
    if (getRowInfo && typeof getRowInfo === "function") {
        const rowInfo = getRowInfo(original);
        if (rowInfo && rowInfo.className) {
            rowClassName = rowInfo.className;
        }
    }

    return (
        <div
            {...row.getRowProps({ style })}
            data-testid="gridrow"
            className={`neo-grid__tr ${
                isParentGrid ? "neo-grid__child" : ""
            } ${rowClassName}`}
        >
            <RowItem
                row={row}
                theme={theme}
                index={index}
                setSize={setSize}
                isRowExpandEnabled={isRowExpandEnabled}
                additionalColumn={additionalColumn}
                isLoadMoreChildRowsRequiredForRow={
                    isLoadMoreChildRowsRequiredForRow
                }
                lastPage={lastPage}
                loadMoreChildData={loadMoreChildData}
                isParentGrid={isParentGrid}
                fixedRowHeight={fixedRowHeight}
                isLoadMoreRequiredForNormalRow={isLoadMoreRequiredForNormalRow}
            />
        </div>
    );
};

ListItem.propTypes = {
    row: PropTypes.object,
    style: PropTypes.object,
    theme: PropTypes.string,
    index: PropTypes.number,
    setSize: PropTypes.func,
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
    fixedRowHeight: PropTypes.bool,
    isLoadMoreRequiredForNormalRow: PropTypes.func
};

export default ListItem;
