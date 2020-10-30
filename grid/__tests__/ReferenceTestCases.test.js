/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Grid from "../src/index";

describe("Reference test cases", () => {
    // Grid will load only required data based on the screen size.
    // This function is to mock a ascreen size.
    // This has to be called in each of the test cases
    function mockOffsetSize(width, height) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
            configurable: true,
            value: height
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            value: width
        });
    }

    // Mocked columns structure for Grid
    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true
        },
        {
            Header: "Flight",
            accessor: "flight",
            width: 100,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    isSearchable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    isSearchable: true
                }
            ],
            sortValue: "flightno",
            isSearchable: true,
            displayCell: (rowData, DisplayTag) => {
                const { flightno } = rowData.flight;
                return (
                    <div className="flight-details">
                        <DisplayTag columnKey="flight" cellKey="flightno">
                            <strong>{flightno}</strong>
                        </DisplayTag>
                    </div>
                );
            }
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            isSearchable: true
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position",
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            isSearchable: true,
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
            }
        }
    ];

    // Mocked column structure that has to be displayed in the row expanded region
    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [{ Header: "Remarks", accessor: "remarks" }],
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

    // Mock sample data structure for Grid
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

    // Keep a data structure with only 1 row.
    // This is used to test the load more function (which is used to load next page)
    const smallData = [...data];
    const smallPageInfo = {
        pageNum: 1,
        pageSize: 1,
        total: 20000,
        lastPage: false
    };

    // Add more items to the Grid data structure
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

    // Mock function to calculate row height
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

    // Mock function to return edit overlay for Grid
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
                                    data-testid="rowEditOverlay-Flightno"
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

    // Row actions to be displayed in the Kebab menu of Grid
    // Edit and Delete will work internally and for the rest additional row action, need a callback function
    const mockRowActions = [
        { label: "edit" },
        { label: "delete" },
        { label: "Send SCR", value: "SCR" },
        { label: "Segment Summary", value: "SegmentSummary" },
        { label: "Open Summary", value: "OpenSummary" },
        { label: "Close Summary", value: "CloseSummary" }
    ];
    // Callback function for additional row actions
    const mockRowActionCallback = jest.fn();

    // Callback functions for row edit, cell edit, row delete, row select and grid refresh
    const mockOnRowUpdate = jest.fn();
    const mockOnRowDelete = jest.fn();
    const mockOnRowSelect = jest.fn();
    const mockLoadMoreData = jest.fn();

    // Initialize contianer and functions for test
    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    // Set screen size before starting the tests.
    // Grid will be loaded based on this screen size.
    mockOffsetSize(600, 600);
    it("load Grid with small data and next page as true. This will trigger the load next page function", () => {
        const { container } = render(
            <Grid
                gridData={smallData}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={smallPageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                calculateRowHeight={mockCalculateRowHeight}
                onRowUpdate={mockOnRowUpdate}
                onRowDelete={mockOnRowDelete}
                onRowSelect={mockOnRowSelect}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();
        // Check if loadmoredata function has been called
        expect(mockLoadMoreData).toBeCalled();
    });

    it("load Grid with large data and test row expansion", () => {
        const { container, getAllByTestId } = render(
            <Grid
                gridData={data}
                rowsToOverscan={20}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                calculateRowHeight={mockCalculateRowHeight}
                onRowUpdate={mockOnRowUpdate}
                onRowDelete={mockOnRowDelete}
                onRowSelect={mockOnRowSelect}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Find and click expand icon and check if row rerender is triggered
        // If row is rerendered function to calculate row height will be called for each rows
        const rowExpandIcon = getAllByTestId("rowExpanderIcon");
        act(() => {
            rowExpandIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const rowExpandedRegion = getAllByTestId("rowExpandedRegion");
        expect(rowExpandedRegion.length).toBe(1);
    });

    it("test row selections", () => {
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                columns={gridColumns}
                calculateRowHeight={mockCalculateRowHeight}
                onRowUpdate={mockOnRowUpdate}
                onRowDelete={mockOnRowDelete}
                onRowSelect={mockOnRowSelect}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Test select all checkbox
        const selectAllRowsCheckbox = getByTestId("rowSelector-allRows");
        act(() => {
            selectAllRowsCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(mockOnRowSelect).toBeCalled();

        // Test single row checkbox
        const selectRowCheckbox = getAllByTestId("rowSelector-singleRow");
        act(() => {
            selectRowCheckbox[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(mockOnRowSelect).toBeCalled();
    });

    it("test row actions", () => {
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                columns={gridColumns}
                calculateRowHeight={mockCalculateRowHeight}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                onRowUpdate={mockOnRowUpdate}
                onRowDelete={mockOnRowDelete}
                onRowSelect={mockOnRowSelect}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Open actions overlay to test Edit row
        let rowActionOpenLinks = getAllByTestId("rowActions-open-link");
        act(() => {
            rowActionOpenLinks[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if row actions overlay has been opened
        let rowActionsOverlay = getByTestId("rowActions-kebab-overlay");
        expect(rowActionsOverlay).toBeInTheDocument();
        // Click edit link
        const editActionLink = getByTestId("rowAction-editRow");
        act(() => {
            editActionLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if edit row overlay is bind
        expect(mockGetRowEditOverlay).toBeCalledTimes(1);
        const rowEditOverlayContainer = getByTestId("rowEditOverlay-container");
        expect(rowEditOverlayContainer).toBeInTheDocument();
        // Find an input element from edit overlay and change the value
        const input = getByTestId("rowEditOverlay-Flightno");
        fireEvent.change(input, { target: { value: "ABC1178" } });
        // Click on the save button of row edit overlay
        const rowEditOverlaySaveButton = getByTestId("rowEditOverlay-save");
        act(() => {
            rowEditOverlaySaveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Row update call back should be called once.
        expect(mockOnRowUpdate).toBeCalledTimes(1);

        // Open overlay to test Delete row
        rowActionOpenLinks = getAllByTestId("rowActions-open-link");
        act(() => {
            rowActionOpenLinks[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if row actions overlay has been opened
        rowActionsOverlay = getByTestId("rowActions-kebab-overlay");
        expect(rowActionsOverlay).toBeInTheDocument();
        // Find and click delete link
        const deleteActionLink = getByTestId("rowAction-deleteRow");
        act(() => {
            deleteActionLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if edit row overlay is bind
        const rowDeleteOverlayContainer = getByTestId(
            "rowDeleteOverlay-container"
        );
        expect(rowDeleteOverlayContainer).toBeInTheDocument();
        // Click on the Delete button of row delete overlay
        const rowDeleteOverlaySaveButton = getByTestId(
            "rowDeleteOverlay-Delete"
        );
        act(() => {
            rowDeleteOverlaySaveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Row update call back should be called once.
        expect(mockOnRowDelete).toBeCalledTimes(1);

        // Open overlay to test additional action
        rowActionOpenLinks = getAllByTestId("rowActions-open-link");
        act(() => {
            rowActionOpenLinks[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if row actions overlay has been opened
        rowActionsOverlay = getByTestId("rowActions-kebab-overlay");
        expect(rowActionsOverlay).toBeInTheDocument();
        // Find and click additional action item
        const additionalActionLinks = getAllByTestId(
            "rowAction-additionalAction"
        );
        act(() => {
            additionalActionLinks[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Additional row action call back should be called once.
        expect(mockRowActionCallback).toBeCalledTimes(1);
    });
});
