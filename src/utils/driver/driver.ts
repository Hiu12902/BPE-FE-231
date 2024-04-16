import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import './popover.style.css';

const driverInstance = driver({
    showProgress: true,
    popoverClass: "driverjs-theme",
    steps: [],
    nextBtnText: "Next",
    prevBtnText: "Back",
    showButtons: ["next", "previous"],
    onCloseClick: () => {
        driverInstance.destroy();
    },
})

export default driverInstance;