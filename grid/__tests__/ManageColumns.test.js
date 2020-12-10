/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import Grid from "../src/index";
import ManageColumn from "../src/Overlays/managecolumns";

describe("Column manage functionality test", () => {
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
                Header: "Null column"
            },
            {
                Header: "Null column cell",
                innerCells: [
                    {
                        Header: "Null cell"
                    }
                ]
            },
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

    const getColumnToExpand = () => {
        return {
            Header: "Remarks",
            innerCells: [
                { Header: "Remarks", accessor: "remarks" },
                { Header: "Details", onlyInTablet: true, accessor: "details" }
            ],
            displayCell: (rowData, DisplayTag, isDesktop) => {
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
                } = details || {};
                const timeStatusArray = timeStatus ? timeStatus.split(" ") : [];
                const timeValue = timeStatusArray.shift();
                const timeText = timeStatusArray.join(" ");
                return (
                    <div
                        className="remarks-wrap details-wrap"
                        data-testid="expandcell"
                    >
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
            }
        };
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
        return [...newResult, ...data];
    };

    const mockGridColumns = getColumns();
    const mockAdditionalColumn = getColumnToExpand();
    const mockData = getGridData();

    afterEach(cleanup);
    let mockContainer;
    beforeAll(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });

    it("test manage column component without columns", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <ManageColumn
                toggleManageColumnsOverlay={undefined}
                columns={[]}
                originalColumns={[]}
                additionalColumn={null}
                originalAdditionalColumn={null}
                updateColumnStructure={undefined}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check if manage columns overlay has been loaded
        const manageColumnOverlay = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        );
        expect(manageColumnOverlay.length).toBe(0);
    });

    it("test manage column icon to be hidden as prop to hide group sort is passed", () => {
        mockOffsetSize(1280, 1024);
        const { container } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnChooser={false}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check Column chooser Icon
        const columnChooserIcon = gridContainer.querySelectorAll(
            "[data-testid='toggleManageColumnsOverlay']"
        );
        expect(columnChooserIcon.length).toBe(0);
    });

    it("test appy and reset after checking/unchecking column and additional column checkbox", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Column chooser overlay
        let columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check column and additional column boxes count in the column setting portion (should be 10 and 1)
        let columnsCount = getAllByTestId("column-box").length;
        let additionalColumnsCount = getAllByTestId("additional-column-box")
            .length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(1);

        // Un check Id column checkbox
        let idCheckbox = getAllByTestId("selectSingleSearchableColumn")[2];
        fireEvent.click(idCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 9 and 1)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(1);

        // Un check Flight column checkbox (One from grouped columns)
        let flightCheckbox = getAllByTestId("selectSingleSearchableColumn")[3];
        fireEvent.click(flightCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 9 and 1)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(1);

        // Un check Flight column checkbox (Another one from grouped columns)
        let segmentCheckbox = getAllByTestId("selectSingleSearchableColumn")[4];
        fireEvent.click(segmentCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 8 and 1)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(8);
        expect(additionalColumnsCount).toBe(1);

        // Un check Remarks column checkbox
        let remarksCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[11];
        fireEvent.click(remarksCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 8 and 0)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(8);
        expect(additionalColumnsCount).toBe(0);

        // Try to apply changes
        let saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Open Column chooser overlay
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check column and additional column boxes count in the column setting portion (should be 8 and 0)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(8);
        expect(additionalColumnsCount).toBe(0);

        // Check Id column checkbox
        idCheckbox = getAllByTestId("selectSingleSearchableColumn")[2];
        fireEvent.click(idCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 9 and 0)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(0);

        // Check Flight column checkbox (One from grouped columns)
        flightCheckbox = getAllByTestId("selectSingleSearchableColumn")[3];
        fireEvent.click(flightCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 10 and 0)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(0);

        // Ceck Flight column checkbox (Another one from grouped columns)
        segmentCheckbox = getAllByTestId("selectSingleSearchableColumn")[4];
        fireEvent.click(segmentCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 10 and 0)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(0);

        // Check Remarks column checkbox
        remarksCheckbox = getAllByTestId("selectSingleSearchableColumn")[11];
        fireEvent.click(remarksCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 10 and 1)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(1);

        // Try to apply changes
        saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Open Column chooser overlay
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Reset Changes
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Close Overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("test appy and reset after checking/unchecking cells from column and additional column checkbox", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Column chooser overlay
        let columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check if Flight no inner cell is checked
        let flightNoCheckbox = getByTestId(
            "selectInnerCell_column_3_column_3_cell_0"
        );
        expect(flightNoCheckbox.checked).toBeTruthy();

        // Uncheck flight no cell
        fireEvent.click(flightNoCheckbox);
        expect(flightNoCheckbox.checked).toBeFalsy();

        // Check if Segment To inner cell is checked
        let segmentToCheckbox = getByTestId(
            "selectInnerCell_column_4_column_4_cell_1"
        );
        expect(segmentToCheckbox.checked).toBeTruthy();

        // Uncheck segment to cell
        fireEvent.click(segmentToCheckbox);
        expect(segmentToCheckbox.checked).toBeFalsy();

        // Check if Weight percentage inner cell is checked
        let weightPercentageCheckbox = getByTestId(
            "selectInnerCell_column_5_column_5_cell_0"
        );
        expect(weightPercentageCheckbox.checked).toBeTruthy();

        // Uncheck weight percentage cell
        fireEvent.click(weightPercentageCheckbox);
        expect(weightPercentageCheckbox.checked).toBeFalsy();

        // Check if Remarks inner cell is checked
        let remarksCheckbox = getByTestId(
            "selectInnerCell_rowExpand_rowExpand_cell_0"
        );
        expect(remarksCheckbox.checked).toBeTruthy();

        // Uncheck weight percentage cell
        fireEvent.click(remarksCheckbox);
        expect(remarksCheckbox.checked).toBeFalsy();

        // Try to apply changes
        let saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Open Column chooser overlay
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check if Flight no inner cell is checked
        flightNoCheckbox = getByTestId(
            "selectInnerCell_column_3_column_3_cell_0"
        );
        expect(flightNoCheckbox.checked).toBeFalsy();

        // Ccheck back flight no cell
        fireEvent.click(flightNoCheckbox);
        expect(flightNoCheckbox.checked).toBeTruthy();

        // Check if Segment To inner cell is checked
        segmentToCheckbox = getByTestId(
            "selectInnerCell_column_4_column_4_cell_1"
        );
        expect(segmentToCheckbox.checked).toBeFalsy();

        // Check back segment to cell
        fireEvent.click(segmentToCheckbox);
        expect(segmentToCheckbox.checked).toBeTruthy();

        // Check if Weight percentage inner cell is checked
        weightPercentageCheckbox = getByTestId(
            "selectInnerCell_column_5_column_5_cell_0"
        );
        expect(weightPercentageCheckbox.checked).toBeFalsy();

        // Check back weight percentage cell
        fireEvent.click(weightPercentageCheckbox);
        expect(weightPercentageCheckbox.checked).toBeTruthy();

        // Check if Remarks inner cell is checked
        remarksCheckbox = getByTestId(
            "selectInnerCell_rowExpand_rowExpand_cell_0"
        );
        expect(remarksCheckbox.checked).toBeFalsy();

        // Check back weight percentage cell
        fireEvent.click(remarksCheckbox);
        expect(remarksCheckbox.checked).toBeTruthy();

        // Try to apply changes
        saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Open Column chooser overlay
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Reset Changes
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Close Overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);
    });

    it("test column manage without additional column", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Column chooser overlay
        const columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check if box for additional column is not present
        let additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(additionalColumnsCount).toBe(0);

        // Check if checkbox for additional column is present
        const columnCheckboxCount = getAllByTestId(
            "selectSingleSearchableColumn"
        ).length;
        expect(columnCheckboxCount).toBe(11);

        // Un check select all columns checkbox
        const selectAllCheckBox = getByTestId("selectAllSearchableColumns");
        fireEvent.click(selectAllCheckBox);

        // Check column and additional column boxes count in the column setting portion (should be 0)
        let columnsCount = gridContainer.querySelectorAll(
            "[data-testid='column-box']"
        ).length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(0);
        expect(additionalColumnsCount).toBe(0);

        // Try to apply changes
        const saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if error message is present
        const errorMessages = getAllByTestId("column-chooser-error");
        expect(errorMessages.length).toBe(1);

        // Check back the select all checkbox
        fireEvent.click(selectAllCheckBox);

        // Check column and additional column boxes count
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(0);

        // Reset Changes
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Close Overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);
    });

    it(" test search columns + error scenarios", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Column chooser overlay
        let columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check checkboxes available for each column
        let columnCheckboxes = getAllByTestId("selectSingleSearchableColumn")
            .length;
        expect(columnCheckboxes).toBe(12);

        // Filter columns
        const filterList = getByTestId("filterColumnsList");
        expect(filterList.value).toBe("");
        fireEvent.change(filterList, { target: { value: "id" } });
        expect(filterList.value).toBe("id");

        // Check checkboxes available for each column
        columnCheckboxes = getAllByTestId("selectSingleSearchableColumn")
            .length;
        expect(columnCheckboxes).toBe(1);

        // Remove searched value
        fireEvent.change(filterList, { target: { value: "" } });
        expect(filterList.value).toBe("");
        // Check total count of checkboxes available now
        columnCheckboxes = getAllByTestId("selectSingleSearchableColumn")
            .length;
        expect(columnCheckboxes).toBe(12);

        // Check column and additional column boxes count in the column setting portion (should be 10 and 1)
        let columnsCount = getAllByTestId("column-box").length;
        let additionalColumnsCount = getAllByTestId("additional-column-box")
            .length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(1);

        // Un check select all columns checkbox
        let selectAllCheckBox = getByTestId("selectAllSearchableColumns");
        fireEvent.click(selectAllCheckBox);

        // Check column and additional column boxes count in the column setting portion (should be 0)
        columnsCount = gridContainer.querySelectorAll(
            "[data-testid='column-box']"
        ).length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(0);
        expect(additionalColumnsCount).toBe(0);

        // Try to apply changes
        let saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if error message is present
        let errorMessages = getAllByTestId("column-chooser-error");
        expect(errorMessages.length).toBe(1);

        // Check back the select all checkbox
        fireEvent.click(selectAllCheckBox);

        // Check column and additional column boxes count
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(1);

        // Try to apply changes
        saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Open Column chooser overlay
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Un check all columns again
        selectAllCheckBox = getByTestId("selectAllSearchableColumns");
        fireEvent.click(selectAllCheckBox);

        // Check column and additional column boxes count in the column setting portion (should be 0)
        columnsCount = gridContainer.querySelectorAll(
            "[data-testid='column-box']"
        ).length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(0);
        expect(additionalColumnsCount).toBe(0);

        // Check back additional column
        const remarksCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[11];
        fireEvent.click(remarksCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 0 and 1)
        columnsCount = gridContainer.querySelectorAll(
            "[data-testid='column-box']"
        ).length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(0);
        expect(additionalColumnsCount).toBe(1);

        // Try to apply changes
        saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if error message is present
        errorMessages = getAllByTestId("column-chooser-error");
        expect(errorMessages.length).toBe(1);

        // Reset Changes
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Close Overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("test drag and drop functionality", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId, getByTestId, container } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Column chooser overlay
        let columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check DnD options
        const columnDnds = getAllByTestId("columnItemDnd");
        expect(columnDnds).toHaveLength(10);
        const firstNode = columnDnds[0];
        const secondNode = columnDnds[1];
        const lastNode = columnDnds[2];

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

        // Do drag and drop from 0 to 1
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        act(() => {
            secondNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 50, clientY: 50 })
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
                createBubbledEvent("drop", { clientX: 100, clientY: 100 })
            );
        });

        // Do drag and don't do drop - false case
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        fireEvent.dragEnd(firstNode);

        // Try to apply changes
        const saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Open Column chooser overlay
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Reset Changes
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Close Overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);
    });
});
