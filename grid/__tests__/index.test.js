/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import Grid from "../src/index";

describe("render Index file ", () => {
    function mockOffsetSize(width, height) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
            configurable: true,
            value: height
        });
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
            configurable: true,
            value: height - 100
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            value: width
        });
    }

    const mockDisplayCell = jest.fn(() => {
        return (
            <div className="flight-details">
                <strong>XX2225</strong>
                <span>31-Aug-2016</span>
            </div>
        );
    });

    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            isSortable: true,
            disableFilters: true
        },
        {
            Header: "Flight",
            accessor: "flight",
            width: 100,
            isSortable: true,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    isSortable: true,
                    isSearchable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    isSortable: true,
                    isSearchable: true
                }
            ],
            isSearchable: true,
            sortValue: "flightno",
            Cell: mockDisplayCell
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            isSortable: true,
            isSearchable: true
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            isSortable: true,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position",
                    isSortable: true,
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    isSortable: true,
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            displayCell: (rowData, DisplayTag) => {
                const { uldPositions } = rowData;
                return (
                    <div className="uld-details">
                        <ul>
                            {uldPositions.map((positions, index) => {
                                return (
                                    <li key={index}>
                                        <DisplayTag
                                            columnKey="uldPositions"
                                            cellKey="position"
                                        >
                                            <span>{positions.position}</span>
                                        </DisplayTag>
                                        <DisplayTag
                                            columnKey="uldPositions"
                                            cellKey="value"
                                        >
                                            <strong>{positions.value}</strong>
                                        </DisplayTag>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            },
            columnId: "column_3",
            isSearchable: true
        }
    ];

    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks"
            }
        ],
        displayCell: (rowData, DisplayTag) => {
            const { remarks } = rowData;
            return (
                <div className="details-wrap">
                    <DisplayTag columnKey="remarks" cellKey="remarks">
                        <ul>
                            <li>{remarks}</li>
                        </ul>
                    </DisplayTag>
                </div>
            );
        }
    };

    const mockAdditionalColumnWithoutInnerCells = {
        Header: "Remarks",
        displayCell: (rowData, DisplayTag) => {
            const { remarks } = rowData;
            return (
                <div className="details-wrap">
                    <DisplayTag columnKey="remarks" cellKey="remarks">
                        <ul>
                            <li>{remarks}</li>
                        </ul>
                    </DisplayTag>
                </div>
            );
        }
    };

    const data = [
        {
            travelId: 10,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            segment: {
                from: "BCC",
                to: "ZZY"
            },
            details: {
                flightModel: 6518,
                bodyType: "Big Body",
                type: "Van",
                startTime: "01:23 (S)",
                endTime: "11:29 (E)",
                status: "To Be Cancelled",
                additionalStatus:
                    "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
                timeStatus: "10:02 hrs to depart"
            },
            weight: {
                percentage: "16%",
                value: "35490/20000 kg"
            },
            volume: {
                percentage: "54%",
                value: "31/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "7/9"
                },
                {
                    position: "Q1",
                    value: "9/3"
                },
                {
                    position: "L6",
                    value: "8/4"
                },
                {
                    position: "Q7",
                    value: "4/9"
                }
            ],
            revenue: {
                revenue: "$63,474.27",
                yeild: "$7.90"
            },
            sr: "74/ AWBs",
            queuedBooking: {
                sr: "88/ AWBs",
                volume: "7437 kg / 31 cbm"
            },
            remarks: "Enim aute magna."
        }
    ];

    const pageInfo = {
        pageNum: 1,
        pageSize: 300,
        total: 20000,
        lastPage: true
    };

    const smallData = [...data];
    const smallPageInfo = {
        pageNum: 1,
        pageSize: 1,
        total: 20000,
        lastPage: false
    };

    for (let i = 0; i < 50; i++) {
        data.push({
            travelId: i,
            flight: {
                flightno: "XX6983",
                date: "23-May-2016"
            },
            segment: {
                from: "AAB",
                to: "XXY"
            },
            details: {
                flightModel: 6593,
                bodyType: "Narrow Body",
                type: "Car",
                startTime: "07:48 (A)",
                endTime: "05:36 (E)",
                status: "Active",
                additionalStatus:
                    "Elit est dolore nostrud Lorem labore et elit voluptate elit commodo cupidatat. Sint quis dolor laboris sit ipsum aliquip.velit cupidatat tempor laborum cupidatat",
                timeStatus: "09:20 hrs to depart"
            },
            weight: {
                percentage: "76%",
                value: "40966/20000 kg"
            },
            volume: {
                percentage: "94%",
                value: "11/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "6/2"
                },
                {
                    position: "Q2",
                    value: "5/1"
                },
                {
                    position: "L6",
                    value: "6/4"
                },
                {
                    position: "Q5",
                    value: "3/7"
                }
            ],
            revenue: {
                revenue: "$77,213.84",
                yeild: "$4.36"
            },
            sr: "84/ AWBs",
            queuedBooking: {
                sr: "36/ AWBs",
                volume: "7692 kg / 78 cbm"
            },
            remarks: "Labore irure."
        });
    }

    const mockGetRowEditOverlay = jest.fn(
        (rowData, DisplayTag, rowUpdateCallBack) => {
            const { flight } = rowData;
            const updateRowValue = () => {
                flight.flightno = "007";
                rowUpdateCallBack(rowData);
            };
            return (
                <div className="row-edit">
                    <div className="edit-flight">
                        <DisplayTag columnKey="flight" cellKey="flightno">
                            <div className="edit-flight-no">
                                <input
                                    type="text"
                                    value={flight.flightno}
                                    onChange={updateRowValue}
                                />
                            </div>
                        </DisplayTag>
                        <DisplayTag columnKey="flight" cellKey="date">
                            <div className="edit-flight-date">
                                <input
                                    type="date"
                                    value={flight.date}
                                    onChange={updateRowValue}
                                />
                            </div>
                        </DisplayTag>
                    </div>
                </div>
            );
        }
    );

    const mockRowActions = [
        { label: "edit" },
        { label: "delete" },
        { label: "Send SCR", value: "SCR" },
        { label: "Segment Summary", value: "SegmentSummary" },
        { label: "Open Summary", value: "OpenSummary" },
        { label: "Close Summary", value: "CloseSummary" }
    ];

    const getRowInfo = (rowData) => {
        const { travelId } = rowData;
        return {
            isRowExpandable: travelId % 2 === 0,
            className: travelId % 10 === 0 ? "disabled" : ""
        };
    };

    const mockGridHeight = "80vh";
    const mockGridWidth = "100%";
    const mockTitle = "AWBs";

    const mockRowsToDeselect = [1, 2];

    const mockRowActionCallback = jest.fn();
    const mockCalculateRowHeight = jest.fn((row, columnsInGrid) => {
        // Minimum height for each row
        let rowHeight = 50;
        if (columnsInGrid && columnsInGrid.length > 0 && row) {
            // Get properties of a row
            const { original, isExpanded } = row;
            // Find the column with maximum width configured, from grid columns list
            const columnWithMaxWidth = [...columnsInGrid].sort((a, b) => {
                return b.width - a.width;
            })[0];
            // Get column properties including the user resized column width (totalFlexWidth)
            const { id, width, totalFlexWidth } = columnWithMaxWidth;
            // Get row value of that column
            const rowValue = original[id];
            if (rowValue) {
                // Find the length of text of data in that column
                const textLength = Object.values(rowValue).join(",").length;
                // This is a formula that was created for the test data used.
                rowHeight += Math.ceil((80 * textLength) / totalFlexWidth);
                const widthVariable =
                    totalFlexWidth > width
                        ? totalFlexWidth - width
                        : width - totalFlexWidth;
                rowHeight += widthVariable / 1000;
            }
            // Add logic to increase row height if row is expanded
            if (isExpanded && mockAdditionalColumn) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    mockAdditionalColumn.innerCells &&
                    mockAdditionalColumn.innerCells.length > 0
                        ? mockAdditionalColumn.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    });
    const mockUpdateRowData = jest.fn();
    const mockDeleteRowData = jest.fn();
    const mockSelectBulkData = jest.fn();
    const mockGridRefresh = jest.fn();
    const mockLoadMoreData = jest.fn();
    const mockCustomPanel = () => {
        const SCR = () => {
            alert("view SCR ");
        };
        const OpenSummary = () => {
            alert("Open Summary");
        };
        const CloseSummary = () => {
            alert("Close Summary");
        };

        const GiveFeedback = () => {
            alert("Give FeedBack ");
        };
        const ViewFeedback = () => {
            alert("View Feedback");
        };

        const buttonPanelData = [
            {
                label: "Send SCR",
                value: "SCR",
                handleEvent: SCR,
                children: []
            },
            {
                label: "Segment Summary",
                value: "SegmentSummary",
                children: [
                    {
                        label: "Open Summary",
                        value: "OpenSummary",
                        handleEvent: OpenSummary
                    },
                    {
                        label: "Close Summary",
                        value: "handleEvent",
                        handleEvent: CloseSummary
                    }
                ]
            },
            {
                label: "Feedback",
                value: "Feedback",
                children: [
                    {
                        label: "View Feedback",
                        value: "ViewFeedback",
                        handleEvent: ViewFeedback
                    },
                    {
                        label: "Give Feedback",
                        value: "GiveFeedback",
                        handleEvent: GiveFeedback
                    }
                ]
            }
        ];

        const isbuttonPanelDataPresent =
            buttonPanelData && buttonPanelData.length > 0;

        return (
            <div className="row-options-overlay customPanel">
                {isbuttonPanelDataPresent
                    ? buttonPanelData.map((action) => {
                          const { label, children, handleEvent } = action;
                          const isChildrenPresent =
                              children && children.length > 0;
                          return (
                              <div className="dropdown" key={label}>
                                  <button
                                      type="submit"
                                      className="dropbtn"
                                      onClick={handleEvent}
                                  >
                                      {label}
                                  </button>

                                  <div className="dropdown-content">
                                      {isChildrenPresent
                                          ? children.map((childAction) => {
                                                const childlabel =
                                                    childAction.label;
                                                const childhandleEvent =
                                                    childAction.handleEvent;
                                                return (
                                                    <div
                                                        className="dropdown"
                                                        key={`${childlabel}`}
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="dropbtn"
                                                            onClick={
                                                                childhandleEvent
                                                            }
                                                        >
                                                            {childlabel}
                                                        </button>
                                                    </div>
                                                );
                                            })
                                          : null}
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>
        );
    };
    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("test custom className, theme, row expand, column filter and Ascending group sort without row height calculation", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId } = render(
            <Grid
                className="icargoCustomClass"
                theme="portal"
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
            />
        );
        const gridContainer = container;

        // Row expansion
        expect(gridContainer).toBeInTheDocument();

        // Check if custom class name is present or not
        const customClassElement = gridContainer.getElementsByClassName(
            "icargoCustomClass"
        );
        expect(customClassElement.length).toBeGreaterThan(0);

        // Check if class name for portal theme is present or not
        const portalThemeClassElement = gridContainer.getElementsByClassName(
            "neo-grid-portal"
        );
        expect(portalThemeClassElement.length).toBeGreaterThan(0);

        const expander = gridContainer.getElementsByClassName("expander")[2];
        act(() => {
            expander.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        const expandRegion = gridContainer.getElementsByClassName("expand");
        expect(expandRegion.length).toBeGreaterThan(0);

        // Column Filter Search
        const toggleColumnFilter = gridContainer.querySelector(
            "[data-testid='toggleColumnFilter']"
        );
        act(() => {
            toggleColumnFilter.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Flight Column Search
        const columnInput = gridContainer.getElementsByClassName("txt").item(1);
        fireEvent.change(columnInput, { target: { value: "222" } });
        expect(columnInput.value).toBe("222");
        fireEvent.change(columnInput, { target: { value: "" } });
        expect(columnInput.value).toBe("");
        // SR Column Search
        const SrInput = gridContainer.getElementsByClassName("txt").item(2);
        fireEvent.change(SrInput, { target: { value: "74" } });
        expect(SrInput.value).toBe("74");
        fireEvent.change(SrInput, { target: { value: "" } });
        expect(SrInput.value).toBe("");
        // ULD Positions column search
        const positionInput = gridContainer
            .getElementsByClassName("txt")
            .item(3);
        fireEvent.change(positionInput, { target: { value: "l1" } });
        expect(positionInput.value).toBe("l1");
        fireEvent.change(positionInput, { target: { value: "" } });
        expect(positionInput.value).toBe("");

        // Apply Ascending Sort
        const toggleGroupSortOverLay = gridContainer.querySelector(
            "[data-testid='toggleGroupSortOverLay']"
        );
        act(() => {
            toggleGroupSortOverLay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let sortOverlay = gridContainer.querySelector(
            "[class='neo-grid-popover__sort']"
        );
        const addNewSort = sortOverlay.querySelector("[class='sort__txt']");
        act(() => {
            addNewSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        sortOverlay = gridContainer.querySelector(
            "[class='neo-grid-popover__sort']"
        );
        expect(sortOverlay).toBeNull();
    });

    it("test Descending group sort with row height calculation", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                calculateRowHeight={mockCalculateRowHeight}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Apply Descending Sort
        const toggleGroupSortOverLay = gridContainer.querySelector(
            "[data-testid='toggleGroupSortOverLay']"
        );
        act(() => {
            toggleGroupSortOverLay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let sortOverlay = gridContainer.querySelector(
            "[class='neo-grid-popover__sort']"
        );
        const addNewSort = sortOverlay.querySelector("[class='sort__txt']");
        act(() => {
            addNewSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Change Sort Order
        const sortOrderSelectList = document
            .querySelector(".sort__bodyContent")
            .getElementsByClassName("sort__reorder")[3]
            .getElementsByTagName("select")[0];
        fireEvent.change(sortOrderSelectList, {
            target: { value: "Descending" }
        });
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        sortOverlay = gridContainer.querySelector(
            "[class='neo-grid-popover__sort']"
        );
        expect(sortOverlay).toBeNull();
    });

    it("test row options functionalities and column sort with row height calculation, custom panel and refresh button not passed", () => {
        mockOffsetSize(600, 600);
        const { getByText, container, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                calculateRowHeight={mockCalculateRowHeight}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check if custom panel is not present as the property is not passed to Grid
        const customPanelElement = gridContainer.getElementsByClassName(
            "customPanel"
        );
        expect(customPanelElement.length).toBe(0);

        // Check if refresh icon is not present as the property is not passed to Grid
        const refreshElement = gridContainer.getElementsByClassName(
            "refresh-data"
        );
        expect(refreshElement.length).toBe(0);

        // Row Options
        let rowOptionsIcon = gridContainer.querySelector(
            "[class=icon-row-options]"
        ).firstChild;
        let rowOptionsOverlay = null;
        let rowOptionActionOverlay = null;
        // Do row edit
        act(() => {
            rowOptionsIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionsOverlay = gridContainer
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(rowOptionsOverlay).toBeInTheDocument();
        const EditLink = getByText("Edit");
        act(() => {
            EditLink.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        rowOptionActionOverlay = gridContainer
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeInTheDocument();
        const flightnoInput = rowOptionActionOverlay
            .getElementsByClassName("edit-flight-no")[0]
            .getElementsByTagName("input")[0];
        fireEvent.change(flightnoInput, { target: { value: "dfg" } });
        const rowEditSave = getByTestId("rowEditOverlay-save");
        act(() => {
            rowEditSave.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionActionOverlay = gridContainer
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeNull();
        // Do row delete
        rowOptionsIcon = gridContainer.querySelector("[class=icon-row-options]")
            .lastChild;
        act(() => {
            rowOptionsIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionsOverlay = gridContainer
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(rowOptionsOverlay).toBeInTheDocument();
        const DeleteLink = getByText("Delete");
        act(() => {
            DeleteLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionActionOverlay = gridContainer
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeInTheDocument();
        const rowDelete = getByTestId("rowDeleteOverlay-Delete");
        act(() => {
            rowDelete.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        rowOptionActionOverlay = gridContainer
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeNull();

        // Column Sort
        const flightSort = gridContainer.getElementsByClassName(
            "column-heading"
        )[2].firstChild;
        act(() => {
            flightSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const idSort = gridContainer.getElementsByClassName("column-heading")[1]
            .firstChild;
        act(() => {
            idSort.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
    });

    it("test grid with 2 rows to trigger the load more page function", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                gridData={smallData}
                idAttribute="travelId"
                paginationType="cursor"
                pageInfo={smallPageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();
    });

    it("test Grid loading with row selector and all header icons hidden, custom panel and refresh button shown", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                gridData={data}
                rowsToOverscan={20}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumnWithoutInnerCells}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                onGridRefresh={mockGridRefresh}
                CustomPanel={mockCustomPanel}
                globalSearch={false}
                columnFilter={false}
                groupSort={false}
                columnChooser={false}
                exportData={false}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check if custom panel is present
        const customPanelElement = gridContainer.getElementsByClassName(
            "customPanel"
        );
        expect(customPanelElement.length).toBeGreaterThan(0);

        // Check if refresh icon is present
        const refreshElement = gridContainer.getElementsByClassName(
            "refresh-data"
        );
        expect(refreshElement.length).toBeGreaterThan(0);

        // Global filter
        const globalFilter = gridContainer.querySelectorAll(
            ".neo-grid-header_globalFilter"
        );
        expect(globalFilter.length).toBe(0);

        // Column Filter
        const columnFilterIcon = gridContainer.querySelectorAll(
            ".keyword-search"
        );
        expect(columnFilterIcon.length).toBe(0);

        // Group Sort
        const groupSortIcon = gridContainer.querySelectorAll(".group-sort");
        expect(groupSortIcon.length).toBe(0);

        // Column Chooser
        const columnChooserIcon = gridContainer.querySelectorAll(
            ".manage-columns"
        );
        expect(columnChooserIcon.length).toBe(0);

        // Export Data
        const exportDataIcon = gridContainer.querySelectorAll(".export-data");
        expect(exportDataIcon.length).toBe(0);
    });

    it("test Grid loading without any data", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                onGridRefresh={mockGridRefresh}
                CustomPanel={mockCustomPanel}
                globalSearch={false}
                columnFilter={false}
                groupSort={false}
                columnChooser={false}
                exportData={false}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check if error message is present
        const errorElement = gridContainer.getElementsByClassName("error");
        expect(errorElement.length).toBeGreaterThan(0);
    });

    it("test Grid loading without columns", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                onGridRefresh={mockGridRefresh}
                CustomPanel={mockCustomPanel}
                globalSearch={false}
                columnFilter={false}
                groupSort={false}
                columnChooser={false}
                exportData={false}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check if error message is present
        const errorElement = gridContainer.getElementsByClassName("error");
        expect(errorElement.length).toBeGreaterThan(0);
    });

    it("test row selection retained after applying group sort", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                onGridRefresh={mockGridRefresh}
                CustomPanel={mockCustomPanel}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        const selectRowCheckbox = container.querySelectorAll(
            "input[type='checkbox']"
        )[2];
        act(() => {
            selectRowCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Apply Sort
        const toggleGroupSortOverLay = container.querySelector(
            "[data-testid='toggleGroupSortOverLay']"
        );

        act(() => {
            toggleGroupSortOverLay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let sortOverlay = container.querySelector(
            "[class='neo-grid-popover__sort']"
        );
        const addNewSort = sortOverlay.querySelector("[class='sort__txt']");
        act(() => {
            addNewSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        sortOverlay = container.querySelector(
            "[class='neo-grid-popover__sort']"
        );
        expect(sortOverlay).toBeNull();

        const selectedRowCheckboxes = container.querySelectorAll(
            "input[type='checkbox'][checked]"
        );
        expect(selectedRowCheckboxes.length).toBe(1);
        const idCellContainerElement =
            selectedRowCheckboxes[0].parentElement.parentElement.parentElement
                .nextElementSibling;
        expect(idCellContainerElement.innerHTML).toBe("0");
    });

    it("test display of row specific expand icon and class names", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                getRowInfo={getRowInfo}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check rows with class name "disabled"
        const totalRowsCountInThisPage = document.getElementsByClassName(
            "table-row tr"
        ).length;
        const totalDisabledRowsCountInThisPage = document.getElementsByClassName(
            "table-row tr disabled"
        ).length;
        // Check if atleast 1 disabled row is present
        expect(totalDisabledRowsCountInThisPage).toBeGreaterThan(0);
        // Check if all rows are not disabled
        expect(totalDisabledRowsCountInThisPage).toBeLessThan(
            totalRowsCountInThisPage
        );

        // Check if expand icon is not present for all rows
        const totalExpandIconsInThisPage = getAllByTestId("rowExpanderIcon")
            .length;
        // Check if atleast 1 expand icon is present
        expect(totalExpandIconsInThisPage).toBeGreaterThan(0);
        // Check if all rows are not having expand icons
        expect(totalExpandIconsInThisPage).toBeLessThan(
            totalRowsCountInThisPage
        );
    });
});
