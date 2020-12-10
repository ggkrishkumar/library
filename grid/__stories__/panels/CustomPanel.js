import React from "react";
const CustomPanel = () => {
    const SCR = () => {
        alert("view SCR ");
    };
    const OpenSummary = () => {
        alert("Open Summary");
    };
    const CloseSummary = () => {
        alert("Close Summary");
    };

    const GiveFeedback = () => {
        alert("Give FeedBack ");
    };
    const ViewFeedback = () => {
        alert("View Feedback");
    };

    const buttonPanelData = [
        {
            label: "Send SCR",
            value: "SCR",
            handleEvent: SCR,
            children: []
        },
        {
            label: "Segment Summary Options",
            value: "SegmentSummary",
            children: [
                {
                    label: "Open Segment Summary",
                    value: "OpenSummary",
                    handleEvent: OpenSummary
                },
                {
                    label: "Close Segment Summary",
                    value: "handleEvent",
                    handleEvent: CloseSummary
                }
            ]
        },
        {
            label: "Feedback Options",
            value: "Feedback",
            children: [
                {
                    label: "View Feedback",
                    value: "ViewFeedback",
                    handleEvent: ViewFeedback
                },
                {
                    label: "Give Feedback",
                    value: "GiveFeedback",
                    handleEvent: GiveFeedback
                }
            ]
        }
    ];

    const isbuttonPanelDataPresent =
        buttonPanelData && buttonPanelData.length > 0;

    return (
        <div>
            {isbuttonPanelDataPresent
                ? buttonPanelData.map((action) => {
                      const { label, children, handleEvent } = action;
                      const isChildrenPresent = children && children.length > 0;
                      return (
                          <div className="dropdown" key={label}>
                              <button
                                  type="button"
                                  className="neo-btn neo-btn-primary btn btn-secondary"
                                  onClick={handleEvent}
                              >
                                  {label}
                              </button>

                              <div className="dropdown-content">
                                  {isChildrenPresent
                                      ? children.map((childAction) => {
                                            const {
                                                label,
                                                handleEvent
                                            } = childAction;
                                            return (
                                                <div
                                                    className="dropdown"
                                                    key={label}
                                                >
                                                    <button
                                                        type="button"
                                                        className="neo-btn neo-btn-default btn btn-secondary"
                                                        onClick={handleEvent}
                                                    >
                                                        {label}
                                                    </button>
                                                </div>
                                            );
                                        })
                                      : null}
                              </div>
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

export default CustomPanel;
