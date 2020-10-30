import React from "react";
import PropTypes from "prop-types";

const groupedColumnItem = ({
    id,
    Header,
    display,
    isadditionalcolumn,
    innerCells,
    onInnerCellChange
}) => {
    const isItemToBeDisplayed =
        innerCells && innerCells.length > 0 && display === true;

    return (
        <div className="column__innerCells__wrap grouped__columns__wrap">
            {isItemToBeDisplayed ? <strong>{Header}</strong> : null}
            {isItemToBeDisplayed
                ? innerCells.map((cell) => {
                      const { cellId } = cell;
                      return (
                          <div className="column__wrap" key={cellId}>
                              <div className="column__checkbox">
                                  <div className="form-check">
                                      <input
                                          type="checkbox"
                                          id={`chk_selectInnerCell_${cellId}`}
                                          className="form-check-input custom-checkbox form-check-input"
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
                                          className="form-check-label"
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
    Header: PropTypes.string,
    display: PropTypes.bool,
    isadditionalcolumn: PropTypes.bool,
    innerCells: PropTypes.arrayOf(PropTypes.object),
    onInnerCellChange: PropTypes.func
};

export default groupedColumnItem;
