import React from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import styles from "./pagination-controls.module.scss";

interface OwnProps {
    className?: string,
    totalPages: number,
    currentPage: number,
    goToNextPage: () => void,
    goToPreviousPage: () => void
}

type Props = OwnProps

class PaginationControls extends React.Component<Props> {

    keydownListener = (e: KeyboardEvent) => {
        if (document.activeElement?.id === "search-bar-input") return;
        let {goToNextPage, goToPreviousPage, totalPages} = this.props;
        if (totalPages)
            switch (e.code) {
                case "ArrowRight":
                    return goToNextPage();
                case "ArrowLeft":
                    return goToPreviousPage();
                default:
                    break;
            }
    };

    componentDidMount(): void {
        window.addEventListener("keydown", this.keydownListener);
    }

    componentWillUnmount(): void {
        window.removeEventListener("keydown", this.keydownListener);
    }

    render() {
        let {
            className,
            currentPage,
            goToNextPage,
            goToPreviousPage,
            totalPages
        } = this.props;

        return (
            <MobileStepper
                className={className + " " + styles.root}
                position={"static"}
                variant="text"
                steps={totalPages}
                activeStep={currentPage && (currentPage - 1)}
                nextButton={
                    <Button
                        size="small"
                        onClick={goToNextPage}
                        disabled={currentPage >= totalPages}
                    >
                        Next <KeyboardArrowRight/>
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        onClick={goToPreviousPage}
                        disabled={currentPage <= 1}
                    >
                        <KeyboardArrowLeft/> Back
                    </Button>
                }
            />
        );
    }
}

export default PaginationControls;
