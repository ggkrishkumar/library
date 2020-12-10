import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const RowItem = ({
    row,
    theme,
    index,
    setSize,
    isRowExpandEnabled,
    additionalColumn,
    isLoadMoreChildRowsRequiredForRow,
    lastPage,
    loadMoreChildData
}) => {
    const rowItemRef = useRef();

    useEffect(() => {
        let rowHeight = 50;
        const rowElement = rowItemRef.current;
        if (rowElement) {
            const rowWrap = rowElement.querySelector(
                "[data-testid='gridrowWrap']"
            );
            if (rowWrap) {
                const expandRegion = rowElement.querySelector(
                    "[data-testid='rowExpandedRegion']"
                );
                rowHeight = rowWrap.getBoundingClientRect().height;
                if (expandRegion) {
                    rowHeight += expandRegion.getBoundingClientRect().height;
                }
                const loadMoreChild = rowElement.querySelector(
                    "[data-testid='loadMoreChild']"
                );
                if (loadMoreChild) {
                    rowHeight += loadMoreChild.getBoundingClientRect().height;
                }
            }
        }
        if (theme === "portal") {
            rowHeight += 10;
        }
        rowHeight = Math.ceil(rowHeight);
        setSize(index, rowHeight);
    });

    return (
        <div className="neo-grid__row-container" ref={rowItemRef}>
            <div
                data-testid="gridrowWrap"
                className={`neo-grid__row-wrap ${
                    isRowExpandEnabled && row.isExpanded
                        ? "neo-grid__row-wrap--expand"
                        : ""
                }`}
            >
                {row.cells.map((cell) => {
                    if (cell.column.display === true) {
                        return (
                            <div
                                {...cell.getCellProps()}
                                className="neo-grid__td"
                                data-testid="gridrowcell"
                            >
                                {cell.render("Cell")}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            {/* Check if row eapand icon is clicked, and if yes, call function to bind content to the expanded region */}
            {isRowExpandEnabled && row.isExpanded ? (
                <div
                    className="neo-grid__row-expand"
                    data-testid="rowExpandedRegion"
                >
                    {additionalColumn.Cell(row, additionalColumn)}
                </div>
            ) : null}
            {isLoadMoreChildRowsRequiredForRow(index, lastPage) ? (
                <div className="ng-loadmore" data-testid="loadMoreChild">
                    <button
                        type="button"
                        className="neo-btn neo-btn-default btn btn-secondary"
                        data-testid="load-more-childdata"
                        onClick={() => loadMoreChildData(row)}
                    >
                        Load more....
                    </button>
                </div>
            ) : null}
        </div>
    );
};

RowItem.propTypes = {
    row: PropTypes.object,
    theme: PropTypes.string,
    index: PropTypes.number,
    setSize: PropTypes.func,
    isRowExpandEnabled: PropTypes.bool,
    additionalColumn: PropTypes.object,
    isLoadMoreChildRowsRequiredForRow: PropTypes.func,
    lastPage: PropTypes.bool,
    loadMoreChildData: PropTypes.func
};

export default RowItem;
