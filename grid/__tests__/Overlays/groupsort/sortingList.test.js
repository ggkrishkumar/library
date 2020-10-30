/* eslint-disable no-undef */
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
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

const sortItems = [
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

const sortProps = {
    sortArray: [...sortItems]
};

const updateSortingOptions = jest.fn();

describe("test cases for sorting list", () => {
    it("check the Sort item not null", () => {
        render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <SortingList
                    sortOptions={sortProps.sortArray}
                    sortingOrders={sortingOrders}
                    columns={columns}
                />
            </DndProvider>
        );
        expect("listitem").toBe("listitem");
        expect(screen.getAllByRole("listitem"));
    });

    it("Renders component correctly", () => {
        const onMoveSort = jest.fn();
        const onFindSort = jest.fn();
        const updateSingleSortingOptionFn = jest.fn();
        const copySortOptionFn = jest.fn();
        const deleteSortOptionFn = jest.fn();
        const item = [];
        sortItems.forEach((a) =>
            item.push({
                ...a,
                moveSort: onMoveSort,
                findSort: onFindSort,
                updateSingleSortingOption: updateSingleSortingOptionFn,
                copySortOption: copySortOptionFn,
                deleteSortOption: deleteSortOptionFn
            })
        );
        sortProps.sortArray = item;
        const { getByText } = render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <SortingList
                    sortOptions={sortItems}
                    sortingOrders={sortingOrders}
                    columns={columns}
                />
            </DndProvider>
        );
        expect(getByText("Date1")).toBeInTheDocument();
    });

    it("should work drag and drop functionality", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <SortingList
                    sortOptions={sortItems}
                    sortingOrders={sortingOrders}
                    columns={columns}
                    updateSortingOptions={updateSortingOptions}
                />
            </DndProvider>
        );
        expect(getAllByTestId("sortItem")).toHaveLength(2);
        const startingNode = getAllByTestId("sortItem")[0];
        const endingNode = getAllByTestId("sortItem")[1];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        endingNode.dispatchEvent(
            createBubbledEvent("drop", { clientX: 0, clientY: 1 })
        );
    });
});
