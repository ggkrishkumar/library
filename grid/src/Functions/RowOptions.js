import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import { IconCancel } from "../Utilities/SvgUtilities";

const RowOptions = ({ row, rowActions }) => {
    const { original } = row;

    const [isRowOptionsOpen, setRowOptionsOpen] = useState(false);

    const openRowOptionsOverlay = () => {
        setRowOptionsOpen(true);
    };

    const closeRowOptionsOverlay = () => {
        setRowOptionsOpen(false);
    };

    const rowActionsOverlayContent = rowActions(
        original,
        closeRowOptionsOverlay
    );

    return (
        <div className="ng-action__utils">
            <span
                className="ng-action__utils-block"
                data-testid="rowActions-open-link"
                role="presentation"
                onClick={openRowOptionsOverlay}
            >
                <i className="ng-action__kebab" />
                <i className="ng-action__kebab" />
                <i className="ng-action__kebab" />
            </span>
            {isRowOptionsOpen ? (
                <ClickAwayListener
                    onClickAway={closeRowOptionsOverlay}
                    className="ng-action__popover"
                    data-testid="rowActions-kebab-overlay"
                >
                    {rowActionsOverlayContent}
                    <span
                        role="presentation"
                        className="ng-action__close"
                        data-testid="close-rowActions-kebab-overlay"
                        onClick={closeRowOptionsOverlay}
                    >
                        <i>
                            <IconCancel />
                        </i>
                    </span>
                </ClickAwayListener>
            ) : null}
        </div>
    );
};
RowOptions.propTypes = {
    row: PropTypes.object,
    rowActions: PropTypes.any
};

export default RowOptions;
