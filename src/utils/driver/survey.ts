import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const SurveyDriver = driver({
    showProgress: true,
    steps: [
        {
            element: "#tour_editor",
            popover: {
                title: "Question editor",
                description:
                    "This is where you can create and edit your survey questions.",
                side: "top",
                align: "center",
            },
        },
        {
            element: "#tour_question_config",
            popover: {
                title: "Question configuration",
                description:
                    "This is where you can edit attribute of questions: Content, Question Type,...",
                side: "top",
                align: "center",
            },
        },
        {
            element: "#tour_question:nth-child(1)",
            popover: {
                title: "Question",
                description:
                    "This is a question, you can click on it to edit the question.",
                side: "bottom",
                align: "start",
            },
        },
        {
            element: "#tour_question_badge",
            popover: {
                title: "Question Type",
                description:
                    "This badge shows the type of question. In our survey, we have several question types: CSAT, CES, NPS,... Let's find more!",
                side: "left",
                align: "start",
            },
        },
        {
            element: "#tour_survey_status",
            popover: {
                title: "Create Driver",
                description:
                    "Simply call the driver function to create a driver.js instance",
                side: "left",
                align: "start",
            },
        },
        {
            element: "#tour_preview",
            popover: {
                title: "Preview modal",
                description:
                    "You can preview your survey by clicking on this button.",
                side: "top",
                align: "start",
            },
        },
        {
            element: "#tour_publish",
            popover: {
                title: "Publish modal",
                description:
                    "You can publish your survey by clicking on this button. Once published, you can't edit the survey anymore.",
                side: "top",
                align: "start",
            },
        },
    ],
});

export default SurveyDriver;