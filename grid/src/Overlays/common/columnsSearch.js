import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import { convertToIndividualColumns } from "../../Utilities/GridUtilities";

const ColumnSearch = ({
    columns,
    additionalColumn,
    managedColumns,
    managedAdditionalColumn,
    updateColumns
}) => {
    const gridColumns = convertToIndividualColumns(columns);

    // Returns a single array that contains main columns as well as the expanded columns
    const getAllColumns = (columnsList, additionalColumnItem) => {
        let allCoulmns = [];
        if (columnsList && columnsList.length > 0) {
            allCoulmns = [...columnsList];
        }
        if (
            additionalColumnItem &&
            Object.keys(additionalColumnItem).length > 0 &&
            additionalColumnItem.innerCells &&
            additionalColumnItem.innerCells.length > 0
        ) {
            allCoulmns.push(additionalColumnItem);
        }
        return allCoulmns;
    };

    const [searchableColumns, setSearchableColumns] = useState([]);

    // Update searched columns state based on the searched value
    const onColumnSearch = (event) => {
        let { value } = event.target;
        value = value ? value.toLowerCase() : "";
        const allColumns = getAllColumns(gridColumns, additionalColumn);
        if (value !== "") {
            setSearchableColumns(
                allColumns.filter((column) => {
                    if (column.title) {
                        return column.title.toLowerCase().includes(value);
                    }
                    return column.Header.toLowerCase().includes(value);
                })
            );
        } else {
            setSearchableColumns(allColumns);
        }
    };

    // Check if the display value of column or all columns in managedColumns state is true/false
    const isSearchableColumnSelected = (columnId) => {
        const allManagedColumns = getAllColumns(
            convertToIndividualColumns(managedColumns),
            managedAdditionalColumn
        );
        const filteredAllManagedColumns = allManagedColumns.filter((column) => {
            return column.display === true;
        });
        if (columnId === "all") {
            const allColumns = getAllColumns(gridColumns, additionalColumn);
            return filteredAllManagedColumns.length === allColumns.length;
        }
        const selectedColumn = filteredAllManagedColumns.find((column) => {
            return column.columnId === columnId;
        });
        return selectedColumn !== null && selectedColumn !== undefined;
    };

    // update the display flag value of column or all columns in managedColumns state, based on the selection
    const onSearchableColumnChange = (event) => {
        const { checked, dataset } = event.currentTarget;
        if (dataset) {
            const { columnid, isadditionalcolumn } = dataset;
            updateColumns(columnid, isadditionalcolumn, checked);
        }
    };

    useEffect(() => {
        setSearchableColumns(
            update(searchableColumns, {
                $set: getAllColumns(gridColumns, additionalColumn)
            })
        );
    }, []);

    const isSearchableColumnsAvailable =
        searchableColumns && searchableColumns.length > 0;

    return (
        <div className="ng-chooser-body">
            <input
                type="text"
                placeholder="Search column"
                className="ng-chooser-body__txt"
                data-testid="filterColumnsList"
                onChange={onColumnSearch}
            />
            {isSearchableColumnsAvailable ? (
                <div className="ng-chooser-body__selectall">
                    <div className="ng-chooser-body__checkbox">
                        <div className="neo-form-check">
                            <input
                                type="checkbox"
                                id="chk_selectAllSearchableColumns"
                                className="neo-checkbox form-check-input"
                                data-testid="selectAllSearchableColumns"
                                data-columnid="all"
                                checked={isSearchableColumnSelected("all")}
                                onChange={onSearchableColumnChange}
                            />
                            <label
                                htmlFor="chk_selectAllSearchableColumns"
                                className="neo-form-check__label"
                            >
                                Select All
                            </label>
                        </div>
                    </div>
                </div>
            ) : null}
            {isSearchableColumnsAvailable
                ? searchableColumns.map((column) => {
                      const {
                          columnId,
                          Header,
                          title,
                          isDisplayInExpandedRegion
                      } = column;
                      return (
                          <div className="ng-chooser-body__wrap" key={columnId}>
                              <div className="ng-chooser-body__checkwrap">
                                  <div className="neo-form-check">
                                      <input
                                          type="checkbox"
                                          id={`chk_selectSearchableColumn_${columnId}`}
                                          className="neo-checkbox form-check-input"
                                          data-testid="selectSingleSearchableColumn"
                                          data-columnid={columnId}
                                          data-isadditionalcolumn={
                                              isDisplayInExpandedRegion
                                          }
                                          checked={isSearchableColumnSelected(
                                              columnId
                                          )}
                                          onChange={onSearchableColumnChange}
                                      />
                                      <label
                                          htmlFor={`chk_selectSearchableColumn_${columnId}`}
                                          className="neo-form-check__label"
                                      >
                                          {title || Header}
                                      </label>
                                  </div>
                              </div>
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

ColumnSearch.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    additionalColumn: PropTypes.object,
    managedColumns: PropTypes.arrayOf(PropTypes.object),
    managedAdditionalColumn: PropTypes.object,
    updateColumns: PropTypes.func
};

export default ColumnSearch;
