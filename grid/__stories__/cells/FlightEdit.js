import React, { useState } from "react";
import { getValueOfDate } from "../utils/DateUtility";

const FlightEdit = ({ rowData, DisplayTag, rowUpdateCallBack }) => {
    const [updatedRowData, setUpdatedRowData] = useState(rowData);
    const { flight } = updatedRowData;
    if (flight) {
        const updateRowData = (updatedFlightData) => {
            const updatedRow = {
                ...updatedRowData,
                flight: updatedFlightData
            };
            setUpdatedRowData(updatedRow);
            rowUpdateCallBack(updatedRow);
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

        const { flightno, date } = flight;
        return (
            <div>
                <DisplayTag columnKey="flight" cellKey="flightno">
                    <input
                        type="text"
                        value={flightno}
                        onChange={updateFlightnoValue}
                    />
                </DisplayTag>
                <DisplayTag columnKey="flight" cellKey="date">
                    <input
                        type="date"
                        value={getValueOfDate(date, "calendar")}
                        onChange={updateDateValue}
                    />
                </DisplayTag>
            </div>
        );
    }
    return null;
};
export default FlightEdit;
