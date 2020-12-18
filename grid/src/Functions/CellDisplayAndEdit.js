import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import CellDisplayAndEditTag from "./CellDisplayAndEditTag";
import { CellDisplayAndEditContext } from "../Utilities/TagsContext";
import { IconPencil, IconTick, IconCancel } from "../Utilities/SvgUtilities";

const CellDisplayAndEdit = ({
    row,
    updateRowInGrid,
    expandableColumn,
    isDesktop
}) => {
    const { column, columns } = row;
    if (column && row.row) {
        const { original, isExpanded } = row.row;
        const [isEditOpen, setIsEditOpen] = useState(false);
        const [editedRowValue, setEditedRowValue] = useState(null);

        const { id } = column;

        const closeEdit = () => {
            setIsEditOpen(false);
        };

        const openEdit = () => {
            setIsEditOpen(true);
        };

        const getUpdatedRowValue = (value) => {
            if (value) {
                setEditedRowValue(value);
            }
        };

        const saveEdit = () => {
            if (editedRowValue) {
                updateRowInGrid(original, editedRowValue);
            }
            closeEdit();
        };

        const originalRowValue = { ...original };
        const cellDisplayContent = column.displayCell(
            originalRowValue,
            CellDisplayAndEditTag,
            isDesktop,
            expandableColumn ? isExpanded : null
        );
        const cellEditContent = column.editCell
            ? column.editCell(
                  originalRowValue,
                  CellDisplayAndEditTag,
                  getUpdatedRowValue,
                  isDesktop,
                  expandableColumn ? isExpanded : null
              )
            : null;
        const columnsToPass = columns;
        const columnToPass = column;

        return (
            <CellDisplayAndEditContext.Provider
                value={{ columns: columnsToPass, column: columnToPass }}
            >
                <ClickAwayListener
                    onClickAway={closeEdit}
                    className={`neo-grid__cell-content neo-grid__cell-content--${id}`}
                >
                    {cellEditContent ? (
                        <div
                            className="neo-grid__cell-edit"
                            data-testid="cell-edit-icon"
                            role="presentation"
                            onClick={openEdit}
                        >
                            <i>
                                <IconPencil className="ng-icon" />
                            </i>
                        </div>
                    ) : null}
                    {cellDisplayContent}
                    {isEditOpen ? (
                        <div
                            className="neo-grid__content-edit"
                            data-testid="cell-edit-overlay"
                        >
                            {cellEditContent}
                            <button
                                type="button"
                                aria-label="Cell Edit Save Button"
                                className="neo-btn neo-btn-primary btn btn-secondary"
                                data-testid="cell-edit-save"
                                onClick={saveEdit}
                            >
                                <IconTick className="ng-icon ng-icon--tick" />
                            </button>
                            <button
                                type="button"
                                aria-label="Cell Edit Cancel Button"
                                className="neo-btn neo-btn-default btn btn-secondary"
                                data-testid="cell-edit-cancel"
                                onClick={closeEdit}
                            >
                                <IconCancel className="ng-icon" />
                            </button>
                        </div>
                    ) : null}
                </ClickAwayListener>
            </CellDisplayAndEditContext.Provider>
        );
    }
    return null;
};

CellDisplayAndEdit.propTypes = {
    row: PropTypes.object,
    updateRowInGrid: PropTypes.func,
    expandableColumn: PropTypes.bool,
    isDesktop: PropTypes.bool
};

export default CellDisplayAndEdit;
