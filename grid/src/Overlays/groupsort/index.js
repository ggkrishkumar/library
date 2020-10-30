import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import SortingList from "./sortingList";
import { convertToIndividualColumns } from "../../Utilities/GridUtilities";
import { IconClose } from "../../Utilities/SvgUtilities";

const GroupSort = (props) => {
    const {
        isGroupSortOverLayOpen,
        toggleGroupSortOverLay,
        applyGroupSort,
        gridColumns
    } = props;

    const columns = convertToIndividualColumns(gridColumns);
    const sortingOrders = ["Ascending", "Descending"];
    let defaultSortingOption = [];
    const defaultSortBy = columns.find((col) => col.isSortable);
    if (defaultSortBy && defaultSortBy.accessor) {
        let defaultSortOn = "value";
        if (defaultSortBy.innerCells && defaultSortBy.innerCells.length > 0) {
            const sortableInnerCell = defaultSortBy.innerCells.find(
                (cell) => cell.isSortable
            );
            if (sortableInnerCell && sortableInnerCell.accessor) {
                defaultSortOn = sortableInnerCell.accessor;
            }
        }
        defaultSortingOption = [
            {
                sortBy: defaultSortBy.accessor,
                sortOn: defaultSortOn,
                order: sortingOrders[0]
            }
        ];
    }

    const [sortOptions, setSortOptions] = useState([]);
    const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

    const HTML5toTouch = {
        backends: [
            {
                backend: HTML5Backend
            },
            {
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true,
                transition: TouchTransition
            }
        ]
    };

    const updateSortingOptions = (sortingOptions) => {
        setSortOptions(sortingOptions);
    };

    const addSortingOptions = () => {
        setSortOptions([...sortOptions, ...defaultSortingOption]);
    };

    const clearSortingOptions = () => {
        setSortOptions([]);
        applyGroupSort([]);
    };

    const updateSingleSortingOption = (
        sortIndex,
        sortByValue,
        sortOnValue,
        sortOrder
    ) => {
        const newOptionsList = sortOptions.slice(0);
        const newSortingOption = {
            sortBy: sortByValue,
            sortOn: sortOnValue,
            order: sortOrder
        };
        const updatedSortOptions = newOptionsList.map((option, index) =>
            index === sortIndex ? newSortingOption : option
        );
        updateSortingOptions(updatedSortOptions);
    };

    const copySortOption = (sortIndex) => {
        const newOption = sortOptions.slice(0)[sortIndex];
        setSortOptions(sortOptions.concat(newOption));
    };

    const deleteSortOption = (sortIndex) => {
        setSortOptions(
            sortOptions.filter((option, index) => {
                return index !== sortIndex;
            })
        );
    };

    const applySort = () => {
        let isError = false;
        sortOptions.map((option, index) => {
            const { sortBy, sortOn } = option;
            const optionIndex = index;
            const duplicateSort = sortOptions.find((opt, optIndex) => {
                return (
                    sortBy === opt.sortBy &&
                    sortOn === opt.sortOn &&
                    optionIndex !== optIndex
                );
            });
            if (duplicateSort) {
                isError = true;
            }
            return null; // Added due to lint error expected to return a value in arrow function
        });
        if (!isError) {
            applyGroupSort(sortOptions);
            toggleGroupSortOverLay();
        }
        setIsErrorDisplayed(isError);
    };

    if (isGroupSortOverLayOpen) {
        return (
            <ClickAwayListener
                onClickAway={toggleGroupSortOverLay}
                className="neo-grid-popover"
            >
                <div className="neo-grid-popover__sort">
                    <div className="neo-grid-popover__title">
                        <h2>Sort</h2>
                        <div className="neo-grid-popover__close">
                            <i
                                aria-hidden="true"
                                onClick={toggleGroupSortOverLay}
                            >
                                <IconClose />
                            </i>
                        </div>
                    </div>
                    <div className="neo-grid-popover__content">
                        <DndProvider
                            backend={MultiBackend}
                            options={HTML5toTouch}
                        >
                            <SortingList
                                sortOptions={sortOptions}
                                sortingOrders={sortingOrders}
                                columns={columns}
                                updateSortingOptions={updateSortingOptions}
                                updateSingleSortingOption={
                                    updateSingleSortingOption
                                }
                                copySortOption={copySortOption}
                                deleteSortOption={deleteSortOption}
                            />
                        </DndProvider>
                    </div>
                    <div className="sort-warning">
                        {isErrorDisplayed ? (
                            <span>Duplicate sort options found.</span>
                        ) : null}
                    </div>
                    <div className="sort__new">
                        <div
                            className="sort__section"
                            role="presentation"
                            onClick={addSortingOptions}
                        >
                            <span>+</span>
                            <div className="sort__txt" data-testid="addSort">
                                New Sort
                            </div>
                        </div>
                    </div>
                    <div className="sort__footer">
                        <div className="sort__btns">
                            <button
                                type="button"
                                data-testid="clearSort"
                                className="neo-btn neo-btn-link btn btn-secondary"
                                onClick={clearSortingOptions}
                            >
                                Clear All
                            </button>
                            <button
                                type="button"
                                data-testid="saveSort"
                                className="neo-btn neo-btn-primary btn btn-secondary"
                                onClick={applySort}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
    return null;
};

GroupSort.propTypes = {
    isGroupSortOverLayOpen: PropTypes.bool,
    toggleGroupSortOverLay: PropTypes.func,
    gridColumns: PropTypes.arrayOf(PropTypes.object),
    applyGroupSort: PropTypes.func
};

export default GroupSort;
