import React, { useState } from "react";

const SegmentEdit = ({
    rowData,
    DisplayTag,
    airportCodeList,
    rowUpdateCallBack
}) => {
    const [updatedRowData, setUpdatedRowData] = useState(rowData);
    const { segment, weight } = updatedRowData;

    if (segment && weight) {
        const updateRowData = (updatedSegmentData, updatedWeightData) => {
            const updatedRow = {
                ...updatedRowData
            };
            if (updatedSegmentData) {
                updatedRow.segment = updatedSegmentData;
            }
            if (updatedWeightData) {
                updatedRow.weight = updatedWeightData;
            }
            setUpdatedRowData(updatedRow);
            rowUpdateCallBack(updatedRow);
        };

        const updateFromValue = (e) => {
            const updatedSegmentData = {
                ...segment,
                from: e.target.value
            };
            updateRowData(updatedSegmentData, null);
        };

        const updateToValue = (e) => {
            const updatedSegmentData = {
                ...segment,
                to: e.target.value
            };
            updateRowData(updatedSegmentData, null);
        };

        const updateWeightPercentage = (e) => {
            const updatedWeightData = {
                ...weight,
                percentage: e.target.value
            };
            updateRowData(null, updatedWeightData);
        };

        const updateWeightValue = (e) => {
            const updatedWeightData = {
                ...weight,
                value: e.target.value
            };
            updateRowData(null, updatedWeightData);
        };

        const { from, to } = segment;
        const { percentage, value } = weight;
        return (
            <div>
                <DisplayTag columnKey="segment" cellKey="from">
                    <select value={from} onChange={updateFromValue}>
                        {airportCodeList.map((item, index) => {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            );
                        })}
                    </select>
                </DisplayTag>
                <DisplayTag columnKey="segment" cellKey="to">
                    <select value={to} onChange={updateToValue}>
                        {airportCodeList.map((item, index) => {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            );
                        })}
                    </select>
                </DisplayTag>
                <DisplayTag columnKey="weight" cellKey="percentage">
                    <input
                        type="text"
                        value={percentage}
                        onChange={updateWeightPercentage}
                    />
                </DisplayTag>
                <DisplayTag columnKey="weight" cellKey="value">
                    <input
                        type="text"
                        value={value}
                        onChange={updateWeightValue}
                    />{" "}
                </DisplayTag>
            </div>
        );
    }
    return null;
};

export default SegmentEdit;
