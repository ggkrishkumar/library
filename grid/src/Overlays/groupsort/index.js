import React, { useState, useEffect } from "react";
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
        toggleGroupSortOverLay,
        applyGroupSort,
        groupSortOptions,
        gridColumns
    } = props;

    const columns = convertToIndividualColumns(gridColumns);
    if (columns && columns.length > 0) {
        const sortingOrders = ["Ascending", "Descending"];
        let defaultSortingOption = [];
        const defaultSortBy = columns.find((col) => col.isSortable);
        if (defaultSortBy && defaultSortBy.accessor) {
            let defaultSortOn = "value";
            if (
                defaultSortBy.innerCells &&
                defaultSortBy.innerCells.length > 0
            ) {
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
        const [isLoaded, setIsLoaded] = useState(false);

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

        useEffect(() => {
            setSortOptions([...groupSortOptions]);
            setIsLoaded(true);
        }, []);

        if (isLoaded) {
            return (
                <ClickAwayListener
                    onClickAway={toggleGroupSortOverLay}
                    className="ng-popover ng-popover--sort"
                >
                    <div className="ng-popover__header">
                        <strong>Sort</strong>
                        <div className="ng-popover__close">
                            <i
                                aria-hidden="true"
                                onClick={toggleGroupSortOverLay}
                            >
                                <IconClose />
                            </i>
                        </div>
                    </div>
                    <div className="ng-popover__content">
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
                    <div className="ng-popover--sort__warning">
                        {isErrorDisplayed ? (
                            <span>Duplicate sort options found.</span>
                        ) : null}
                    </div>
                    <div className="ng-popover--sort__new">
                        <div
                            className="ng-popover--sort__section"
                            role="presentation"
                            onClick={addSortingOptions}
                        >
                            <span className="ng-popover--sort__icon-plus">
                                +
                            </span>
                            <div
                                className="ng-popover__txt"
                                data-testid="addSort"
                            >
                                New Sort
                            </div>
                        </div>
                    </div>
                    <div className="ng-popover--sort__footer">
                        <div className="ng-popover__btns">
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
                </ClickAwayListener>
            );
        }
    }
    return null;
};

GroupSort.propTypes = {
    toggleGroupSortOverLay: PropTypes.func,
    groupSortOptions: PropTypes.arrayOf(PropTypes.object),
    gridColumns: PropTypes.arrayOf(PropTypes.object),
    applyGroupSort: PropTypes.func
};

export default GroupSort;
