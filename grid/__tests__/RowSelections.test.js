/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
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
            isSearchable: true,
            sortValue: "flightno",
            Cell: mockDisplayCell
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

    const data = [
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
        }
    ];
    for (let i = 1; i < 50; i++) {
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

    const mockUpdateRowData = jest.fn();
    const mockDeleteRowData = jest.fn();
    const mockSelectBulkData = jest.fn();

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("test multi row selections", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={gridColumns}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Find checkboxes
        let rowSelectors = getAllByTestId("rowSelector-singleRow");
        expect(rowSelectors.length).toBeGreaterThan(0);

        // Select first row
        const firstRowSelector = rowSelectors[0];
        act(() => {
            firstRowSelector.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Selected checkbox count should be 1
        let selectedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(1);

        // Select second row
        rowSelectors = getAllByTestId("rowSelector-singleRow");
        const secondRowSelector = rowSelectors[1];
        act(() => {
            secondRowSelector.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Selected checkbox count should be 2 now
        selectedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(2);
    });

    it("test single row selections", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={gridColumns}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                multiRowSelection={false}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Find checkboxes
        let rowSelectors = getAllByTestId("rowSelector-singleRow");
        expect(rowSelectors.length).toBeGreaterThan(0);

        // Select first row
        let rowSelector = rowSelectors[0];
        act(() => {
            rowSelector.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Selected checkbox count should be 1
        let selectedCheckboxes = document.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(1);

        // Select second row
        rowSelectors = getAllByTestId("rowSelector-singleRow");
        rowSelector = rowSelectors[1];
        act(() => {
            rowSelector.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Selected checkbox count should still be 1
        selectedCheckboxes = document.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(1);
    });

    it("test rows to select", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={gridColumns}
                onRowUpdate={mockUpdateRowData}
                onRowDelete={mockDeleteRowData}
                onRowSelect={mockSelectBulkData}
                rowsToSelect={[0, 1, 2]}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Selected checkbox count should be 1
        const selectedCheckboxes = document.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(3);
    });
});
