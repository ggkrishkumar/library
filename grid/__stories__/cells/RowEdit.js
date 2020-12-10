import React, { useState } from "react";
import { getValueOfDate } from "../utils/DateUtility";
import ClickAwayListener from "react-click-away-listener";

const RowEdit = ({
    rowData,
    airportCodeList,
    onRowUpdate,
    unbindRowEditOverlay
}) => {
    const [updatedRowData, setUpdatedRowData] = useState(rowData);

    const saveRowEdit = () => {
        onRowUpdate(rowData, updatedRowData);
        unbindRowEditOverlay();
    };

    const closeRowEditOverlay = () => {
        unbindRowEditOverlay();
    };

    const updateRowData = (
        updatedFlightData,
        updatedSegmentData,
        updatedWeightData,
        updatedSrData,
        updatedRemarksData
    ) => {
        const updatedRow = {
            ...updatedRowData
        };
        if (updatedFlightData) {
            updatedRow.flight = updatedFlightData;
        }
        if (updatedSegmentData) {
            updatedRow.segment = updatedSegmentData;
        }
        if (updatedWeightData) {
            updatedRow.weight = updatedWeightData;
        }
        if (updatedSrData) {
            updatedRow.sr = updatedSrData;
        }
        if (updatedRemarksData) {
            updatedRow.remarks = updatedRemarksData;
        }
        setUpdatedRowData(updatedRow);
    };

    const updateFlightnoValue = (e) => {
        const updatedFlightData = {
            ...flight,
            flightno: e.target.value
        };
        updateRowData(updatedFlightData);
    };

    const updateDateValue = (e) => {
        const updatedFlightData = {
            ...flight,
            date: getValueOfDate(e.target.value, "cell")
        };
        updateRowData(updatedFlightData);
    };

    const updateFromValue = (e) => {
        const updatedSegmentData = {
            ...segment,
            from: e.target.value
        };
        updateRowData(null, updatedSegmentData);
    };

    const updateToValue = (e) => {
        const updatedSegmentData = {
            ...segment,
            to: e.target.value
        };
        updateRowData(null, updatedSegmentData);
    };

    const updateWeightPercentage = (e) => {
        const updatedWeightData = {
            ...weight,
            percentage: e.target.value
        };
        updateRowData(null, null, updatedWeightData);
    };

    const updateWeightValue = (e) => {
        const updatedWeightData = {
            ...weight,
            value: e.target.value
        };
        updateRowData(null, null, updatedWeightData);
    };

    const updateSrValue = (e) => {
        updateRowData(null, null, null, e.target.value);
    };

    const updateRemarksValue = (e) => {
        updateRowData(null, null, null, null, e.target.value);
    };

    const { flight, segment, weight, sr, remarks } = updatedRowData;

    return (
        <ClickAwayListener
            className="row-option-action-overlay"
            data-testid="rowEditOverlay-container"
            onClickAway={closeRowEditOverlay}
        >
            <div className="row-edit">
                <div className="edit-flight">
                    <div className="edit-flight-no">
                        <label>FlightNo</label>
                        <input
                            type="text"
                            value={flight.flightno}
                            onChange={updateFlightnoValue}
                        />
                    </div>
                    <div className="edit-flight-date">
                        <label>Date</label>
                        <input
                            type="date"
                            value={getValueOfDate(flight.date, "calendar")}
                            onChange={updateDateValue}
                        />
                    </div>
                </div>
                <div className="edit-flight-segment">
                    <div>
                        <label>Segment From</label>
                        <select value={segment.from} onChange={updateFromValue}>
                            {airportCodeList.map((item, index) => {
                                return (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label>Segment To</label>
                        <select value={segment.to} onChange={updateToValue}>
                            {airportCodeList.map((item, index) => {
                                return (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="edit-weight">
                    <div className="edit-weight-percentage">
                        <label>Weight Percentage</label>
                        <input
                            type="text"
                            value={weight.percentage}
                            onChange={updateWeightPercentage}
                        />
                    </div>
                    <div className="edit-weight-value">
                        <label>Weight Value</label>
                        <input
                            type="text"
                            value={weight.value}
                            onChange={updateWeightValue}
                        />
                    </div>
                </div>
                <div className="edit-sr">
                    <label>SR</label>
                    <input type="text" value={sr} onChange={updateSrValue} />
                </div>
            </div>
            <div className="remarks-edit">
                <label>Remarks</label>
                <textarea
                    rows="4"
                    value={remarks}
                    onChange={updateRemarksValue}
                ></textarea>
            </div>
            <div className="btn-wrap">
                <button
                    type="button"
                    className="neo-btn neo-btn-primary btn btn-secondary"
                    data-testid="rowEditOverlay-save"
                    onClick={saveRowEdit}
                >
                    Save
                </button>
                <button
                    type="button"
                    className="neo-btn neo-btn-default btn btn-secondary"
                    data-testid="rowEditOverlay-cancel"
                    onClick={closeRowEditOverlay}
                >
                    Cancel
                </button>
            </div>
        </ClickAwayListener>
    );
};

export default RowEdit;
