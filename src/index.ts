// Main widget component
export { VaporStakingWidget } from './components/VaporStakingWidget';

// Types
export type {
  VaporWidgetConfig,
  CustomColors,
  Transaction,
  Strategy,
  Token,
  WidgetError,
} from './types';

// Hooks (for advanced usage)
export { useWallet } from './hooks/useWallet';
export { useStaking } from './hooks/useStaking';
export { useTheme } from './hooks/useTheme';

// Constants
export { CONTRACT_ADDRESSES, SUPPORTED_NETWORKS } from './constants';

// Version
export { WIDGET_VERSION } from './constants';

// Vanilla JS API for CDN usage
import { VaporStakingWidget } from './components/VaporStakingWidget';
import { VaporWidgetConfig } from './types';

declare global {
  interface Window {
    VaporWidget?: {
      init: (config: VaporWidgetConfig & { container: string }) => void;
      VaporStakingWidget: typeof VaporStakingWidget;
    };
  }
}

// Initialize vanilla JS API
if (typeof window !== 'undefined') {
  window.VaporWidget = {
    init: (config) => {
      // This would be used for vanilla JS integration via CDN
      console.warn('VaporWidget.init() is for CDN usage. Use React component directly for npm.');
    },
    VaporStakingWidget,
  };
}
