/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CellDisplayAndEditContext } from "../../src/Utilities/TagsContext";
import CellDisplayAndEditTag from "../../src/Functions/CellDisplayAndEditTag";

describe("CellDisplayAndEditTag unit test", () => {
    const columnsMockData = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true,
            columnId: "column_0",
            isDisplayInExpandedRegion: false,
            display: true
        },
        {
            Header: "Flight",
            accessor: "flight",
            width: 100,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    display: true,
                    isSearchable: true,
                    cellId: "column_1_cell_0"
                },
                {
                    Header: "Date",
                    accessor: "date",
                    display: true,
                    isSearchable: true,
                    cellId: "column_1_cell_1"
                }
            ],
            sortValue: "flightno",
            columnId: "column_1",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        }
    ];
    const columnMockData = {
        id: "flight",
        depth: 0,
        innerCells: [
            {
                Header: "Flight No",
                accessor: "flightno",
                display: true,
                cellId: "rowExpand_cell_0"
            },
            {
                Header: "Date",
                accessor: "date",
                display: true,
                cellId: "rowExpand_cell_1"
            }
        ],
        columnId: "rowExpand",
        isVisible: true,
        display: true
    };
    const IdcolumnMockData = {
        id: "travelId",
        depth: 0,
        columnId: "column_0",
        isVisible: true,
        display: true
    };

    let container;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });
    afterEach(cleanup);
    it("should render component with cellkey and columnkey", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: columnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag columnKey="flight" cellKey="flightno" />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
    it("should renders component with cellkey only", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: columnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag cellKey="flightno" />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
    it("should return null when cellkey and columnkey is not passed", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: columnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
    it("should return null when invalid cellkey is passed", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: columnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag cellKey="invalid" />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
    it("should return null when cellkey i spassed but column doesn't have inner cells", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: IdcolumnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag cellKey="flight" />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
});
