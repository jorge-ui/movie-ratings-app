import React, { FC, memo, useEffect } from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import styles from "./pagination-controls.module.scss";
import useSearchParam from "../../util/custom-hooks/useSearchParam";
import { scrollToTop } from "../../util/utilityFunctions";
import useIsMobile from "../../util/custom-hooks/useIsMobile";

interface OwnProps {
    className?: string,
    totalPages: number,
}

type Props = OwnProps

const PaginationControls: FC<Props> = ({className, totalPages}) => {
    const isMobile = useIsMobile();
    const [currentPage = 0, setCurrentPage] = useSearchParam("page");
    const [movieIdParam] = useSearchParam("movieId");

    const goToNextPage = () => setCurrentPage(page => {
        if (page && page < totalPages) {
            isMobile && scrollToTop();
            return page + 1;
        }
        return currentPage;
    });

    const goToPreviousPage = () => setCurrentPage(page => {
        if (page && page > 1) {
            isMobile && scrollToTop();
            return page - 1;
        }
        return currentPage;
    });

    useEffect(() => {
        const keydownListener = ({code, altKey, ctrlKey, shiftKey}: KeyboardEvent) => {
            if (altKey || ctrlKey || shiftKey) return ;
            if (document.activeElement?.id === "search-bar-input") return;
            if (totalPages)
                switch (code) {
                    case "ArrowRight": return goToNextPage();
                    case "ArrowLeft":  return goToPreviousPage();
                    default: break;
                }
        };
        if (!movieIdParam) // Only add listener of there is no movie being viewed.
            window.addEventListener("keydown", keydownListener);

        return () => window.removeEventListener("keydown", keydownListener)
    }, [totalPages, currentPage, movieIdParam]);


    return totalPages ? (
        <MobileStepper
            className={`${styles.root} ${className || ''}`}
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
    ) : null
};

export default memo(PaginationControls);
