import React from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";
import ColumnItem from "./columnItem";

const ColumnsList = (props) => {
    const { onColumnReorder, managedColumns, onInnerCellChange } = props;

    const findColumn = (columnId) => {
        const column = managedColumns.filter(
            (c) => `${c.columnId}` === columnId
        )[0];
        return {
            column,
            index: managedColumns.indexOf(column)
        };
    };

    const moveColumn = (columnId, atIndex) => {
        const { column, index } = findColumn(columnId);
        onColumnReorder(
            update(managedColumns, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, column]
                ]
            })
        );
    };

    const [, drop] = useDrop({ accept: ItemTypes.COLUMN });

    const filteredManagedColumns = managedColumns.filter((column) => {
        return column.display === true;
    });

    return (
        <React.Fragment key="ColumnManageFragment">
            <div ref={drop} style={{ display: "flex", flexWrap: "wrap" }}>
                {filteredManagedColumns.map((column) => {
                    const {
                        columnId,
                        Header,
                        title,
                        isDisplayInExpandedRegion,
                        innerCells,
                        isGroupHeader,
                        columns
                    } = column;
                    return (
                        <ColumnItem
                            key={columnId}
                            id={columnId}
                            moveColumn={moveColumn}
                            findColumn={findColumn}
                            columnHeader={Header}
                            columnTitle={title}
                            isadditionalcolumn={isDisplayInExpandedRegion}
                            isGroupHeader={isGroupHeader}
                            columns={columns}
                            innerCells={innerCells}
                            onInnerCellChange={onInnerCellChange}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

ColumnsList.propTypes = {
    onColumnReorder: PropTypes.func,
    managedColumns: PropTypes.arrayOf(PropTypes.object),
    onInnerCellChange: PropTypes.func
};

export default ColumnsList;
