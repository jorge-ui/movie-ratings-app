import React, {FC} from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import styles from './pagination-controls.module.scss';

interface OwnProps {
    className?: string
}

type Props = OwnProps;

const PaginationControls: FC<Props> = ({className, ...rest}) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    return (
        <MobileStepper
            {...rest}
            className={className + ' ' + styles.root}
            position={"static"}
            variant="dots"
            steps={6}
            activeStep={activeStep}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
                    Next <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    <KeyboardArrowLeft /> Back
                </Button>
            }
        />
    );
};

export default PaginationControls;