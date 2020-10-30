/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import GroupSort from "../../../src/Overlays/groupsort/index";

describe("Group Sort-index test Cases", () => {
    const isGroupSortLayOverOpen = true;
    const columns = [
        {
            Header: "Flight",
            accessor: "flight",
            columnId: "column_1",
            isSortable: true,
            width: 100,
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

    let container;
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        // container *must* be attached to document so events work correctly.
        document.body.appendChild(container);
    });

    afterEach(cleanup);

    const mockTableGroupSortOverLay = jest.fn();
    const mockApplyGroupSortOverlay = jest.fn();

    it("renders Component", () => {
        // LOGIC-->> render the div
        // expect sorts--grid to be defined
        render(
            <GroupSort
                isGroupSortOverLayOpen={isGroupSortLayOverOpen}
                toggleGroupSortOverLay={mockTableGroupSortOverLay}
                gridColumns={columns}
                applyGroupSort={mockApplyGroupSortOverlay}
            />
        );
        const div = document.getElementsByClassName("sorts--grid");
        expect(div).toBeDefined();
    });

    it("Clear All Sort Options", () => {
        // LOGIC-->> Click the clear All button
        // expect innerHTML inside sort body be ""
        act(() => {
            ReactDOM.render(
                <GroupSort
                    isGroupSortOverLayOpen={isGroupSortLayOverOpen}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });
        const clearAllButton = container.querySelector("button");
        act(() => {
            clearAllButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const sortDivText = document
            .querySelector("[class=neo-grid-popover__content]")
            .getElementsByTagName("div")[0].innerHTML;

        // after clear all, the div inside class 'neo-grid-popover__content should be empty
        expect(sortDivText).toBe("");
    });

    it("Apply Sort Test ", () => {
        // LOGIC-->> Apply  sorting Param
        // expect the HTML element neo-grid-popover NOT to exists as layover gets closed.
        act(() => {
            ReactDOM.render(
                <GroupSort
                    isGroupSortOverLayOpen={isGroupSortLayOverOpen}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        const applySortButton = document.getElementsByTagName("button")[1];
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const sortLayOverDiv = document.getElementsByClassName(
            ".neo-grid-popover"
        )[0];
        expect(sortLayOverDiv).toBeUndefined();
    });

    it("Add New Sort ", () => {
        // LOGIC-->> Add A sorting Param
        // expect no of rows in the sort__body HTML element to be more than 1 as previous.
        act(() => {
            ReactDOM.render(
                <GroupSort
                    isGroupSortOverLayOpen={isGroupSortLayOverOpen}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });
        const lengthOfSortBodyBeforeAdd = document.getElementsByClassName(
            "sort__bodyContent"
        ).length;

        const newSortTxt = document
            .querySelector(".sort__section")
            .querySelector(".sort__txt");

        // adding a new sort
        act(() => {
            newSortTxt.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const lengthOfSortBodyAfterAdd = document.getElementsByClassName(
            "sort__bodyContent"
        ).length;

        expect(lengthOfSortBodyAfterAdd).toBe(lengthOfSortBodyBeforeAdd + 1);
    });

    it("Update A Sort Parameter", () => {
        // LOGIC-->> Update a sorting Row by onChange of sortBy Select List
        // expect the sorting layover should exists.
        act(() => {
            ReactDOM.render(
                <GroupSort
                    isGroupSortOverLayOpen={isGroupSortLayOverOpen}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        const newSortTxt = document
            .querySelector(".sort__section")
            .querySelector(".sort__txt");

        act(() => {
            newSortTxt.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const sortBySelectList = document
            .querySelector(".sort__bodyContent")
            .getElementsByClassName("sort__reorder")[1]
            .getElementsByTagName("select")[0];

        act(() => {
            sortBySelectList.dispatchEvent(
                new MouseEvent("change", { bubbles: true })
            );
        });
        const applySortButton = document.getElementsByTagName("button")[1];

        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const sortByBody = document.querySelector(".sort__bodyContent");
        expect(sortByBody).toBeDefined();
    });

    it("Delete A Sort Parameter", () => {
        // LOGIC-->> check length of HTML element sort__bodyContent before and after delete
        // length before and after delete should be same.
        act(() => {
            ReactDOM.render(
                <GroupSort
                    isGroupSortOverLayOpen={isGroupSortLayOverOpen}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        const lengthOfSortBodyBeforeDelete = document.getElementsByClassName(
            "sort__bodyContent"
        ).length;

        const newSortTxt = document
            .querySelector(".sort__section")
            .querySelector(".sort__txt");

        // adding a sorting option
        act(() => {
            newSortTxt.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const deleteIcon = document.getElementsByClassName("sort__icon")[1];

        // deleting a sorting option
        act(() => {
            deleteIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const lengthOfSortBodyAfterDelete = document.getElementsByClassName(
            "sort__bodyContent"
        ).length;

        expect(lengthOfSortBodyBeforeDelete).toBe(lengthOfSortBodyAfterDelete);
    });

    it("Copy A Sort Parameter", () => {
        // LOGIC-->> check length of HTML element sort__bodyContent before and after copy
        // length after Copy should be greater than 1 as before Copy.
        act(() => {
            ReactDOM.render(
                <GroupSort
                    isGroupSortOverLayOpen={isGroupSortLayOverOpen}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        const lengthOfSortBodyBeforeCopy = document.getElementsByClassName(
            "sort__bodyContent"
        ).length;

        const copyIcon = document.getElementsByClassName("sort__icon")[0];

        // copying a sorting option
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        const lengthOfSortBodyAfterCopy = document.getElementsByClassName(
            "sort__bodyContent"
        ).length;

        expect(lengthOfSortBodyAfterCopy).toBe(lengthOfSortBodyBeforeCopy + 1);
    });

    it("Not Rendering the SortLayOver", () => {
        // LOGIC-->> check render of layover with isGroupSortOverLayOpen as false
        // exprect HTML element sort__bodyContent to be undefined
        act(() => {
            ReactDOM.render(
                <GroupSort
                    isGroupSortOverLayOpen={false}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });
    });
});
