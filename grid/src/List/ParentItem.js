import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { IconExpand, IconCollapse } from "../Utilities/SvgUtilities";

const ParentItem = ({
    row,
    theme,
    index,
    setSize,
    multiRowSelection,
    parentRowExpandable,
    isParentRowSelected,
    toggleParentRowSelection,
    toggleParentRow,
    isParentRowOpen,
    parentColumn
}) => {
    const parentItemRef = useRef();

    useEffect(() => {
        let parentHeight = 50;
        const parentElement = parentItemRef.current;
        if (parentElement) {
            const parentElementHeight = parentElement.getBoundingClientRect()
                .height;
            if (parentElementHeight > parentHeight) {
                parentHeight = parentElementHeight;
            }
        }
        if (theme === "portal") {
            parentHeight += 10;
        }
        parentHeight = Math.ceil(parentHeight);
        setSize(index, parentHeight);
    });

    const { original } = row;
    return (
        <div ref={parentItemRef} className="ng-accordion__container">
            <div className="ng-accordion__block">
                {multiRowSelection !== false ? (
                    <div className="neo-form-check">
                        <input
                            type="checkbox"
                            data-testid="rowSelector-parentRow"
                            className="neo-checkbox form-check-input"
                            checked={isParentRowSelected(row)}
                            onChange={(event) =>
                                toggleParentRowSelection(event, row)
                            }
                        />
                    </div>
                ) : null}
                {parentRowExpandable !== false ? (
                    <i
                        role="presentation"
                        className="ng-accordion__icon"
                        onClick={() => toggleParentRow(row, index)}
                        data-testid="acccordion-expand-collapse"
                    >
                        {isParentRowOpen(row) ? (
                            <IconCollapse />
                        ) : (
                            <IconExpand />
                        )}
                    </i>
                ) : null}
            </div>
            <div
                className="ng-accordion__content"
                data-testid="parentRowContent"
            >
                {parentColumn.displayCell(original)}
            </div>
        </div>
    );
};

ParentItem.propTypes = {
    row: PropTypes.object,
    theme: PropTypes.string,
    index: PropTypes.number,
    setSize: PropTypes.func,
    multiRowSelection: PropTypes.bool,
    parentRowExpandable: PropTypes.bool,
    isParentRowSelected: PropTypes.func,
    toggleParentRowSelection: PropTypes.func,
    toggleParentRow: PropTypes.func,
    isParentRowOpen: PropTypes.func,
    parentColumn: PropTypes.object
};

export default ParentItem;
