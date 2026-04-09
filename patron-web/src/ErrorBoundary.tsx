import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };

type State = { error: Error | null };

/**
 * Surfaces bundle/runtime errors instead of a blank page (common when storage or a dependency throws).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="page" style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
          <h1 style={{ fontSize: '1.25rem' }}>Something went wrong</h1>
          <p style={{ color: '#555', wordBreak: 'break-word' }}>{this.state.error.message}</p>
          <p style={{ color: '#777', fontSize: '0.9rem' }}>
            Try a normal (non-private) window, or disable extensions blocking storage on this site, then reload.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
