import React from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";
import SortItem from "./sortingItem";

const SortingList = (props) => {
    const { updateSortingOptions, sortingOrders, sortOptions, columns } = props;

    const findSort = (sortId) => {
        const sort = sortOptions.filter((c, index) => index === sortId)[0];
        return {
            sort,
            index: sortOptions.indexOf(sort)
        };
    };

    const moveSort = (sortId, atIndex) => {
        const { sort, index } = findSort(sortId);
        updateSortingOptions(
            update(sortOptions, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, sort]
                ]
            })
        );
    };

    const [, drop] = useDrop({ accept: ItemTypes.SORT_ITEM });

    return (
        <React.Fragment key="SortingListFragment">
            <div ref={drop} style={{ display: "flex", flexWrap: "wrap" }}>
                {sortOptions && sortOptions.length > 0 ? (
                    <ul className="ng-popover--sort__items-title">
                        <li className="ng-popover--sort__item-text">Sort By</li>
                        <li className="ng-popover--sort__item-text">Sort On</li>
                        <li className="ng-popover--sort__item-text">Order</li>
                    </ul>
                ) : null}
                {sortOptions.map((sortOption, index) => {
                    return (
                        <SortItem
                            id={index}
                            key={index}
                            sortOption={sortOption}
                            sortingOrders={sortingOrders}
                            columns={columns}
                            moveSort={moveSort}
                            findSort={findSort}
                            updateSingleSortingOption={
                                props.updateSingleSortingOption
                            }
                            copySortOption={props.copySortOption}
                            deleteSortOption={props.deleteSortOption}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

SortingList.propTypes = {
    updateSortingOptions: PropTypes.func,
    sortingOrders: PropTypes.array,
    sortOptions: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.object),
    copySortOption: PropTypes.func,
    deleteSortOption: PropTypes.func,
    updateSingleSortingOption: PropTypes.func
};

export default SortingList;
