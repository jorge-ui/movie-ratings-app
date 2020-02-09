import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from './with-spinner.module.scss';

interface WithLoadingProps {
  loading: boolean;
}

const WithSpinner = <P extends object>(Component: React.ComponentType<P>) =>
  class WithLoading extends React.Component<P & WithLoadingProps> {
    render() {
      const { loading, ...props } = this.props;
      return loading ? (
        <CircularProgress className={styles.circularProgress} />
      ) : (
        <Component {...(props as P)} />
      );
    }
  };

export default WithSpinner;
