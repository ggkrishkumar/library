/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./example.css";
import Grid from "../src/index";
import FlightIcon from "./images/FlightIcon.png";
import { fetchData } from "./getData";
import { getValueOfDate } from "./utils/DateUtility";
import FlightEdit from "./cells/FlightEdit";
import SrEdit from "./cells/SrEdit";
import SegmentEdit from "./cells/SegmentEdit";
import RowAction from "./cells/RowAction";
import RowEdit from "./cells/RowEdit";
import RowDelete from "./cells/RowDelete";

const GridComponent = (props) => {
    const {
        allProps,
        className,
        title,
        gridHeight,
        gridWidth,
        rowsToOverscan,
        passColumnToExpand,
        passRowActions,
        passGetRowInfo,
        passOnGridRefresh,
        hasPagination,
        CustomPanel,
        enableGroupHeaders,
        enableJsxHeaders,
        gridHeader,
        rowSelector,
        globalSearch,
        columnFilter,
        groupSort,
        columnChooser,
        exportData,
        fileName,
        rowsForSelection,
        passIdAttribute,
        expandableColumn,
        multiRowSelection,
        passTheme,
        enableServersideSorting,
        treeStructure,
        parentRowExpandable,
        parentRowsToExpand
    } = props;
    const idAttribute = "travelId";
    const parentIdAttribute = "titleId";
    const gridPageSize = 300;
    const paginationType = "index"; // or - "cursor" - if Gris is tree view and parentRowExpandable is false, then paginationType should be "index"
    // State for holding index page info
    const [indexPageInfo, setIndexPageInfo] = useState({
        pageNum: 1,
        pageSize: gridPageSize,
        total: 20000,
        lastPage: false
    });
    // State for holding cursor page info
    const [cursorPageInfo, setCursorPageInfo] = useState({
        endCursor: 299,
        pageSize: gridPageSize,
        total: 20000,
        lastPage: false
    });
    // State for holding grid data
    const [gridData, setGridData] = useState([]);
    // State for holding Original grid data, to be used while clearing group sort
    const [originalGridData, setOriginalGridData] = useState([]);
    // State for holding group sort options
    const [sortOptions, setSortOptions] = useState([]);
    // State for holding selected rows
    const [userSelectedRows, setUserSelectedRows] = useState([]);
    // State for holding rows to deselect
    const [rowsToDeselect, setRowsToDeselect] = useState([]);
    // State for holding rows to select
    const [rowsToSelect, setRowsToSelect] = useState([]);

    const [isEditOverlayOpened, setIsEditOverlayOpened] = useState(false);
    const [rowDataToEdit, setRowDataToEdit] = useState(null);

    const [isDeleteOverlayOpened, setIsDeleteOverlayOpened] = useState(false);
    const [rowDataToDelete, setRowDataToDelete] = useState(null);

    const isParentExpandedByDefault =
        treeStructure &&
        parentRowExpandable !== false &&
        parentRowsToExpand &&
        parentRowsToExpand.length > 0;

    // Loginc for sorting data
    const compareValues = (compareOrder, v1, v2) => {
        let returnValue = 0;
        if (compareOrder === "Ascending") {
            if (v1 > v2) {
                returnValue = 1;
            } else if (v1 < v2) {
                returnValue = -1;
            }
            return returnValue;
        }
        if (v1 < v2) {
            returnValue = 1;
        } else if (v1 > v2) {
            returnValue = -1;
        }
        return returnValue;
    };
    // Return sorted data based on the parameters
    const getSortedData = (data, sortValues) => {
        if (data && data.length > 0 && sortValues && sortValues.length > 0) {
            if (
                treeStructure &&
                parentIdAttribute !== null &&
                parentIdAttribute !== undefined
            ) {
                const sortedTreeData = data.map((dataItem) => {
                    const sortedDataItem = dataItem;
                    const { childData } = dataItem;
                    if (childData) {
                        const childRows = childData.data;
                        if (childRows && childRows.length > 0) {
                            const sortedData = childRows.sort((x, y) => {
                                let compareResult = 0;
                                sortValues.forEach((option) => {
                                    const { sortBy, sortOn, order } = option;
                                    const newResult =
                                        sortOn === "value"
                                            ? compareValues(
                                                  order,
                                                  x[sortBy],
                                                  y[sortBy]
                                              )
                                            : compareValues(
                                                  order,
                                                  x[sortBy][sortOn],
                                                  y[sortBy][sortOn]
                                              );
                                    compareResult = compareResult || newResult;
                                });
                                return compareResult;
                            });
                            sortedDataItem.childData.data = sortedData;
                        }
                    }
                    return sortedDataItem;
                });
                return sortedTreeData;
            }
            return data.sort((x, y) => {
                let compareResult = 0;
                sortValues.forEach((option) => {
                    const { sortBy, sortOn, order } = option;
                    const newResult =
                        sortOn === "value"
                            ? compareValues(order, x[sortBy], y[sortBy])
                            : compareValues(
                                  order,
                                  x[sortBy][sortOn],
                                  y[sortBy][sortOn]
                              );
                    compareResult = compareResult || newResult;
                });
                return compareResult;
            });
        }
        return data;
    };

    const parentData = [
        {
            titleId: 0,
            title: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39"
        },
        {
            titleId: 1,
            title: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39"
        },
        {
            titleId: 2,
            title: "EXCVGRATES",
            count: 1,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39"
        }
    ];

    const airportCodeList = [
        "AAA",
        "AAB",
        "AAC",
        "ABA",
        "ABB",
        "ABC",
        "ACA",
        "ACB",
        "ACC",
        "BAA",
        "BAB",
        "BAC",
        "BBA",
        "BBB",
        "BBC",
        "BCA",
        "BCB",
        "BCC",
        "CAA",
        "CAB",
        "CAC",
        "CBA",
        "CBB",
        "CBC",
        "CCA",
        "CCB",
        "CCC",
        "XXX",
        "XXY",
        "XXZ",
        "XYX",
        "XYY",
        "XYZ",
        "XZX",
        "XZY",
        "XZZ",
        "YXX",
        "YXY",
        "YXZ",
        "YYX",
        "YYY",
        "YYZ",
        "YZX",
        "YZY",
        "YZZ",
        "ZXX",
        "ZXY",
        "ZXZ",
        "ZYX",
        "ZYY",
        "ZYZ",
        "ZZX",
        "ZZY",
        "ZZZ"
    ];

    const originalColumns = [
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
                        <div className="travelId-details">
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
                    <div className="flightHeader">
                        <i className="flightIcon">
                            <img src={FlightIcon} alt="Flight Info" />
                        </i>
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
                        <div className="flight-details">
                            <DisplayTag columnKey="flight" cellKey="flightno">
                                <strong>{flightno}</strong>
                            </DisplayTag>
                            <DisplayTag columnKey="flight" cellKey="date">
                                <span>{getValueOfDate(date, "cell")}</span>
                            </DisplayTag>
                        </div>
                    );
                }
                return null;
            },
            editCell: (
                rowData,
                DisplayTag,
                rowUpdateCallBack,
                isDesktop,
                isExpandableColumn
            ) => {
                return (
                    <FlightEdit
                        rowData={rowData}
                        DisplayTag={DisplayTag}
                        rowUpdateCallBack={rowUpdateCallBack}
                    />
                );
            }
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
                        <div className="segment-details">
                            <DisplayTag columnKey="segment" cellKey="from">
                                <span>{from}</span>
                            </DisplayTag>
                            <i>
                                <img src={FlightIcon} alt="segment" />
                            </i>
                            <DisplayTag columnKey="segment" cellKey="to">
                                <span>{to}</span>
                            </DisplayTag>
                        </div>
                    );
                }
                return null;
            },
            editCell: (
                rowData,
                DisplayTag,
                rowUpdateCallBack,
                isDesktop,
                isExpandableColumn
            ) => {
                return (
                    <SegmentEdit
                        airportCodeList={airportCodeList}
                        rowData={rowData}
                        DisplayTag={DisplayTag}
                        rowUpdateCallBack={rowUpdateCallBack}
                    />
                );
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
                            <div className="details-wrap">
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
                        <div className="details-wrap">
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
                        <div className="weight-details">
                            <DisplayTag columnKey="weight" cellKey="percentage">
                                <strong className="per">{percentage}</strong>
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
                        <div className="weight-details">
                            <DisplayTag columnKey="volume" cellKey="percentage">
                                <strong className="per">{percentage}</strong>
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
                        <div className="uld-details">
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
                        <div className="revenue-details">
                            <DisplayTag columnKey="revenue" cellKey="revenue">
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
                        <div className="sr-details">
                            <span>{sr}</span>
                        </div>
                    );
                }
                return null;
            },
            editCell: (
                rowData,
                DisplayTag,
                rowUpdateCallBack,
                isDesktop,
                isExpandableColumn
            ) => {
                return (
                    <SrEdit
                        rowData={rowData}
                        rowUpdateCallBack={rowUpdateCallBack}
                    />
                );
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
                        <div className="queued-details">
                            <DisplayTag columnKey="queuedBooking" cellKey="sr">
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
    const [columns, setColumns] = useState([]);

    const originalColumnToExpand = {
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
                <div className="remarks-wrap details-wrap">
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
    const [columnToExpand, setColumnToExpand] = useState(null);

    const originalParentColumn = {
        Header: "ParentColumn",
        displayCell: (rowData) => {
            const { titleId, title, count, lastModified, date, time } = rowData;
            return (
                <div className="parentRow">
                    <h2 className="parentRowHead">
                        {title} ({count})
                    </h2>
                    <div className="parentRowInfo">
                        <span className="parentRowInfoType">
                            Last Modified : {lastModified}
                        </span>
                        <span className="parentRowInfoType">{date}</span>
                        <span className="parentRowInfoType">{time}</span>
                    </div>
                </div>
            );
        }
    };
    const [parentColumn, setParentColumn] = useState(null);

    const calculateRowHeight = (row, gridColumns) => {
        // Minimum height for each row
        let rowHeight = 50;
        if (gridColumns && gridColumns.length > 0 && row) {
            // Get properties of a row
            const { original, isExpanded } = row;
            // Find the column with maximum width configured, from grid columns list
            const columnWithMaxWidth = [...gridColumns].sort((a, b) => {
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
            if (
                isExpanded &&
                (passColumnToExpand || allProps) &&
                columnToExpand
            ) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    columnToExpand.innerCells &&
                    columnToExpand.innerCells.length > 0
                        ? columnToExpand.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    };

    const updateData = (data, originalRow, updatedRow) => {
        return data.map((row) => {
            let newRow = row;
            if (newRow[idAttribute] === originalRow[idAttribute]) {
                newRow = updatedRow;
            }
            return newRow;
        });
    };

    const onRowUpdate = (originalRow, updatedRow) => {
        setGridData((old) =>
            old.map((row) => {
                if (row) {
                    let rowToUpdate = row;
                    if (treeStructure) {
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                const newData = updateData(
                                    data,
                                    originalRow,
                                    updatedRow
                                );
                                rowToUpdate.childData.data = newData;
                            }
                        }
                    } else if (
                        rowToUpdate[idAttribute] === originalRow[idAttribute]
                    ) {
                        rowToUpdate = updatedRow;
                    }
                    return rowToUpdate;
                }
                return row;
            })
        );
        setOriginalGridData((old) =>
            old.map((row) => {
                if (row) {
                    let rowToUpdate = row;
                    if (treeStructure) {
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                const newData = updateData(
                                    data,
                                    originalRow,
                                    updatedRow
                                );
                                rowToUpdate.childData.data = newData;
                            }
                        }
                    } else if (
                        rowToUpdate[idAttribute] === originalRow[idAttribute]
                    ) {
                        rowToUpdate = updatedRow;
                    }
                    return rowToUpdate;
                }
                return row;
            })
        );
    };

    const onRowDelete = (originalRow) => {
        if (treeStructure) {
            setGridData((old) =>
                old.map((row) => {
                    if (row) {
                        const rowToUpdate = row;
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                rowToUpdate.childData.data = data.filter(
                                    (dataItem) => {
                                        return (
                                            dataItem[idAttribute] !==
                                            originalRow[idAttribute]
                                        );
                                    }
                                );
                            }
                        }
                        return rowToUpdate;
                    }
                    return row;
                })
            );
            setOriginalGridData((old) =>
                old.map((row) => {
                    if (row) {
                        const rowToUpdate = row;
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                rowToUpdate.childData.data = data.filter(
                                    (dataItem) => {
                                        return (
                                            dataItem[idAttribute] !==
                                            originalRow[idAttribute]
                                        );
                                    }
                                );
                            }
                        }
                        return rowToUpdate;
                    }
                    return row;
                })
            );
        } else {
            setGridData((old) =>
                old.filter((row) => {
                    return row[idAttribute] !== originalRow[idAttribute];
                })
            );
            setOriginalGridData((old) =>
                old.filter((row) => {
                    return row[idAttribute] !== originalRow[idAttribute];
                })
            );
            if (paginationType === "index") {
                setIndexPageInfo({
                    ...indexPageInfo,
                    total: indexPageInfo.total - 1
                });
            } else {
                setCursorPageInfo({
                    ...cursorPageInfo,
                    total: indexPageInfo.total - 1
                });
            }
        }
    };

    const onRowSelect = (selectedRows, deSelectedRows) => {
        console.log("Rows selected: ");
        console.log(selectedRows);
        console.log("Rows deselected: ");
        console.log(deSelectedRows);
        if (allProps || passIdAttribute) {
            setUserSelectedRows(selectedRows);
            // If a row is deselected, remove that row details from 'rowsToSelect' prop value (if present).
            if (deSelectedRows && deSelectedRows.length > 0) {
                const rowExistingSelection = rowsToSelect.find((rowId) => {
                    const deselectedRow = deSelectedRows.find(
                        (row) => row.travelId === rowId
                    );
                    if (deselectedRow) {
                        return true;
                    }
                    return false;
                });
                if (rowExistingSelection) {
                    setRowsToSelect(
                        rowsToSelect.filter((rowId) => {
                            const deselectedRow = deSelectedRows.find(
                                (row) => row.travelId === rowId
                            );
                            if (deselectedRow) {
                                return false;
                            }
                            return true;
                        })
                    );
                }
            }
            // If a row is selected, remove that row details from 'rowsToDeselect' prop value (if present).
            if (selectedRows && selectedRows.length > 0) {
                const rowExistingDeselection = rowsToDeselect.find((rowId) => {
                    const selectedRow = selectedRows.find(
                        (row) => row.travelId === rowId
                    );
                    if (selectedRow) {
                        return true;
                    }
                    return false;
                });
                if (rowExistingDeselection) {
                    setRowsToDeselect(
                        rowsToDeselect.filter((rowId) => {
                            const selectedRow = selectedRows.find(
                                (row) => row.travelId === rowId
                            );
                            if (selectedRow) {
                                return false;
                            }
                            return true;
                        })
                    );
                }
            }
        }
    };

    const onGridRefresh = () => {
        console.log("Grid Refreshed");
    };

    const bindRowEditOverlay = (rowData) => {
        setRowDataToEdit(rowData);
        setIsEditOverlayOpened(true);
    };
    const unbindRowEditOverlay = () => {
        setRowDataToEdit(null);
        setIsEditOverlayOpened(false);
    };

    const bindRowDeleteOverlay = (rowData) => {
        setRowDataToDelete(rowData);
        setIsDeleteOverlayOpened(true);
    };
    const unbindRowDeleteOverlay = () => {
        setRowDataToDelete(null);
        setIsDeleteOverlayOpened(false);
    };

    const rowActions = (rowData, closeOverlay) => {
        return (
            <RowAction
                rowData={rowData}
                closeOverlay={closeOverlay}
                bindRowEditOverlay={bindRowEditOverlay}
                bindRowDeleteOverlay={bindRowDeleteOverlay}
            />
        );
    };

    const loadMoreData = (updatedPageInfo, parentId) => {
        if (parentId !== null && parentId !== undefined) {
            // Tree structure
            if (updatedPageInfo !== null && updatedPageInfo !== undefined) {
                // Next page loading
                const pageInfoForApi = { ...updatedPageInfo };
                if (pageInfoForApi.endCursor) {
                    pageInfoForApi.endCursor += pageInfoForApi.pageSize;
                }
                fetchData(pageInfoForApi).then((apiData) => {
                    if (apiData && apiData.length > 0) {
                        const updatedGridData = gridData.map((dataItem) => {
                            const updatedData = dataItem;
                            if (
                                updatedData[parentIdAttribute] === parentId &&
                                updatedData.childData &&
                                updatedData.childData.data &&
                                updatedData.childData.data.length > 0
                            ) {
                                updatedData.childData.data = [
                                    ...updatedData.childData.data,
                                    ...apiData
                                ];
                                if (paginationType === "index") {
                                    updatedData.childData.pageNum =
                                        pageInfoForApi.pageNum;
                                    if (
                                        pageInfoForApi.pageNum ===
                                        (parentId + 1) * 10
                                    ) {
                                        updatedData.childData.lastPage = true;
                                    }
                                } else {
                                    updatedData.childData.endCursor =
                                        pageInfoForApi.endCursor;
                                    if (
                                        pageInfoForApi.endCursor ===
                                        (parentId + 1) *
                                            10 *
                                            pageInfoForApi.pageSize -
                                            1
                                    ) {
                                        updatedData.childData.lastPage = true;
                                    }
                                }
                            }
                            return updatedData;
                        });
                        setGridData(updatedGridData);
                        setOriginalGridData(updatedGridData);
                    }
                });
            } else {
                // First load
                const currentPageNum = parentId * 10 + 1;
                const pageInfoForApi =
                    paginationType === "index"
                        ? {
                              pageNum: currentPageNum,
                              pageSize: gridPageSize
                          }
                        : {
                              endCursor: currentPageNum * gridPageSize - 1,
                              pageSize: gridPageSize
                          };

                fetchData(pageInfoForApi).then((apiData) => {
                    if (apiData && apiData.length > 0) {
                        const updatedGridData = gridData.map((dataItem) => {
                            const updatedData = dataItem;
                            if (updatedData[parentIdAttribute] === parentId) {
                                updatedData.childData = {
                                    pageNum: currentPageNum,
                                    pageSize: gridPageSize,
                                    lastPage: parentId === 2,
                                    data: apiData
                                };
                                if (paginationType === "index") {
                                    updatedData.childData.pageNum =
                                        pageInfoForApi.pageNum;
                                } else {
                                    updatedData.childData.endCursor =
                                        pageInfoForApi.endCursor;
                                }
                            }
                            return updatedData;
                        });
                        setGridData(updatedGridData);
                        setOriginalGridData(updatedGridData);
                    }
                });
            }
        } else {
            const info = { ...updatedPageInfo };
            if (info.endCursor) {
                info.endCursor += info.pageSize;
            }
            fetchData(info).then((data) => {
                if (data && data.length > 0) {
                    setGridData(
                        getSortedData(gridData.concat(data), sortOptions)
                    );
                    setOriginalGridData(originalGridData.concat(data));
                    if (paginationType === "index") {
                        setIndexPageInfo({
                            ...indexPageInfo,
                            pageNum: updatedPageInfo.pageNum
                        });
                    } else {
                        setCursorPageInfo({
                            ...cursorPageInfo,
                            endCursor: info.endCursor
                        });
                    }
                } else if (paginationType === "index") {
                    setIndexPageInfo({
                        ...indexPageInfo,
                        pageNum: updatedPageInfo.pageNum,
                        lastPage: true
                    });
                } else {
                    setCursorPageInfo({
                        ...cursorPageInfo,
                        endCursor: info.endCursor,
                        lastPage: true
                    });
                }
            });
        }
    };

    const serverSideSorting = (groupSortOptions) => {
        console.log("Server side sort", groupSortOptions);
        if (groupSortOptions && groupSortOptions.length > 0) {
            setSortOptions(groupSortOptions);
            setGridData(getSortedData([...gridData], groupSortOptions));
        } else {
            setSortOptions([]);
            setGridData(originalGridData);
        }
    };

    useEffect(() => {
        if (treeStructure) {
            if (
                parentRowExpandable !== false &&
                isParentExpandedByDefault !== true
            ) {
                setGridData(parentData);
                setOriginalGridData(parentData);
                setIndexPageInfo(null);
                setCursorPageInfo(null);
                setParentColumn(originalParentColumn);
            } else {
                const newPageSize = 5;
                const newGridData = [...parentData];
                fetchData({ pageNum: 1, pageSize: newPageSize }).then(
                    (firstData) => {
                        if (firstData && firstData.length > 0) {
                            newGridData[0].childData = {
                                pageNum: 1,
                                pageSize: newPageSize,
                                lastPage: false,
                                data: firstData
                            };
                        }
                        fetchData({ pageNum: 11, pageSize: newPageSize }).then(
                            (secondData) => {
                                if (secondData && secondData.length > 0) {
                                    newGridData[1].childData = {
                                        pageNum: 11,
                                        pageSize: newPageSize,
                                        lastPage: false,
                                        data: secondData
                                    };
                                }
                                fetchData({
                                    pageNum: 21,
                                    pageSize: newPageSize
                                }).then((thirdData) => {
                                    if (thirdData && thirdData.length > 0) {
                                        newGridData[2].childData = {
                                            pageNum: 21,
                                            pageSize: newPageSize,
                                            lastPage: false,
                                            data: thirdData
                                        };
                                    }
                                    setGridData(newGridData);
                                    setOriginalGridData(newGridData);
                                    setIndexPageInfo(null);
                                    setCursorPageInfo(null);
                                    setParentColumn(originalParentColumn);
                                });
                            }
                        );
                    }
                );
            }
        } else {
            const pageInfo =
                paginationType === "index" ? indexPageInfo : cursorPageInfo;
            fetchData(pageInfo).then((data) => {
                if (data && data.length > 0) {
                    setGridData(data);
                    setOriginalGridData(data);
                    // Update local state based on rowsToSelect
                    if (rowsForSelection && rowsForSelection.length > 0) {
                        setRowsToSelect(rowsForSelection);
                        setUserSelectedRows(
                            data.filter((initialData) => {
                                const { travelId } = initialData;
                                return rowsForSelection.includes(travelId);
                            })
                        );
                    }
                } else if (paginationType === "index") {
                    setIndexPageInfo({
                        ...indexPageInfo,
                        lastPage: true
                    });
                } else {
                    setCursorPageInfo({
                        ...cursorPageInfo,
                        lastPage: true
                    });
                }
            });
        }
        const mappedOriginalColumns = originalColumns.map((column) => {
            const updatedColumn = column;
            if (!(allProps || enableGroupHeaders) && column.groupHeader) {
                delete updatedColumn.groupHeader;
            }
            if (!(allProps || enableJsxHeaders) && column.title) {
                // We know that jsx Header is been provided only for Flight column
                // Hence update the Header value to string "Flight" and delete title
                updatedColumn.Header = "Flight";
                delete updatedColumn.title;
            }
            return updatedColumn;
        });
        setColumns(mappedOriginalColumns);
        setColumnToExpand(originalColumnToExpand);
    }, []);

    const removeRowSelection = (event) => {
        const rowId = event.currentTarget.dataset.id;
        setRowsToDeselect([Number(rowId)]);
        // If a row is deselected, remove that row details from 'rowsToSelect' prop value (if present).
        setRowsToSelect(
            rowsToSelect.filter((selectedRowId) => {
                return selectedRowId !== Number(rowId);
            })
        );
        // Update local state based on updated rowsToSelect
        setUserSelectedRows(
            userSelectedRows.filter((row) => {
                const { travelId } = row;
                return travelId !== Number(rowId);
            })
        );
    };

    const theme = "portal";

    const gridPageInfo =
        paginationType === "index" ? indexPageInfo : cursorPageInfo;

    const getRowInfo = (rowData) => {
        const { travelId } = rowData;
        return {
            isRowExpandable: travelId % 2 === 0,
            isRowSelectable: travelId % 3 !== 0,
            className: travelId % 10 === 0 ? "disabled" : ""
        };
    };

    if (gridData && gridData.length > 0 && columns && columns.length > 0) {
        return (
            <div className={passTheme ? "sample-bg" : ""}>
                <div className="selectedRows">
                    {userSelectedRows.map((row) => {
                        return (
                            <div className="selectedRow" key={row.travelId}>
                                <p>Travel Id : {row.travelId}</p>
                                <button
                                    type="button"
                                    onClick={removeRowSelection}
                                    data-id={row.travelId}
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
                {isEditOverlayOpened && rowDataToEdit !== null ? (
                    <div className="overlay">
                        <RowEdit
                            rowData={rowDataToEdit}
                            airportCodeList={airportCodeList}
                            onRowUpdate={onRowUpdate}
                            unbindRowEditOverlay={unbindRowEditOverlay}
                        />
                    </div>
                ) : null}
                {isDeleteOverlayOpened && rowDataToDelete !== null ? (
                    <div className="overlay">
                        <RowDelete
                            rowData={rowDataToDelete}
                            onRowDelete={onRowDelete}
                            unbindRowDeleteOverlay={unbindRowDeleteOverlay}
                        />
                    </div>
                ) : null}
                <Grid
                    className={className}
                    theme={passTheme ? theme : null}
                    title={title}
                    gridHeight={gridHeight}
                    gridWidth={gridWidth}
                    gridData={gridData}
                    rowsToOverscan={rowsToOverscan}
                    idAttribute={allProps || passIdAttribute ? idAttribute : ""}
                    paginationType={
                        allProps || hasPagination ? paginationType : null
                    }
                    pageInfo={allProps || hasPagination ? gridPageInfo : null}
                    loadMoreData={loadMoreData}
                    serverSideSorting={
                        enableServersideSorting ? serverSideSorting : null
                    }
                    columns={columns}
                    columnToExpand={
                        allProps || passColumnToExpand ? columnToExpand : null
                    }
                    parentColumn={treeStructure ? parentColumn : null}
                    parentIdAttribute={treeStructure ? parentIdAttribute : null}
                    parentRowExpandable={
                        treeStructure === true && parentRowExpandable === false
                            ? parentRowExpandable
                            : null
                    }
                    parentRowsToExpand={
                        parentRowsToExpand && parentRowsToExpand.length > 0
                            ? parentRowsToExpand
                            : null
                    }
                    rowActions={allProps || passRowActions ? rowActions : null}
                    calculateRowHeight={calculateRowHeight}
                    expandableColumn={allProps || expandableColumn}
                    onRowUpdate={onRowUpdate}
                    onRowSelect={onRowSelect}
                    getRowInfo={allProps || passGetRowInfo ? getRowInfo : null}
                    onGridRefresh={
                        allProps || passOnGridRefresh ? onGridRefresh : null
                    }
                    CustomPanel={CustomPanel}
                    rowsToSelect={rowsToSelect}
                    rowsToDeselect={rowsToDeselect}
                    multiRowSelection={multiRowSelection}
                    gridHeader={allProps || gridHeader}
                    rowSelector={allProps || rowSelector}
                    globalSearch={allProps || globalSearch}
                    columnFilter={allProps || columnFilter}
                    groupSort={allProps || groupSort}
                    columnChooser={allProps || columnChooser}
                    exportData={allProps || exportData}
                    fileName={fileName || null}
                />
            </div>
        );
    }
    return (
        <h2 style={{ textAlign: "center", marginTop: "70px" }}>
            Initializing Grid...
        </h2>
    );
};

export default GridComponent;
