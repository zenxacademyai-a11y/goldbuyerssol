import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // If it's a chunk loading error, reload the page
    if (error.name === "ChunkLoadError" || error.message?.includes("Failed to fetch dynamically imported module") || error.message?.includes("fetch")) {
      window.location.reload();
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4 text-center">
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Application Update</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">A new version is available. Refreshing...</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
