/* eslint-disable no-undef */
import React from "react";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import Customgrid from "../src/Customgrid";

describe("render Customgrid", () => {
    function mockOffsetSize(width, height) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
            configurable: true,
            value: height
        });
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
            configurable: true,
            value: height + 200
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
            disableFilters: true,
            columnId: "column_0",
            display: true,
            isSortable: true,
            isGroupHeader: false
        },
        {
            Header: "Flight",
            accessor: "flight",
            width: 100,
            columnId: "column_1",
            isSortable: true,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    display: true,
                    cellId: "column_1_cell_0",
                    isSortable: true,
                    isSearchable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    display: true,
                    cellId: "column_1_cell_1",
                    isSortable: true,
                    isSearchable: true
                }
            ],
            sortValue: "flightno",
            Cell: mockDisplayCell,
            display: false,
            isSearchable: true,
            isGroupHeader: false
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            columnId: "column_2",
            isSortable: true,
            display: true,
            isSearchable: true,
            isGroupHeader: false
        }
    ];

    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks",
                cellId: "rowExpand_cell_0",
                display: true
            }
        ],
        columnId: "rowExpand",
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
        },
        display: true
    };

    const gridData = [
        {
            travelId: 0,
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
        },
        {
            travelId: 1,
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
        }
    ];

    for (let i = 0; i < 50; i++) {
        gridData.push({
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

    const mockRowActions = [
        { label: "edit" },
        { label: "delete" },
        { label: "Send SCR", value: "SCR" },
        { label: "Segment Summary", value: "SegmentSummary" },
        { label: "Open Summary", value: "OpenSummary" },
        { label: "Close Summary", value: "CloseSummary" }
    ];
    const mockRowActionCallback = jest.fn();

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

    const mockGridHeight = "80vh";
    const mockGridWidth = "100%";
    const mockTitle = "AWBs";
    const mockUpdateRowInGrid = jest.fn();
    const mockDeleteRowFromGrid = jest.fn();
    const mocksearchColumn = jest.fn((column, original, searchText) => {
        if (column && searchText) {
            return original;
        }
        return null;
    });
    const mockSelectBulkData = jest.fn();
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
            if (isExpanded && additionalColumn) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    additionalColumn.innerCells &&
                    additionalColumn.innerCells.length > 0
                        ? additionalColumn.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    });
    const mockIsExpandContentAvailable = true;
    const mockDisplayExpandedContent = jest.fn((rowData, DisplayTag) => {
        const { remarks, details } = rowData;
        const {
            startTime,
            endTime,
            status,
            additionalStatus,
            flightModel,
            bodyType,
            type,
            timeStatus
        } = details;
        const timeStatusArray = timeStatus ? timeStatus.split(" ") : [];
        const timeValue = timeStatusArray.shift();
        const timeText = timeStatusArray.join(" ");
        return (
            <div className="details-wrap">
                <DisplayTag columnKey="remarks" cellKey="remarks">
                    <ul>
                        <li>{remarks}</li>
                    </ul>
                </DisplayTag>
                <DisplayTag columnKey="details" cellKey="details">
                    <ul>
                        <li>
                            {startTime} - {endTime}
                        </li>
                        <li className="divider">|</li>
                        <li>
                            <span>{status}</span>
                        </li>
                        <li className="divider">|</li>
                        <li>{additionalStatus}</li>
                        <li className="divider">|</li>
                        <li>{flightModel}</li>
                        <li className="divider">|</li>
                        <li>{bodyType}</li>
                        <li className="divider">|</li>
                        <li>
                            <span>{type}</span>
                        </li>
                        <li className="divider">|</li>
                        <li>
                            <strong>{timeValue} </strong>
                            <span>{timeText}</span>
                        </li>
                    </ul>
                </DisplayTag>
            </div>
        );
    });
    const mockHasNextPage = false;
    const mockIsNextPageLoading = false;
    const mockLoadNextPage = jest.fn();
    const mockGetSortedData = jest.fn(() => gridData);

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("should render Customgrid", () => {
        mockOffsetSize(600, 600);
        const { getByText, container, getByTestId, getAllByTestId } = render(
            <Customgrid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                managableColumns={gridColumns}
                expandedRowData={mockAdditionalColumn}
                gridData={gridData}
                idAttribute="travelId"
                getRowEditOverlay={mockGetRowEditOverlay}
                updateRowInGrid={mockUpdateRowInGrid}
                deleteRowFromGrid={mockDeleteRowFromGrid}
                searchColumn={mocksearchColumn}
                onRowSelect={mockSelectBulkData}
                calculateRowHeight={mockCalculateRowHeight}
                isExpandContentAvailable={mockIsExpandContentAvailable}
                displayExpandedContent={mockDisplayExpandedContent}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                hasNextPage={mockHasNextPage}
                isNextPageLoading={mockIsNextPageLoading}
                loadNextPage={mockLoadNextPage}
                getSortedData={mockGetSortedData}
            />
        );

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

        // Row Selector
        const selectAllRowsCheckbox = container.querySelectorAll(
            "input[type='checkbox']"
        )[0];
        act(() => {
            selectAllRowsCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(mockSelectBulkData).toBeCalledTimes(1);

        // Apply column manage
        const toggleManageColumnsOverlay = container.querySelector(
            "[data-testid='toggleManageColumnsOverlay']"
        );
        act(() => {
            toggleManageColumnsOverlay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let columnManageOverlay = container.querySelector(
            "[class='neo-grid-popover__column column__grid']"
        );
        const applyColumnManageButton = getByTestId("save_columnsManage");
        act(() => {
            applyColumnManageButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        columnManageOverlay = container.querySelector(
            "[class='neo-grid-popover neo-grid-popover--column columns--grid']"
        );
        expect(columnManageOverlay).toBeNull();

        // Export Overlay Open-close
        const toggleExportDataOverlay = container.querySelector(
            "[data-testid='toggleExportDataOverlay']"
        );
        act(() => {
            toggleExportDataOverlay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let exportOverlay = container.querySelector(
            "[class='export__settings']"
        );
        expect(exportOverlay).toBeInTheDocument();
        act(() => {
            toggleExportDataOverlay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        exportOverlay = container.querySelector("[class='export__settings']");
        expect(exportOverlay).toBeNull();

        // Row Options
        const rowOptionsIcon = container.querySelector(
            "[class=icon-row-options]"
        ).firstChild;
        let rowOptionsOverlay = null;
        let rowOptionActionOverlay = null;
        // Open row options and then open - close Row Edit Overlay
        act(() => {
            rowOptionsIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionsOverlay = container
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(rowOptionsOverlay).toBeInTheDocument();
        const EditLink = getByText("Edit");
        act(() => {
            EditLink.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        rowOptionActionOverlay = container
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeInTheDocument();
        const rowEditCancel = getByTestId("rowEditOverlay-cancel");
        act(() => {
            rowEditCancel.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionActionOverlay = container
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeNull();
        // Open row options and then open - close Row Delete Overlay
        act(() => {
            rowOptionsIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionsOverlay = container
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(rowOptionsOverlay).toBeInTheDocument();
        const DeleteLink = getByText("Delete");
        act(() => {
            DeleteLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionActionOverlay = container
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeInTheDocument();
        const rowDeleteCancel = getByTestId("rowDeleteOverlay-cancel");
        act(() => {
            rowDeleteCancel.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        rowOptionActionOverlay = container
            .getElementsByClassName("row-option-action-overlay")
            .item(0);
        expect(rowOptionActionOverlay).toBeNull();
    });

    it("test global search for grid", async () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Customgrid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                managableColumns={gridColumns}
                expandedRowData={mockAdditionalColumn}
                gridData={gridData}
                idAttribute="travelId"
                getRowEditOverlay={mockGetRowEditOverlay}
                updateRowInGrid={mockUpdateRowInGrid}
                deleteRowFromGrid={mockDeleteRowFromGrid}
                searchColumn={mocksearchColumn}
                onRowSelect={mockSelectBulkData}
                calculateRowHeight={mockCalculateRowHeight}
                isExpandContentAvailable={mockIsExpandContentAvailable}
                displayExpandedContent={mockDisplayExpandedContent}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                hasNextPage={mockHasNextPage}
                isNextPageLoading={mockIsNextPageLoading}
                loadNextPage={mockLoadNextPage}
                getSortedData={mockGetSortedData}
            />
        );

        // Global Filter Search
        const input = container.getElementsByClassName("txt").item(0);
        fireEvent.change(input, { target: { value: "1" } });
        expect(input.value).toBe("1");
        await waitFor(() => expect(mocksearchColumn).toBeCalled());
        fireEvent.change(input, { target: { value: "" } });
        expect(input.value).toBe("");
        await waitFor(() => expect(mocksearchColumn).toBeCalled());
    });
});
