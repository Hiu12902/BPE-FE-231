import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import './popover.style.css';

const driverInstance = driver({
    showProgress: true,
    popoverClass: "driverjs-theme",
    steps: [],
    nextBtnText: "NEXT STEP",
    prevBtnText: "BACK",
    doneBtnText: "GOT IT!",
    showButtons: ["next", "previous"],
    progressText: 'Step {{current}} of {{total}}',
    onCloseClick: () => {
        driverInstance.destroy();
    },
})

export default driverInstance;