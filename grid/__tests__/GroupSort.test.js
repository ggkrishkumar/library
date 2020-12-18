/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Grid from "../src/index";
import GroupSort from "../src/Overlays/groupsort";

describe("Group sort functionality test", () => {
    const mockOffsetSize = (width, height, scrollHeight) => {
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
    };

    const getColumns = (mockFlightEdit) => {
        return [
            {
                Header: "Id",
                accessor: "travelId",
                width: 50,
                disableFilters: true,
                isSearchable: true,
                isSortable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    const { travelId } = rowData;
                    if (travelId !== null && travelId !== undefined) {
                        return (
                            <div
                                className="travelId-details"
                                data-testid="cell-travelid"
                            >
                                <span>{travelId}</span>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                groupHeader: "Flight & Segment",
                Header: () => {
                    return (
                        <div
                            className="flightHeader"
                            data-testid="header-flight"
                        >
                            <span className="flightText">Info</span>
                        </div>
                    );
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
                        isSearchable: true
                    }
                ],
                sortValue: "flightno",
                isSearchable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.flight) {
                        const { flightno, date } = rowData.flight;
                        return (
                            <div
                                className="flight-details"
                                data-testid="cell-flight"
                            >
                                <DisplayTag
                                    columnKey="flight"
                                    cellKey="flightno"
                                >
                                    <strong>{flightno}</strong>
                                </DisplayTag>
                                <DisplayTag columnKey="flight" cellKey="date">
                                    <span>{date}</span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                },
                editCell: mockFlightEdit
            },
            {
                groupHeader: "Flight & Segment",
                Header: "Segment",
                accessor: "segment",
                width: 100,
                isSortable: true,
                innerCells: [
                    {
                        Header: "From",
                        accessor: "from",
                        isSortable: true,
                        isSearchable: true
                    },
                    {
                        Header: "To",
                        accessor: "to",
                        isSortable: true,
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
                    if (rowData.segment) {
                        const { from, to } = rowData.segment;
                        return (
                            <div
                                className="segment-details"
                                data-testid="cell-segment"
                            >
                                <DisplayTag columnKey="segment" cellKey="from">
                                    <span>{from}</span>
                                </DisplayTag>
                                <DisplayTag columnKey="segment" cellKey="to">
                                    <span>{to}</span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Details",
                accessor: "details",
                onlyInDesktop: true,
                width: 300,
                innerCells: [
                    {
                        Header: "Flight Model",
                        accessor: "flightModel",
                        isSearchable: true
                    },
                    {
                        Header: "Body Type",
                        accessor: "bodyType",
                        isSearchable: true
                    },
                    {
                        Header: "Type",
                        accessor: "type",
                        isSearchable: true
                    },
                    {
                        Header: "Start Time",
                        accessor: "startTime",
                        isSearchable: true
                    },
                    {
                        Header: "End Time",
                        accessor: "endTime",
                        isSearchable: true
                    },
                    {
                        Header: "Status",
                        accessor: "status",
                        isSearchable: true
                    },
                    {
                        Header: "Additional Status",
                        accessor: "additionalStatus",
                        isSearchable: true
                    },
                    {
                        Header: "Time Status",
                        accessor: "timeStatus",
                        isSearchable: true
                    }
                ],
                disableSortBy: true,
                isSearchable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.details) {
                        const {
                            startTime,
                            endTime,
                            status,
                            additionalStatus,
                            flightModel,
                            bodyType,
                            type,
                            timeStatus
                        } = rowData.details;
                        const timeStatusArray = timeStatus
                            ? timeStatus.split(" ")
                            : [];
                        const timeValue = timeStatusArray.shift();
                        const timeText = timeStatusArray.join(" ");
                        if (
                            isExpandableColumn === null ||
                            isExpandableColumn === true
                        ) {
                            return (
                                <div
                                    className="details-wrap"
                                    data-testid="cell-details-fullData"
                                >
                                    <ul>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="startTime"
                                            >
                                                {startTime}
                                            </DisplayTag>
                                            -
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="endTime"
                                            >
                                                {endTime}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="status"
                                            >
                                                <span>{status}</span>
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="additionalStatus"
                                            >
                                                {additionalStatus}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="flightModel"
                                            >
                                                {flightModel}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="bodyType"
                                            >
                                                {bodyType}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <span>
                                                <DisplayTag
                                                    columnKey="details"
                                                    cellKey="type"
                                                >
                                                    {type}
                                                </DisplayTag>
                                            </span>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="timeStatus"
                                            >
                                                <strong>{timeValue} </strong>
                                                <span>{timeText}</span>
                                            </DisplayTag>
                                        </li>
                                    </ul>
                                </div>
                            );
                        }
                        return (
                            <div
                                className="details-wrap"
                                data-testid="cell-details-smallData"
                            >
                                <ul>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="startTime"
                                        >
                                            {startTime}
                                        </DisplayTag>
                                        -
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="endTime"
                                        >
                                            {endTime}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="status"
                                        >
                                            <span>{status}</span>
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="flightModel"
                                        >
                                            {flightModel}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="bodyType"
                                        >
                                            {bodyType}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <span>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="type"
                                            >
                                                {type}
                                            </DisplayTag>
                                        </span>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="timeStatus"
                                        >
                                            <strong>{timeValue} </strong>
                                            <span>{timeText}</span>
                                        </DisplayTag>
                                    </li>
                                </ul>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Weight",
                accessor: "weight",
                width: 130,
                isSortable: true,
                innerCells: [
                    {
                        Header: "Percentage",
                        accessor: "percentage",
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
                sortValue: "percentage",
                isSearchable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.weight) {
                        const { percentage, value } = rowData.weight;
                        const splitValue = value ? value.split("/") : [];
                        let valuePrefix;
                        let valueSuffix = "";
                        if (splitValue.length === 2) {
                            valuePrefix = splitValue[0];
                            valueSuffix = splitValue[1];
                        }
                        return (
                            <div
                                className="weight-details"
                                data-testid="cell-weight"
                            >
                                <DisplayTag
                                    columnKey="weight"
                                    cellKey="percentage"
                                >
                                    <strong className="per">
                                        {percentage}
                                    </strong>
                                </DisplayTag>
                                <DisplayTag columnKey="weight" cellKey="value">
                                    <span>
                                        <strong>{valuePrefix}/</strong>
                                        {valueSuffix}
                                    </span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Volume",
                accessor: "volume",
                width: 100,
                isSortable: true,
                innerCells: [
                    {
                        Header: "Percentage",
                        accessor: "percentage",
                        isSearchable: true
                    },
                    {
                        Header: "Value",
                        accessor: "value",
                        isSearchable: true
                    }
                ],
                sortValue: "percentage",
                isSearchable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.volume) {
                        const { percentage, value } = rowData.volume;
                        const splitValue = value ? value.split("/") : [];
                        let valuePrefix;
                        let valueSuffix = "";
                        if (splitValue.length === 2) {
                            valuePrefix = splitValue[0];
                            valueSuffix = splitValue[1];
                        }
                        return (
                            <div
                                className="weight-details"
                                data-testid="cell-volume"
                            >
                                <DisplayTag
                                    columnKey="volume"
                                    cellKey="percentage"
                                >
                                    <strong className="per">
                                        {percentage}
                                    </strong>
                                </DisplayTag>
                                <DisplayTag columnKey="volume" cellKey="value">
                                    <span>
                                        <strong>{valuePrefix}/</strong>
                                        {valueSuffix}
                                    </span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
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
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    const { uldPositions } = rowData;
                    if (uldPositions) {
                        return (
                            <div
                                className="uld-details"
                                data-testid="cell-uldPositions"
                            >
                                <ul>
                                    {uldPositions.map((positions, index) => {
                                        const { position, value } = positions;
                                        return (
                                            <li key={index}>
                                                <DisplayTag
                                                    columnKey="uldPositions"
                                                    cellKey="position"
                                                >
                                                    <span>
                                                        {positions.position}
                                                    </span>
                                                </DisplayTag>
                                                <DisplayTag
                                                    columnKey="uldPositions"
                                                    cellKey="value"
                                                >
                                                    <strong>
                                                        {positions.value}
                                                    </strong>
                                                </DisplayTag>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Revenue/Yield",
                accessor: "revenue",
                width: 120,
                innerCells: [
                    {
                        Header: "Revenue",
                        accessor: "revenue",
                        isSearchable: true
                    },
                    {
                        Header: "Yeild",
                        accessor: "yeild",
                        isSearchable: true
                    }
                ],
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.revenue) {
                        const { revenue, yeild } = rowData.revenue;
                        return (
                            <div
                                className="revenue-details"
                                data-testid="cell-revenue"
                            >
                                <DisplayTag
                                    columnKey="revenue"
                                    cellKey="revenue"
                                >
                                    <span className="large">{revenue}</span>
                                </DisplayTag>
                                <DisplayTag columnKey="revenue" cellKey="yeild">
                                    <span>{yeild}</span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                },
                sortValue: "revenue",
                isSearchable: true
            },
            {
                Header: "SR",
                accessor: "sr",
                width: 90,
                isSortable: true,
                isSearchable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    const { sr } = rowData;
                    if (sr) {
                        return (
                            <div className="sr-details" data-testid="cell-sr">
                                <span>{sr}</span>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Queued Booking",
                accessor: "queuedBooking",
                width: 130,
                innerCells: [
                    {
                        Header: "Sr",
                        accessor: "sr",
                        isSearchable: true
                    },
                    {
                        Header: "Volume",
                        accessor: "volume",
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
                    if (rowData.queuedBooking) {
                        const { sr, volume } = rowData.queuedBooking;
                        return (
                            <div
                                className="queued-details"
                                data-testid="cell-queuedbooking"
                            >
                                <DisplayTag
                                    columnKey="queuedBooking"
                                    cellKey="sr"
                                >
                                    <span>
                                        <strong>{sr}</strong>
                                    </span>
                                </DisplayTag>
                                <DisplayTag
                                    columnKey="queuedBooking"
                                    cellKey="volume"
                                >
                                    <span>
                                        <strong>{volume}</strong>
                                    </span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
            }
        ];
    };

    const getGridData = () => {
        // Data with Null and Undefined values
        const newResult = [
            {
                travelId: null,
                flight: null,
                segment: {
                    from: null,
                    to: null
                },
                details: {
                    flightModel: null,
                    bodyType: null,
                    type: null,
                    startTime: null,
                    endTime: null,
                    status: null,
                    additionalStatus: null,
                    timeStatus: null
                },
                weight: {
                    percentage: null,
                    value: null
                },
                volume: {
                    percentage: null,
                    value: null
                },
                uldPositions: [
                    {
                        position: null,
                        value: null
                    },
                    {
                        position: null,
                        value: null
                    },
                    {
                        position: null,
                        value: null
                    },
                    {
                        position: null,
                        value: null
                    }
                ],
                revenue: {
                    revenue: null,
                    yeild: null
                },
                sr: null,
                queuedBooking: {
                    sr: null,
                    volume: null
                },
                remarks: null
            },
            {
                travelId: undefined,
                flight: undefined,
                segment: {
                    from: undefined,
                    to: undefined
                },
                details: {
                    flightModel: undefined,
                    bodyType: undefined,
                    type: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    status: undefined,
                    additionalStatus: undefined,
                    timeStatus: undefined
                },
                weight: {
                    percentage: undefined,
                    value: undefined
                },
                volume: {
                    percentage: undefined,
                    value: undefined
                },
                uldPositions: [
                    {
                        position: undefined,
                        value: undefined
                    },
                    {
                        position: undefined,
                        value: undefined
                    },
                    {
                        position: undefined,
                        value: undefined
                    },
                    {
                        position: undefined,
                        value: undefined
                    }
                ],
                revenue: {
                    revenue: undefined,
                    yeild: undefined
                },
                sr: undefined,
                queuedBooking: {
                    sr: undefined,
                    volume: undefined
                },
                remarks: undefined
            }
        ];
        // Data with valid values
        const data = [];
        for (let i = 0; i < 50; i++) {
            data.push({
                travelId: i,
                flight: {
                    flightno: Math.ceil(1000 + Math.random() * (9999 - 1000)),
                    date: "23-May-2016"
                },
                segment: {
                    from: i % 2 === 0 ? "AAA" : "BBB",
                    to: i % 2 === 0 ? "XXX" : "YYY"
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
        return [...newResult, ...data];
    };

    const mockColumnsWithGroupSort = getColumns();
    const mockColumnsWithoutGroupSort = getColumns().map((col) => {
        const updatedCol = { ...col };
        if (updatedCol) {
            delete updatedCol.isSortable;
            const { innerCells } = updatedCol;
            if (innerCells && innerCells.length > 0) {
                updatedCol.innerCells = innerCells.map((cell) => {
                    const updatedCell = cell;
                    delete updatedCell.isSortable;
                    return updatedCell;
                });
            }
        }
        return updatedCol;
    });
    const mockColumnsWithDefaultSortHavingInnerCells = getColumns().map(
        (col, index) => {
            const updatedCol = { ...col };
            if (index === 0) {
                delete updatedCol.isSortable;
            }
            return updatedCol;
        }
    );
    const gridColumnsWithoutAccessor = [
        {
            Header: "Null Column",
            isSortable: true
        }
    ];
    const mockColumnCellWithoutAccessor = [
        {
            Header: "Null Column",
            isSortable: true
        },
        {
            Header: "Null Cell Column",
            accessor: "noAccessor",
            isSortable: true,
            innerCells: [
                {
                    Header: "Null Cell",
                    isSortable: true
                }
            ]
        }
    ];
    const mockData = getGridData();
    const mockServerSideSorting = jest.fn();
    const mockUpdateRowData = jest.fn();
    const mockSelectBulkData = jest.fn();

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("test group sort component without columns", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <GroupSort
                toggleGroupSortOverLay={undefined}
                groupSortOptions={null}
                gridColumns={[]}
                applyGroupSort={undefined}
            />
        );
        // Check if group sort overlay has been loaded
        const groupSortOverlay = container.querySelectorAll(
            "[data-testid='groupsortoverlay']"
        );
        expect(groupSortOverlay.length).toBe(0);
    });

    it("test group sort failing to add sort option with null column", () => {
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={gridColumnsWithoutAccessor}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check if Group osrt icon is present
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);

        // Open Group sort Icon
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if grid has been loaded
        const groupSortOverlay = getAllByTestId("groupsortoverlay");
        expect(groupSortOverlay.length).toBe(1);

        // Add sort
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options now, should be 0 as there are no columns with accessor
        const sortOptionsCount = gridContainer.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);

        // Clear all sort options
        const clearAllButton = getByTestId("clearSort");
        act(() => {
            clearAllButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("test group sort, add sort option with column having a cell without accessor", () => {
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockColumnCellWithoutAccessor}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check if Group osrt icon is present
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);

        // Open Group sort Icon
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if grid has been loaded
        const groupSortOverlay = getAllByTestId("groupsortoverlay");
        expect(groupSortOverlay.length).toBe(1);

        // Add sort
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options now, should be 0 as there are no columns with accessor
        const sortOptionsCount = getAllByTestId("sortItem").length;
        expect(sortOptionsCount).toBe(1);

        // Clear all sort options
        const clearAllButton = gridContainer.querySelectorAll(
            "[data-testid='clearSort']"
        )[0];
        act(() => {
            clearAllButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("test group sort icon to be hidden as columns don't have isSortable property", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockColumnsWithoutGroupSort}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check Group sort Icon
        const groupSortIcon = gridContainer.querySelectorAll(
            "[data-testid='toggleGroupSortOverLay']"
        );
        expect(groupSortIcon.length).toBe(0);
    });

    it("test group sort icon to be hidden as prop to hide group sort is passed", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockColumnsWithGroupSort}
                groupSort={false}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check Group sort Icon
        const groupSortIcon = gridContainer.querySelectorAll(
            "[data-testid='toggleGroupSortOverLay']"
        );
        expect(groupSortIcon.length).toBe(0);
    });

    it("test add, copy, delete and clear options, using gridColumns With Default Sort Having InnerCells", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockColumnsWithDefaultSortHavingInnerCells}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check Group sort Icon
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);

        // Open Group sort Icon
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options before adding sort, should be 0
        let sortOptionsCount = gridContainer.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);

        // Add sort option
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options now, should be 1
        sortOptionsCount = getAllByTestId("sortItem").length;
        expect(sortOptionsCount).toBe(1);

        // Copy sort option
        const copyIcon = getByTestId("sort-copy-icon");
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Check number of sort options now, should be 2
        sortOptionsCount = getAllByTestId("sortItem").length;
        expect(sortOptionsCount).toBe(2);

        // Change sortby option to the first sort option
        const sortBySelect = getAllByTestId("groupSort-sortBy")[1];
        fireEvent.change(sortBySelect, {
            target: { value: "travelId" }
        });

        // Change sortby option to the third sort option
        fireEvent.change(sortBySelect, {
            target: { value: "segment" }
        });

        // Delete Sort option
        const deleteIcon = getAllByTestId("sort-delete-icon")[0];
        act(() => {
            deleteIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options now, should be 1 now
        sortOptionsCount = getAllByTestId("sortItem").length;
        expect(sortOptionsCount).toBe(1);

        // Clear all sort options
        const clearAllButton = getByTestId("clearSort");
        act(() => {
            clearAllButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options now, should be 0 now
        sortOptionsCount = gridContainer.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);
    });

    it("test duplicate sort options", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockColumnsWithGroupSort}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check Group sort Icon
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);

        // Open Group sort Icon
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options before adding sort, should be 0
        let sortOptionsCount = gridContainer.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);

        // Add sort option
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options now, should be 1
        sortOptionsCount = getAllByTestId("sortItem").length;
        expect(sortOptionsCount).toBe(1);

        // Copy sort option
        const copyIcon = getByTestId("sort-copy-icon");
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Check number of sort options now, should be 2
        sortOptionsCount = getAllByTestId("sortItem").length;
        expect(sortOptionsCount).toBe(2);

        // Apply duplicate sort options
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check for error
        const errorMessages = getAllByTestId("duplicate-sort-error");
        expect(errorMessages.length).toBe(1);

        // Clear all sort options
        const clearAllButton = getByTestId("clearSort");
        act(() => {
            clearAllButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check number of sort options now, should be 0 now
        sortOptionsCount = gridContainer.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);
    });

    it("test adding and changing group sort options and apply group sort + along with row select to test useeffect [rowsToSelect, rowsToDeselect, gridData, groupSortOptions]", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockColumnsWithGroupSort}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        /* Select one row and then apply group sort. This will rigger the useeffect */

        // Find checkboxes
        const rowSelectors = getAllByTestId("rowSelector-singleRow");
        expect(rowSelectors.length).toBeGreaterThan(0);

        // Select first row
        act(() => {
            rowSelectors[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Selected checkbox count should be 1
        const selectedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(1);

        // Open Group sort Icon
        const groupSortIcon = getByTestId("toggleGroupSortOverLay");
        act(() => {
            groupSortIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Add sort link
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Count sort by
        const sortByOptions = getAllByTestId("groupSort-sortBy-Option");
        expect(sortByOptions.length).toBe(5);
        // Count sort on options
        let sortOnOptions = getAllByTestId("groupSort-sortOn-Option");
        expect(sortOnOptions.length).toBe(1);

        // Select third sort By option, that have multiple sory On options
        const sortBySelect = getByTestId("groupSort-sortBy");
        fireEvent.change(sortBySelect, {
            target: { value: "segment" }
        });
        // Count sort on options
        sortOnOptions = getAllByTestId("groupSort-sortOn-Option");
        expect(sortOnOptions.length).toBe(2);

        // Change sort on option
        const sortOnSelect = getByTestId("groupSort-sortOn");
        fireEvent.change(sortOnSelect, {
            target: { value: "to" }
        });

        // Change sort order
        const sortOrderSelect = getByTestId("groupSort-order");
        fireEvent.change(sortOrderSelect, {
            target: { value: "Descending" }
        });

        // Apply sort
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Sort overlay should have been closed
        const groupSortOverlay = gridContainer.querySelectorAll(
            "[data-testid='groupsortoverlay']"
        );
        expect(groupSortOverlay.length).toBe(0);
    });

    it("test server side group sorting", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                serverSideSorting={mockServerSideSorting}
                columns={mockColumnsWithGroupSort}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Group sort Icon
        const groupSortIcon = getByTestId("toggleGroupSortOverLay");
        act(() => {
            groupSortIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Add sort link
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Apply sort
        const saveGroupSort = getByTestId("saveSort");
        act(() => {
            saveGroupSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(mockServerSideSorting).toBeCalled();
    });

    it("Drag and Drop", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockColumnsWithGroupSort}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );

        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check Group sort Icon
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);

        // Open Group sort Icon
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // adding a new sort
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if drag and drop options are available
        let dndOptions = getAllByTestId("sortItemDnd");
        expect(dndOptions.length).toBe(1);

        const firstNode = dndOptions[0];

        // Do drag and don't do drop there itself
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 0, clientY: 0 })
            );
        });

        // Copy sort option
        const copyIcon = getAllByTestId("sort-copy-icon")[0];
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Copy sort option again
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Check if drag and drop options are available
        dndOptions = getAllByTestId("sortItemDnd");
        expect(dndOptions.length).toBe(3);

        const secondNode = dndOptions[1];
        const lastNode = dndOptions[2];

        // Do drag and drop from 0 to 1
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        act(() => {
            secondNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 0, clientY: 1 })
            );
        });

        // Do drag and drop from 0 to 2
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        act(() => {
            lastNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 0, clientY: 150 })
            );
        });

        // Do drag and don't do drop - false case
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        fireEvent.dragEnd(firstNode);
    });
});
