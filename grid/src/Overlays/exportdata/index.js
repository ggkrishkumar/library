import React, { useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import update from "immutability-helper";
import JsPdf from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ColumnSearch from "../common/columnsSearch";
import {
    IconCsv,
    IconExcel,
    IconClose,
    IconPdf
} from "../../Utilities/SvgUtilities";
import { convertToIndividualColumns } from "../../Utilities/GridUtilities";

const ExportData = (props) => {
    const {
        isExportOverlayOpen,
        toggleExportDataOverlay,
        rows,
        columns,
        additionalColumn
    } = props;

    // Check if additional Column is present or not
    const isAdditionalColumnPresent =
        additionalColumn &&
        Object.keys(additionalColumn).length > 0 &&
        additionalColumn.innerCells &&
        additionalColumn.innerCells.length > 0;

    // Set state variables for:
    // managedColumns - main columns displayed in colum setting region
    // managedAdditionalColumn - additional column displayed in colum setting region
    // downloadTypes - types of downloads user has selected
    // warning - error message to be displayed
    const [managedColumns, setManagedColumns] = useState(
        JSON.parse(JSON.stringify(columns))
    );
    const [managedAdditionalColumn, setManagedAdditionalColumn] = useState(
        JSON.parse(JSON.stringify(additionalColumn))
    );
    const [downloadTypes, setDownloadTypes] = useState([]);
    const [warning, setWarning] = useState("");

    // Update display value of column based on columnId
    const updatedDisplayOfColumn = (column, columnid, flag) => {
        const updatedColumn = { ...column };
        const { isGroupHeader, columnId } = column;
        const groupedColumns = column.columns;
        if (
            isGroupHeader === true &&
            groupedColumns &&
            groupedColumns.length > 0
        ) {
            let atleastOneColumnDisplayed = false;
            const updatedColumns = [...groupedColumns].map((col) => {
                const updatedCol = col;
                if (
                    (columnid &&
                        (columnid === "all" || columnid === col.columnId)) ||
                    columnid === undefined
                ) {
                    updatedCol.display = flag;
                }
                atleastOneColumnDisplayed =
                    atleastOneColumnDisplayed || updatedCol.display;
                return updatedCol;
            });
            updatedColumn.display = atleastOneColumnDisplayed;
            updatedColumn.columns = updatedColumns;
        } else if (
            (columnid && (columnid === "all" || columnid === columnId)) ||
            columnid === undefined
        ) {
            updatedColumn.display = flag;
        }
        return updatedColumn;
    };

    // Update display value of managedAdditionalColumn state with given value
    const updatedDisplayOfAdditionalColumn = (flag) => {
        setManagedAdditionalColumn(
            update(managedAdditionalColumn, {
                display: { $set: flag }
            })
        );
    };

    // update the display flag value of column or all columns in managedColumns and managedAdditionalColumn state, based on the selection
    const updateColumns = (columnid, isadditionalcolumn, checked) => {
        if (
            columnid === "all" ||
            (isAdditionalColumnPresent && isadditionalcolumn === "true")
        ) {
            // Update additional column state if columnid is "all" or selected column has "isadditionalcolumn"
            updatedDisplayOfAdditionalColumn(checked);
        }
        if (isadditionalcolumn !== "true") {
            // Update main columns state based on selection and columnid, if selected column doesn't have "isadditionalcolumn"
            const updatedManagedColumns = [...managedColumns].map((column) => {
                return updatedDisplayOfColumn(column, columnid, checked);
            });
            setManagedColumns(
                update(managedColumns, {
                    $set: updatedManagedColumns
                })
            );
        }
    };

    const downloadPDF = (rowFilteredValues, rowFilteredHeader) => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const doc = new JsPdf(orientation, unit, size);

        doc.setFontSize(12);
        const title = "iCargo Neo Report";

        const content = {
            startY: 50,
            head: rowFilteredHeader,
            body: rowFilteredValues,
            tableWidth: "wrap", // 'auto'|'wrap'|'number'
            headStyles: { fillColor: [102, 102, 255] },
            theme: "grid", // 'striped'|'grid'|'plain'|'css'
            margin: { top: 30, right: 30, bottom: 10, left: 30 }
        };

        doc.text(title, 30, 40);
        doc.autoTable(content);
        doc.save("iCargo Neo Report.pdf");
    };

    const downloadCSVFile = async (filteredRowValue) => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".csv";
        const fileName = "iCargo Neo Report";
        const ws = XLSX.utils.json_to_sheet(filteredRowValue);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "csv", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        const href = await URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + fileExtension;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadXLSFile = async (filteredRowValue) => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "iCargo Neo Report";
        const ws = XLSX.utils.json_to_sheet(filteredRowValue);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        const href = await URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + fileExtension;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportRowData = () => {
        const filteredRow = [];
        const filteredRowValues = [];
        const filteredRowHeader = [];

        setWarning("");

        const filteredManagedColumns = convertToIndividualColumns(
            managedColumns
        ).filter((column) => {
            return column.display === true;
        });

        if (filteredManagedColumns.length > 0 && downloadTypes.length > 0) {
            const rowLength = rows && rows.length > 0 ? rows.length : 0;
            rows.forEach((rowDetails, index) => {
                const row = rowDetails.original;
                const filteredColumnVal = {};
                const rowFilteredValues = [];
                const rowFilteredHeader = [];
                filteredManagedColumns.forEach((columnName) => {
                    const { Header, accessor, innerCells } = columnName;
                    const isInnerCellsPresent =
                        innerCells && innerCells.length > 0;
                    const accessorRowValue = row[accessor];
                    let columnValue = "";
                    let columnHeader = "";
                    // For grid columns (not the one in expanded section)
                    if (accessor) {
                        if (
                            isInnerCellsPresent &&
                            typeof accessorRowValue === "object"
                        ) {
                            innerCells.forEach((cell) => {
                                if (cell.display === true) {
                                    const innerCellAccessor = cell.accessor;
                                    const innerCellHeader = cell.Header;
                                    const innerCellAccessorValue =
                                        accessorRowValue[innerCellAccessor];
                                    if (accessorRowValue.length > 0) {
                                        accessorRowValue.forEach(
                                            (item, itemIndex) => {
                                                columnValue = item[
                                                    innerCellAccessor
                                                ].toString();
                                                columnHeader = `${Header} - ${innerCellHeader}_${itemIndex}`;
                                                filteredColumnVal[
                                                    columnHeader
                                                ] = columnValue;
                                                rowFilteredValues.push(
                                                    columnValue
                                                );
                                                rowFilteredHeader.push(
                                                    columnHeader
                                                );
                                            }
                                        );
                                    } else if (innerCellAccessorValue) {
                                        columnValue = innerCellAccessorValue;
                                        columnHeader = `${Header} - ${innerCellHeader}`;
                                        filteredColumnVal[
                                            columnHeader
                                        ] = columnValue;
                                        rowFilteredValues.push(columnValue);
                                        rowFilteredHeader.push(columnHeader);
                                    }
                                }
                            });
                        } else {
                            columnValue = accessorRowValue;
                            columnHeader = Header;
                            filteredColumnVal[columnHeader] = columnValue;
                            rowFilteredValues.push(columnValue);
                            rowFilteredHeader.push(columnHeader);
                        }
                    }
                });
                if (
                    managedAdditionalColumn &&
                    managedAdditionalColumn.display === true
                ) {
                    const { innerCells } = managedAdditionalColumn;
                    // For column in the expanded section
                    innerCells.forEach((expandedCell) => {
                        if (expandedCell.display === true) {
                            const expandedCellAccessor = expandedCell.accessor;
                            const expandedCellHeader = expandedCell.Header;
                            const expandedCellValue = row[expandedCellAccessor];
                            let formattedValue = expandedCellValue;
                            if (typeof expandedCellValue === "object") {
                                if (expandedCellValue.length > 0) {
                                    const newValues = [];
                                    expandedCellValue.forEach((cellValue) => {
                                        newValues.push(
                                            Object.values(cellValue).join("--")
                                        );
                                    });
                                    formattedValue = newValues.join("||");
                                } else {
                                    formattedValue = Object.values(
                                        expandedCellValue
                                    ).join("||");
                                }
                            }
                            filteredColumnVal[
                                expandedCellHeader
                            ] = formattedValue;
                            rowFilteredValues.push(formattedValue);
                            rowFilteredHeader.push(expandedCellHeader);
                        }
                    });
                }
                filteredRow.push(filteredColumnVal);
                filteredRowValues.push(rowFilteredValues);
                if (rowLength === index + 1)
                    filteredRowHeader.push(rowFilteredHeader);
            });

            downloadTypes.forEach((item) => {
                if (item === "pdf") {
                    downloadPDF(filteredRowValues, filteredRowHeader);
                } else if (item === "excel") {
                    downloadXLSFile(filteredRow);
                } else {
                    downloadCSVFile(filteredRow);
                }
            });
        } else if (
            filteredManagedColumns.length === 0 &&
            downloadTypes.length === 0
        ) {
            setWarning("Select at least one column and a file type");
        } else if (filteredManagedColumns.length === 0) {
            setWarning("Select at least one column");
        } else if (downloadTypes.length === 0) {
            setWarning("Select at least one file type");
        }
    };

    const changeDownloadType = (event) => {
        const { value, checked } = event ? event.currentTarget : "";
        if (checked) {
            setDownloadTypes(downloadTypes.concat([value]));
        } else {
            setDownloadTypes(
                downloadTypes.filter((type) => {
                    return type !== value;
                })
            );
        }
    };

    useEffect(() => {
        setManagedColumns(JSON.parse(JSON.stringify(columns)));
    }, [columns]);

    useEffect(() => {
        setManagedAdditionalColumn(
            JSON.parse(JSON.stringify(additionalColumn))
        );
    }, [additionalColumn]);

    if (isExportOverlayOpen) {
        return (
            <ClickAwayListener
                onClickAway={toggleExportDataOverlay}
                className="neo-grid-popover neo-grid-popover--exports exports--grid"
            >
                <div className="neo-grid-popover__export export__grid">
                    <div className="export__chooser">
                        <div className="export__header">
                            <strong>Export Data</strong>
                        </div>
                        <ColumnSearch
                            columns={columns}
                            additionalColumn={additionalColumn}
                            managedColumns={managedColumns}
                            managedAdditionalColumn={managedAdditionalColumn}
                            updateColumns={updateColumns}
                        />
                    </div>
                    <div className="export__settings">
                        <div className="export__header">
                            <div className="export__headerTxt" />
                            <div className="export__close">
                                <i
                                    aria-hidden="true"
                                    onClick={toggleExportDataOverlay}
                                >
                                    <IconClose />
                                </i>
                            </div>
                        </div>
                        <div className="export__as">Export As</div>
                        <div className="export__body">
                            <div className="export__reorder">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input custom-checkbox form-check-input"
                                        id="chk_pdf"
                                        data-testid="chk_pdf_test"
                                        value="pdf"
                                        checked={downloadTypes.includes("pdf")}
                                        onChange={changeDownloadType}
                                    />
                                </div>
                                <div className="export__file">
                                    <i>
                                        <IconPdf />
                                    </i>
                                    <strong>PDF</strong>
                                </div>
                            </div>
                            <div className="export__reorder">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input custom-checkbox form-check-input"
                                        id="chk_excel"
                                        data-testid="chk_excel_test"
                                        value="excel"
                                        checked={downloadTypes.includes(
                                            "excel"
                                        )}
                                        onChange={changeDownloadType}
                                    />
                                </div>
                                <div className="export__file">
                                    <i>
                                        <IconExcel />
                                    </i>
                                    <strong>Excel</strong>
                                </div>
                            </div>
                            <div className="export__reorder">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input custom-checkbox form-check-input"
                                        id="chk_csv"
                                        data-testid="chk_csv_test"
                                        value="csv"
                                        checked={downloadTypes.includes("csv")}
                                        onChange={changeDownloadType}
                                    />
                                </div>
                                <div className="export__file">
                                    <i>
                                        <IconCsv />
                                    </i>
                                    <strong>CSV</strong>
                                </div>
                            </div>
                            <div className="exportWarning">
                                <span className="alert export-warning">
                                    <strong>{warning}</strong>
                                </span>
                            </div>
                        </div>
                        <div className="export__footer">
                            <div className="export__btns">
                                <button
                                    type="button"
                                    data-testid="cancel_button"
                                    className="neo-btn neo-btn-primary btn btn-secondary"
                                    onClick={toggleExportDataOverlay}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    data-testid="export_button"
                                    className="neo-btn neo-btn-default btn btn-secondary"
                                    onClick={exportRowData}
                                >
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
    return null;
};

ExportData.propTypes = {
    isExportOverlayOpen: PropTypes.bool,
    toggleExportDataOverlay: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.object),
    additionalColumn: PropTypes.object
};

export default ExportData;
