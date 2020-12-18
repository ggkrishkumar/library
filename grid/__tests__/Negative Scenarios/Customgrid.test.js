/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Customgrid from "../../src/Customgrid";

describe("render Customgrid", () => {
    function mockOffsetSize(width, height, scrollHeight) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
            configurable: true,
            value: height
        });
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
            configurable: true,
            value: scrollHeight
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
            Header: () => {
                return <span className="flightHeader">Flight</span>;
            },
            title: "Flight",
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
                <div className="remarks-wrap">
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

    const mockGridWidth = "100%";
    const mockTitle = "AWBs";
    const mockRowActions = jest.fn();
    const mockUpdateRowInGrid = jest.fn();
    const mockDeleteRowFromGrid = jest.fn();
    const mocksearchColumn = jest.fn((column, original, searchText) => {
        if (column && searchText) {
            return original;
        }
        return null;
    });
    const mockSelectBulkData = jest.fn();
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
    it("test grid with scroll height less than window height", () => {
        mockOffsetSize(600, 600, 400);
        const { getAllByTestId } = render(
            <Customgrid
                isDesktop
                title={mockTitle}
                gridWidth={mockGridWidth}
                managableColumns={gridColumns}
                expandedRowData={mockAdditionalColumn}
                gridData={gridData}
                idAttribute="travelId"
                updateRowInGrid={mockUpdateRowInGrid}
                deleteRowFromGrid={mockDeleteRowFromGrid}
                searchColumn={mocksearchColumn}
                onRowSelect={mockSelectBulkData}
                isExpandContentAvailable={mockIsExpandContentAvailable}
                displayExpandedContent={mockDisplayExpandedContent}
                rowActions={mockRowActions}
                hasNextPage={mockHasNextPage}
                isNextPageLoading={mockIsNextPageLoading}
                loadNextPage={mockLoadNextPage}
                getSortedData={mockGetSortedData}
            />
        );
        // Test number of rows
        const rowsCount = getAllByTestId("gridrow").length;
        expect(rowsCount).toBe(16);
    });
    it("test grid with scroll height greater than window height", () => {
        mockOffsetSize(600, 600, 800);
        const { getAllByTestId } = render(
            <Customgrid
                isDesktop
                title={mockTitle}
                gridWidth={mockGridWidth}
                managableColumns={gridColumns}
                expandedRowData={mockAdditionalColumn}
                gridData={gridData}
                idAttribute="travelId"
                updateRowInGrid={mockUpdateRowInGrid}
                deleteRowFromGrid={mockDeleteRowFromGrid}
                searchColumn={mocksearchColumn}
                onRowSelect={mockSelectBulkData}
                isExpandContentAvailable={mockIsExpandContentAvailable}
                displayExpandedContent={mockDisplayExpandedContent}
                rowActions={mockRowActions}
                hasNextPage={mockHasNextPage}
                isNextPageLoading={mockIsNextPageLoading}
                loadNextPage={mockLoadNextPage}
                getSortedData={mockGetSortedData}
            />
        );
        // Test number of rows
        const rowsCount = getAllByTestId("gridrow").length;
        expect(rowsCount).toBe(16);
    });
});
