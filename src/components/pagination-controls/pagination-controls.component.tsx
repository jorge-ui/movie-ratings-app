import React, { FC, memo, useCallback, useEffect } from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import styles from "./pagination-controls.module.scss";
import useSearchParam from "hooks/useSearchParam";
import { scrollToTop } from "utility";
import useIsMobile from "hooks/useIsMobile";

interface OwnProps {
    className?: string,
    totalPages: number,
}

type Props = OwnProps

const PaginationControls: FC<Props> = ({className, totalPages}) => {
    const isMobile = useIsMobile();
    const [currentPage = 0, setCurrentPage] = useSearchParam("page");
    const [movieIdParam] = useSearchParam("movieId");

    const goToNextPage = useCallback(() => setCurrentPage(page => {
        if (page && page < totalPages) {
            isMobile && scrollToTop();
            return page + 1;
        }
        return page || 0;
    }), [isMobile, setCurrentPage, totalPages]);

    const goToPreviousPage = useCallback(() => setCurrentPage(page => {
        if (page && page > 1) {
            isMobile && scrollToTop();
            return page - 1;
        }
        return page || 0;
    }), [isMobile, setCurrentPage]);

    useEffect(() => {
        const keydownListener = ({code, altKey, ctrlKey, shiftKey}: KeyboardEvent) => {
            if (altKey || ctrlKey || shiftKey) return ;
            if (document.activeElement?.id === "movies-browser-bar-input") return;
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
    }, [totalPages, currentPage, movieIdParam, goToNextPage, goToPreviousPage]);


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
