/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
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
    const editedRowValue = {
        travelId: 0,
        flight: {
            flightno: "123",
            date: "31-Aug-2016"
        }
    };
    const mockUpdateDateValue = jest.fn();
    const mockEditCell = jest.fn((rowData, DisplayTag, rowUpdateCallBack) => {
        const { flightno, date } = rowData.flight;
        return (
            <div>
                <DisplayTag columnKey="flight" cellKey="flightno">
                    <input
                        data-testid="flightnoinput"
                        className="flight-no-input"
                        type="text"
                        value={flightno}
                        onChange={() => rowUpdateCallBack("nothing")}
                    />
                </DisplayTag>
                <DisplayTag columnKey="flight" cellKey="date">
                    <input
                        type="date"
                        value={date}
                        onChange={mockUpdateDateValue}
                    />
                </DisplayTag>
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
            Header: () => {
                return <span className="flightHeader">Flight</span>;
            },
            title: "Flight",
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
            displayCell: mockDisplayCell,
            editCell: mockEditCell
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

    const getRowInfo = (rowData) => {
        const { travelId } = rowData;
        return {
            isRowExpandable: travelId % 2 === 0,
            isRowSelectable: travelId % 3 !== 0,
            className: travelId % 10 === 0 ? "disabled" : ""
        };
    };

    const mockGridHeight = "80vh";
    const mockGridWidth = "100%";
    const mockTitle = "AWBs";

    const mockRowsToDeselect = [1, 2];

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
    const mockRowActions = jest.fn();
    const mockUpdateRowData = jest.fn();
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

    it("test custom className, theme, row expand, column filter, Ascending group sort and Cell edit without row height calculation", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
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
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check if custom class name is present or not
        const customClassElement = gridContainer.getElementsByClassName(
            "icargoCustomClass"
        );
        expect(customClassElement.length).toBeGreaterThan(0);

        // Check if class name for portal theme is present or not
        const portalThemeClassElement = gridContainer.getElementsByClassName(
            "neo-grid--portal"
        );
        expect(portalThemeClassElement.length).toBeGreaterThan(0);

        const expander = getAllByTestId("rowExpanderIcon")[2];
        act(() => {
            expander.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        const expandRegion = getAllByTestId("rowExpandedRegion");
        expect(expandRegion.length).toBeGreaterThan(0);

        // Column Filter Search
        const toggleColumnFilter = getByTestId("toggleColumnFilter");
        act(() => {
            toggleColumnFilter.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Flight Column Search
        const columnInput = getAllByTestId("columnFilter-textbox")[0];
        fireEvent.change(columnInput, { target: { value: "222" } });
        expect(columnInput.value).toBe("222");
        fireEvent.change(columnInput, { target: { value: "" } });
        expect(columnInput.value).toBe("");
        // SR Column Search
        const SrInput = getAllByTestId("columnFilter-textbox")[1];
        fireEvent.change(SrInput, { target: { value: "74" } });
        expect(SrInput.value).toBe("74");
        fireEvent.change(SrInput, { target: { value: "" } });
        expect(SrInput.value).toBe("");
        // ULD Positions column search
        const positionInput = getAllByTestId("columnFilter-textbox")[2];
        fireEvent.change(positionInput, { target: { value: "l1" } });
        expect(positionInput.value).toBe("l1");
        fireEvent.change(positionInput, { target: { value: "" } });
        expect(positionInput.value).toBe("");

        // Apply Ascending Sort
        const toggleGroupSortOverLay = getByTestId("toggleGroupSortOverLay");
        act(() => {
            toggleGroupSortOverLay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let sortOverlay = getByTestId("groupsortoverlay");
        const addNewSort = getByTestId("addSort");
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
            "[data-testid='groupsortoverlay']"
        );
        expect(sortOverlay).toBeNull();

        // Cell edit
        const editButton = getAllByTestId("cell-edit-icon");
        act(() => {
            editButton[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const flightNoInput = getByTestId("flightnoinput");
        expect(flightNoInput.value).toBe("XX6983");
        fireEvent.change(flightNoInput, { target: { value: "123" } });

        const setState = jest.fn(() => editedRowValue);
        const useStateSpy = jest.spyOn(React, "useState");
        useStateSpy.mockImplementation(() => [editedRowValue, setState]);
        fireEvent.click(getByTestId("cell-edit-save"));
    });

    it("test row options functionalities and column sort with row height calculation, custom panel and refresh button not passed", () => {
        mockOffsetSize(600, 600);
        const { getAllByTestId, container, getByTestId } = render(
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
                calculateRowHeight={mockCalculateRowHeight}
                onRowUpdate={mockUpdateRowData}
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
        const refreshElement = gridContainer.querySelectorAll(
            "[data-testid='refreshGrid']"
        );
        expect(refreshElement.length).toBe(0);

        // Open actions overlay
        const rowActionOpenLinks = getAllByTestId("rowActions-open-link");
        act(() => {
            rowActionOpenLinks[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if row actions overlay has been opened
        const rowActionsOverlay = getByTestId("rowActions-kebab-overlay");
        expect(rowActionsOverlay).toBeInTheDocument();
        // Click close button
        const closeButton = getByTestId("close-rowActions-kebab-overlay");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if overlay has been closed
        const overlayContainer = container.querySelectorAll(
            "[data-testid='rowActions-kebab-overlay']"
        );
        expect(overlayContainer.length).toBe(0);

        // Column Sort
        const flightSort = getAllByTestId("column-header-sort")[2];
        act(() => {
            flightSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const idSort = getAllByTestId("column-header-sort")[1];
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
                onRowUpdate={mockUpdateRowData}
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
                onRowUpdate={mockUpdateRowData}
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
        const refreshElement = gridContainer.querySelectorAll(
            "[data-testid='refreshGrid']"
        );
        expect(refreshElement.length).toBeGreaterThan(0);

        // Global filter
        const globalFilter = gridContainer.querySelectorAll(
            "[data-testid='globalFilter-textbox']"
        );
        expect(globalFilter.length).toBe(0);

        // Column Filter
        const columnFilterIcon = gridContainer.querySelectorAll(
            "[data-testid='columnFilter-textbox']"
        );
        expect(columnFilterIcon.length).toBe(0);

        // Group Sort
        const groupSortIcon = gridContainer.querySelectorAll(
            "[data-testid='toggleGroupSortOverLay']"
        );
        expect(groupSortIcon.length).toBe(0);

        // Column Chooser
        const columnChooserIcon = gridContainer.querySelectorAll(
            "[data-testid='toggleManageColumnsOverlay']"
        );
        expect(columnChooserIcon.length).toBe(0);

        // Export Data
        const exportDataIcon = gridContainer.querySelectorAll(
            "[data-testid='toggleExportDataOverlay']"
        );
        expect(exportDataIcon.length).toBe(0);
    });

    it("test Grid loading without any data", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId } = render(
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
                onRowUpdate={mockUpdateRowData}
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
        const errorElement = getByTestId("nodataerror");
        expect(errorElement).toBeInTheDocument();
    });

    it("test Grid loading without columns", () => {
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
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
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
        const errorElement = getByTestId("nocolumnserror");
        expect(errorElement).toBeInTheDocument();
    });

    it("test row selection retained after applying group sort", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
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
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                onGridRefresh={mockGridRefresh}
                CustomPanel={mockCustomPanel}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Apply Sort
        const toggleGroupSortOverLay = getByTestId("toggleGroupSortOverLay");

        act(() => {
            toggleGroupSortOverLay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let sortOverlay = getByTestId("groupsortoverlay");
        const addNewSort = getByTestId("addSort");
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
            "[data-testid='groupsortoverlay']"
        );
        expect(sortOverlay).toBeNull();

        const selectRowCheckbox = getAllByTestId("rowSelector-singleRow")[2];
        act(() => {
            selectRowCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const selectedRowCheckboxes = container.querySelectorAll(
            "input[type='checkbox'][checked]"
        );
        expect(selectedRowCheckboxes.length).toBe(1);
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
                onRowSelect={mockSelectBulkData}
                getRowInfo={getRowInfo}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check rows with class name "disabled"
        const totalRowsCountInThisPage = getAllByTestId("gridrow").length;
        const totalDisabledRowsCountInThisPage = document.getElementsByClassName(
            "disabled"
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

    it("test grid without passing callback function", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
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
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Cell edit
        const editButton = getAllByTestId("cell-edit-icon");
        act(() => {
            editButton[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const flightNoInput = getByTestId("flightnoinput");
        expect(flightNoInput.value).toBe("XX2225");
        fireEvent.change(flightNoInput, { target: { value: "123" } });
        const setState = jest.fn(() => editedRowValue);
        const useStateSpy = jest.spyOn(React, "useState");
        useStateSpy.mockImplementation(() => [editedRowValue, setState]);
        fireEvent.click(getByTestId("cell-edit-save"));

        const selectRowCheckbox = getAllByTestId("rowSelector-singleRow")[4];
        act(() => {
            selectRowCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });
});
