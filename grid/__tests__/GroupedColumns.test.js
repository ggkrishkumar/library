/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
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

    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true
        },
        {
            groupHeader: "Flight & Segment",
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
            isSearchable: true,
            sortValue: "flightno",
            displayCell: (
                rowData,
                DisplayTag,
                isDesktop,
                isExpandableColumn
            ) => {
                const { flightno, date } = rowData.flight;
                return (
                    <div className="flight-details">
                        <DisplayTag columnKey="flight" cellKey="flightno">
                            <strong>{flightno}</strong>
                        </DisplayTag>
                        <DisplayTag columnKey="flight" cellKey="date">
                            <span className="flight-date">{date}</span>
                        </DisplayTag>
                    </div>
                );
            }
        },
        {
            groupHeader: "Flight & Segment",
            Header: "Segment",
            accessor: "segment",
            width: 100,
            innerCells: [
                {
                    Header: "From",
                    accessor: "from",
                    isSearchable: true
                },
                {
                    Header: "To",
                    accessor: "to",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            isSearchable: false,
            displayCell: (
                rowData,
                DisplayTag,
                isDesktop,
                isExpandableColumn
            ) => {
                const { from, to } = rowData.segment;
                return (
                    <div className="segment-details">
                        <DisplayTag columnKey="segment" cellKey="from">
                            <span>{from}</span>
                        </DisplayTag>
                        <DisplayTag columnKey="segment" cellKey="to">
                            <span>{to}</span>
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
    const mockLoadMoreData = jest.fn();
    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);
    it("test column manage overlay", () => {
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
                calculateRowHeight={mockCalculateRowHeight}
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
        expect(gridContainer).toBeInTheDocument();

        // Check if group header is present or not
        let groupHeader = getAllByTestId("grid-group-header");
        expect(groupHeader.length).toBe(6); // 1 row selector + 1 row option + 3 normal columns + 1 grouped collumn (inside that 2 normal columns)
        // Check total number of original columns
        let gridHeader = getAllByTestId("grid-header");
        expect(gridHeader.length).toBe(7); // 1 row selector + 1 row option + 5 normal columns (including 2 columns that comes under group header)
        // Check if all columns are present
        let columnHeadingsCount = gridContainer.getElementsByClassName(
            "column-heading"
        );
        expect(columnHeadingsCount.length).toBe(13);
        // Check if flight date is displayed
        let flightDateElem = gridContainer.getElementsByClassName(
            "flight-date"
        );
        expect(flightDateElem.length).toBeGreaterThan(0);

        // Open Manage Columns Overlay
        let manageColumnsIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            manageColumnsIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // UnSelect the Segment Coloumn From Column Chooser
        const segmentColumCheckBox = getByTestId(
            "selectSingleSearchableColumn_column_2"
        );
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Unselect ineer cell of Flight column
        const flightInnerCellCheckBox = getByTestId(
            "selectInnerCell_column_1_column_1_cell_1"
        );
        act(() => {
            flightInnerCellCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // triggering Save button Click
        const saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if group header is still present or not
        groupHeader = getAllByTestId("grid-group-header");
        expect(groupHeader.length).toBe(6); // 1 row selector + 1 row option + 3 normal columns + 1 grouped collumn (inside that 1 normal column and 1 hidden column)
        // Check total number of original columns
        gridHeader = getAllByTestId("grid-header");
        expect(gridHeader.length).toBe(6); // 1 row selector + 1 row option + 4 normal columns (including 2 columns that comes under group header and excluding hidden column)
        // Check if all columns are present
        columnHeadingsCount = gridContainer.getElementsByClassName(
            "column-heading"
        );
        expect(columnHeadingsCount.length).toBe(12);
        // Check if flight data has been hidden
        flightDateElem = gridContainer.getElementsByClassName("flight-date");
        expect(flightDateElem.length).toBe(0);

        // Open Manage Columns Overlay to reset changes
        manageColumnsIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            manageColumnsIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // triggering Reset button Click
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if group header is still present or not
        groupHeader = getAllByTestId("grid-group-header");
        expect(groupHeader.length).toBe(6); // 1 row selector + 1 row option + 3 normal columns + 1 grouped collumn (inside that 2 normal columns)
        // Check total number of original columns
        gridHeader = getAllByTestId("grid-header");
        expect(gridHeader.length).toBe(7); // 1 row selector + 1 row option + 5 normal columns (including 2 columns that comes under group header)
        // Check if all columns are present
        columnHeadingsCount = gridContainer.getElementsByClassName(
            "column-heading"
        );
        expect(columnHeadingsCount.length).toBe(13);
        // Check if flight data has been displayed again
        flightDateElem = gridContainer.getElementsByClassName("flight-date");
        expect(flightDateElem.length).toBeGreaterThan(0);
    });

    it("test export data overlay", () => {
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
                calculateRowHeight={mockCalculateRowHeight}
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
        expect(gridContainer).toBeInTheDocument();

        // Open Manage Columns Overlay
        const exportColumnsIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportColumnsIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // UnSelect the Segment Coloumn From Column Chooser
        const segmentColumCheckBox = getByTestId(
            "selectSingleSearchableColumn_column_2"
        );
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });
});
