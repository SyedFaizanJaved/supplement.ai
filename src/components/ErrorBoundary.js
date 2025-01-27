import React, { Component } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <Alert className={styles.alert}>
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className={styles.description}>
              <p className={styles.errorMessage}>
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className={styles.reloadButton}
              >
                <RefreshCw className={styles.refreshIcon} />
                Reload page
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}