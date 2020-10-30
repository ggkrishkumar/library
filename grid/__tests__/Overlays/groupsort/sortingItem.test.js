/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import { act } from "react-dom/test-utils";
import SortItem from "../../../src/Overlays/groupsort/sortingItem";
import "@testing-library/jest-dom/extend-expect";
import SortingList from "../../../src/Overlays/groupsort/sortingList";

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

const columns = [
    {
        Header: "Flight",
        accessor: "flight",
        columnId: "column_1",
        width: 100,
        isSortable: true,
        innerCells: [
            {
                Header: "Flight No",
                accessor: "flightno",
                cellId: "column_1_cell_0",
                display: true,
                isSortable: true,
                isSearchable: true
            },
            {
                Header: "Date",
                accessor: "date",
                cellId: "column_1_cell_1",
                display: true,
                isSortable: true,
                isSearchable: true
            }
        ],
        sortValue: "flightno",
        display: true,
        isSearchable: true
    },
    {
        Header: "Flight1",
        accessor: "flight1",
        columnId: "column_2",
        width: 100,
        isSortable: true,
        innerCells: [
            {
                Header: "Flight No1",
                accessor: "flightno1",
                cellId: "column_2_cell_0",
                display: true,
                isSortable: true,
                isSearchable: true
            },
            {
                Header: "Date1",
                accessor: "date1",
                cellId: "column_2_cell_1",
                display: true,
                isSortable: true,
                isSearchable: true
            }
        ],
        sortValue: "flightno1",
        display: true,
        isSearchable: true
    }
];

const sortingOrders = ["Ascending", "Descending"];

const sortOptions = [
    {
        order: "Ascending",
        sortBy: "flight1",
        sortOn: "date1"
    },
    {
        order: "Ascending",
        sortBy: "flight",
        sortOn: "flightno"
    }
];

const singleSortOption = {
    order: "Ascending",
    sortBy: "flight1",
    sortOn: "date1"
};

const updateSortingOptions = jest.fn();
const updateSingleSortingOption = jest.fn();
const copySortOption = jest.fn();
const deleteSortOption = jest.fn();
const moveSortMock = jest.fn();
const findSortMock = jest.fn(() => {
    return { index: 0 };
});

describe("testing sort item ", () => {
    let component;
    beforeEach(() => {
        component = document.createElement("div");
        document.body.appendChild(component);
    });
    afterEach(cleanup);
    it("should renders component with drag and drop", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId, container } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <SortingList
                    sortOptions={sortOptions}
                    sortingOrders={sortingOrders}
                    columns={columns}
                    updateSortingOptions={updateSortingOptions}
                />
            </DndProvider>
        );
        const childComponent = container.querySelector("div");
        expect(childComponent).toBeInTheDocument();
        const startingNode = getAllByTestId("sortItem")[0];
        const endingNode = getAllByTestId("sortItem")[1];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        endingNode.dispatchEvent(
            createBubbledEvent("drop", { clientX: 0, clientY: 1 })
        );
        fireEvent.dragEnd(startingNode);
    });
    it("should renders component with didDrop false", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId, container } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <SortingList
                    sortOptions={sortOptions}
                    sortingOrders={sortingOrders}
                    columns={columns}
                    updateSortingOptions={updateSortingOptions}
                />
            </DndProvider>
        );
        const childComponent = container.querySelector("div");
        expect(childComponent).toBeInTheDocument();
        const startingNode = getAllByTestId("sortItem")[0];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        fireEvent.dragEnd(startingNode);
    });
    it("should renders child component", () => {
        const { container } = render(
            <DndProvider
                backend={MultiBackend}
                options={HTML5toTouch}
                sortOptions={sortOptions}
                columns={columns}
                updateSortingOptions={updateSortingOptions}
                updateSingleSortingOption={updateSingleSortingOption}
                copySortOption={copySortOption}
                deleteSortOption={deleteSortOption}
            >
                <SortItem
                    id={0}
                    columns={columns}
                    sortOption={singleSortOption}
                    sortingOrders={sortingOrders}
                    moveSort={moveSortMock}
                    findSort={findSortMock}
                    updateSingleSortingOption={updateSingleSortingOption}
                    copySortOption={copySortOption}
                    deleteSortOption={deleteSortOption}
                />
            </DndProvider>,
            component
        );
        const childComponent = container.querySelector("div");
        expect(childComponent).toBeInTheDocument();
        fireEvent.dragStart(childComponent);
    });
    it("should renders after changing dropdown values", () => {
        const { getByText } = render(
            <DndProvider
                backend={MultiBackend}
                options={HTML5toTouch}
                sortOptions={sortOptions}
                columns={columns}
                updateSortingOptions={updateSortingOptions}
                updateSingleSortingOption={updateSingleSortingOption}
                copySortOption={copySortOption}
                deleteSortOption={deleteSortOption}
            >
                <SortItem
                    id={0}
                    columns={columns}
                    sortOption={singleSortOption}
                    sortingOrders={sortingOrders}
                    moveSort={moveSortMock}
                    findSort={findSortMock}
                    updateSingleSortingOption={updateSingleSortingOption}
                    copySortOption={copySortOption}
                    deleteSortOption={deleteSortOption}
                />
            </DndProvider>
        );
        // Change Sort By
        const sortBySelectList = document
            .querySelector(".sort__bodyContent")
            .getElementsByClassName("sort__reorder")[1]
            .getElementsByTagName("select")[0];

        act(() => {
            sortBySelectList.dispatchEvent(
                new MouseEvent("change", { bubbles: true })
            );
        });
        expect(getByText("Flight1")).toBeInTheDocument();
        // Change Sort On
        const sortOnSelectList = document
            .querySelector(".sort__bodyContent")
            .getElementsByClassName("sort__reorder")[2]
            .getElementsByTagName("select")[0];

        act(() => {
            sortOnSelectList.dispatchEvent(
                new MouseEvent("change", { bubbles: true })
            );
        });
        expect(getByText("Date1")).toBeInTheDocument();
        // Change Sort Order
        const sortOrderSelectList = document
            .querySelector(".sort__bodyContent")
            .getElementsByClassName("sort__reorder")[3]
            .getElementsByTagName("select")[0];

        act(() => {
            sortOrderSelectList.dispatchEvent(
                new MouseEvent("change", { bubbles: true })
            );
        });
        expect(getByText("Descending")).toBeInTheDocument();
    });
    it("should renders after copying and deleting sort options", () => {
        render(
            <DndProvider
                backend={MultiBackend}
                options={HTML5toTouch}
                sortOptions={sortOptions}
                columns={columns}
                updateSortingOptions={updateSortingOptions}
                updateSingleSortingOption={updateSingleSortingOption}
                copySortOption={copySortOption}
                deleteSortOption={deleteSortOption}
            >
                <SortItem
                    id={0}
                    columns={columns}
                    sortOption={singleSortOption}
                    sortingOrders={sortingOrders}
                    moveSort={moveSortMock}
                    findSort={findSortMock}
                    updateSingleSortingOption={updateSingleSortingOption}
                    copySortOption={copySortOption}
                    deleteSortOption={deleteSortOption}
                />
            </DndProvider>
        );
        // Copy sort
        const copyIcon = document.getElementsByClassName("sort__icon")[0];
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(copySortOption).toHaveBeenCalledTimes(1);
        // Delete sort
        const deleteIcon = document.getElementsByClassName("sort__icon")[1];
        act(() => {
            deleteIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(deleteSortOption).toHaveBeenCalledTimes(1);
    });
});
