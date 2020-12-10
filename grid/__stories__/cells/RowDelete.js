import React from "react";
import ClickAwayListener from "react-click-away-listener";

const RowDelete = ({ rowData, onRowDelete, unbindRowDeleteOverlay }) => {
    const deleteRow = () => {
        onRowDelete(rowData);
        unbindRowDeleteOverlay();
    };
    const closeRowDeleteOverlay = () => {
        unbindRowDeleteOverlay();
    };
    return (
        <ClickAwayListener
            className="row-option-action-overlay delete"
            data-testid="rowEditOverlay-container"
            onClickAway={closeRowDeleteOverlay}
        >
            <div className="btn-wrap">
                <button
                    type="button"
                    className="neo-btn neo-btn-primary btn btn-secondary"
                    data-testid="rowDeleteOverlay-Delete"
                    onClick={deleteRow}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="neo-btn neo-btn-default btn btn-secondary"
                    data-testid="rowDeleteOverlay-cancel"
                    onClick={closeRowDeleteOverlay}
                >
                    Cancel
                </button>
            </div>
        </ClickAwayListener>
    );
};

export default RowDelete;
