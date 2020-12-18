import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";
import { IconDragHorizontal } from "../../Utilities/SvgUtilities";
import GroupedColumnItem from "./groupedColumnItem";

const ColumnItem = ({
    id,
    columnHeader,
    columnTitle,
    moveColumn,
    findColumn,
    isadditionalcolumn,
    isGroupHeader,
    columns,
    innerCells,
    onInnerCellChange
}) => {
    const originalIndex = findColumn(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.COLUMN, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const monitorGetItemValue = monitor.getItem();
            const { id: droppedId } = monitorGetItemValue;
            const newOriginalIndex = monitorGetItemValue.originalIndex;
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveColumn(droppedId, newOriginalIndex);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.COLUMN,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findColumn(id);
                moveColumn(draggedId, overIndex);
            }
        }
    });

    const opacity = isDragging ? 0.1 : 1;

    return (
        <div style={{ opacity }}>
            <div
                className="ng-popover--column__reorder"
                data-testid="column-box"
            >
                <div
                    data-testid="columnItemDnd"
                    ref={(node) => drag(drop(node))}
                    style={{ cursor: "move" }}
                    className="ng-popover--column__drag"
                >
                    <i>
                        <IconDragHorizontal className="ng-icon" />
                    </i>
                </div>
                <span>{columnTitle || columnHeader}</span>
                {isGroupHeader === true && columns && columns.length > 0 ? (
                    columns.map((col) => {
                        const {
                            columnId,
                            Header,
                            title,
                            display,
                            isDisplayInExpandedRegion
                        } = col;
                        return (
                            <GroupedColumnItem
                                key={columnId}
                                id={columnId}
                                Header={Header}
                                title={title}
                                display={display}
                                isadditionalcolumn={isDisplayInExpandedRegion}
                                innerCells={col.innerCells}
                                onInnerCellChange={onInnerCellChange}
                            />
                        );
                    })
                ) : (
                    <div className="ng-popover--column__list">
                        {innerCells && innerCells.length > 0
                            ? innerCells.map((cell) => {
                                  const { cellId, Header, display } = cell;
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
                                                      checked={display}
                                                      onChange={
                                                          onInnerCellChange
                                                      }
                                                  />
                                                  <label
                                                      htmlFor={`chk_selectInnerCell_${cellId}`}
                                                      className="neo-form-check__label"
                                                  >
                                                      {Header}
                                                  </label>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                )}
            </div>
        </div>
    );
};

ColumnItem.propTypes = {
    id: PropTypes.string,
    columnHeader: PropTypes.any,
    columnTitle: PropTypes.string,
    moveColumn: PropTypes.func,
    findColumn: PropTypes.func,
    isadditionalcolumn: PropTypes.bool,
    isGroupHeader: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.object),
    innerCells: PropTypes.arrayOf(PropTypes.object),
    onInnerCellChange: PropTypes.func
};

export default ColumnItem;
