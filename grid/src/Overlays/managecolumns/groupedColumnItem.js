import React from "react";
import PropTypes from "prop-types";

const groupedColumnItem = ({
    id,
    Header,
    title,
    display,
    isadditionalcolumn,
    innerCells,
    onInnerCellChange
}) => {
    const isItemToBeDisplayed =
        innerCells && innerCells.length > 0 && display === true;

    return (
        <div className="ng-popover--column__list ng-popover--column__list--group">
            {isItemToBeDisplayed ? (
                <strong className="ng-popover--column__title">
                    {title || Header}
                </strong>
            ) : null}
            {isItemToBeDisplayed
                ? innerCells.map((cell) => {
                      const { cellId } = cell;
                      return (
                          <div
                              className="ng-popover--column__wrap"
                              key={cellId}
                          >
                              <div className="ng-popover--column__check">
                                  <div className="neo-form-check">
                                      <input
                                          type="checkbox"
                                          id={`chk_selectInnerCell_${cellId}`}
                                          className="neo-checkbox form-check-input"
                                          data-testid={`selectInnerCell_${id}_${cellId}`}
                                          data-columnid={id}
                                          data-cellid={cellId}
                                          data-isadditionalcolumn={
                                              isadditionalcolumn
                                          }
                                          checked={cell.display}
                                          onChange={onInnerCellChange}
                                      />
                                      <label
                                          htmlFor={`chk_selectInnerCell_${cellId}`}
                                          className="neo-form-check__label"
                                      >
                                          {cell.Header}
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

groupedColumnItem.propTypes = {
    id: PropTypes.string,
    Header: PropTypes.any,
    title: PropTypes.string,
    display: PropTypes.bool,
    isadditionalcolumn: PropTypes.bool,
    innerCells: PropTypes.arrayOf(PropTypes.object),
    onInnerCellChange: PropTypes.func
};

export default groupedColumnItem;
