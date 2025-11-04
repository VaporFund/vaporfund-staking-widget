/**
 * VaporFund Staking Widget - CDN Entry Point
 *
 * This file provides a vanilla JavaScript API for the widget
 * that can be loaded via CDN without requiring React setup.
 *
 * Usage:
 * ```html
 * <div id="vapor-staking"></div>
 * <script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
 * <script>
 *   VaporWidget.init({
 *     container: '#vapor-staking',
 *     apiKey: 'vf_test_xxxxx',
 *     referralCode: 'partner_123'
 *   });
 * </script>
 * ```
 */

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { VaporStakingWidget } from './components/VaporStakingWidget';
import type { VaporWidgetConfig } from './types';
import './styles/index.css';

interface CDNConfig extends Omit<VaporWidgetConfig, 'onSuccess' | 'onError'> {
  container: string | HTMLElement;
  onSuccess?: (tx: any) => void;
  onError?: (error: any) => void;
}

interface WidgetInstance {
  root: Root;
  container: HTMLElement;
  config: CDNConfig;
}

class VaporWidgetCDN {
  private instances: Map<HTMLElement, WidgetInstance> = new Map();
  private version: string = '0.1.0';

  /**
   * Initialize the widget in a container
   */
  init(config: CDNConfig): WidgetInstance | null {
    try {
      // Get container element
      const container = this.getContainer(config.container);
      if (!container) {
        console.error('[VaporWidget] Container not found:', config.container);
        return null;
      }

      // Check if already initialized
      if (this.instances.has(container)) {
        console.warn('[VaporWidget] Widget already initialized in this container');
        return this.instances.get(container) || null;
      }

      // Validate required config
      if (!config.apiKey) {
        console.error('[VaporWidget] API key is required');
        return null;
      }

      // Create React root
      const root = createRoot(container);

      // Prepare widget config
      const widgetConfig: VaporWidgetConfig = {
        apiKey: config.apiKey,
        referralCode: config.referralCode,
        theme: config.theme || 'auto',
        defaultToken: config.defaultToken || 'USDC',
        defaultStrategy: config.defaultStrategy,
        network: config.network || 'mainnet',
        compact: config.compact || false,
        customColors: config.customColors,
        locale: config.locale,
        onSuccess: config.onSuccess,
        onError: config.onError,
      };

      // Render widget
      root.render(
        <React.StrictMode>
          <VaporStakingWidget {...widgetConfig} />
        </React.StrictMode>
      );

      // Store instance
      const instance: WidgetInstance = {
        root,
        container,
        config,
      };
      this.instances.set(container, instance);

      console.log('[VaporWidget] Initialized successfully', {
        container: config.container,
        network: config.network,
        version: this.version,
      });

      return instance;
    } catch (error) {
      console.error('[VaporWidget] Failed to initialize:', error);
      if (config.onError) {
        config.onError({
          code: 'INIT_ERROR',
          message: 'Failed to initialize widget',
          details: error,
        });
      }
      return null;
    }
  }

  /**
   * Destroy a widget instance
   */
  destroy(container: string | HTMLElement): boolean {
    try {
      const element = this.getContainer(container);
      if (!element) {
        console.error('[VaporWidget] Container not found:', container);
        return false;
      }

      const instance = this.instances.get(element);
      if (!instance) {
        console.warn('[VaporWidget] No instance found for container');
        return false;
      }

      // Unmount React
      instance.root.unmount();

      // Remove from instances
      this.instances.delete(element);

      console.log('[VaporWidget] Destroyed successfully');
      return true;
    } catch (error) {
      console.error('[VaporWidget] Failed to destroy:', error);
      return false;
    }
  }

  /**
   * Update widget configuration
   */
  update(container: string | HTMLElement, config: Partial<CDNConfig>): boolean {
    try {
      const element = this.getContainer(container);
      if (!element) {
        console.error('[VaporWidget] Container not found:', container);
        return false;
      }

      const instance = this.instances.get(element);
      if (!instance) {
        console.warn('[VaporWidget] No instance found for container');
        return false;
      }

      // Merge configs
      const newConfig = { ...instance.config, ...config };

      // Re-render with new config
      const widgetConfig: VaporWidgetConfig = {
        apiKey: newConfig.apiKey,
        referralCode: newConfig.referralCode,
        theme: newConfig.theme || 'auto',
        defaultToken: newConfig.defaultToken || 'USDC',
        defaultStrategy: newConfig.defaultStrategy,
        network: newConfig.network || 'mainnet',
        compact: newConfig.compact || false,
        customColors: newConfig.customColors,
        locale: newConfig.locale,
        onSuccess: newConfig.onSuccess,
        onError: newConfig.onError,
      };

      instance.root.render(
        <React.StrictMode>
          <VaporStakingWidget {...widgetConfig} />
        </React.StrictMode>
      );

      // Update stored config
      instance.config = newConfig;

      console.log('[VaporWidget] Updated successfully');
      return true;
    } catch (error) {
      console.error('[VaporWidget] Failed to update:', error);
      return false;
    }
  }

  /**
   * Get all active instances
   */
  getInstances(): WidgetInstance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Get version
   */
  getVersion(): string {
    return this.version;
  }

  /**
   * Helper: Get container element from selector or element
   */
  private getContainer(container: string | HTMLElement): HTMLElement | null {
    if (typeof container === 'string') {
      return document.querySelector<HTMLElement>(container);
    }
    return container;
  }

  /**
   * Auto-initialize from data attributes
   * Looks for elements with data-vapor-widget attribute
   */
  autoInit(): void {
    const elements = document.querySelectorAll('[data-vapor-widget]');
    elements.forEach((element) => {
      const config: CDNConfig = {
        container: element as HTMLElement,
        apiKey: element.getAttribute('data-api-key') || '',
        referralCode: element.getAttribute('data-referral-code') || undefined,
        theme: (element.getAttribute('data-theme') as any) || 'auto',
        network: (element.getAttribute('data-network') as any) || 'mainnet',
        compact: element.getAttribute('data-compact') === 'true',
      };

      if (config.apiKey) {
        this.init(config);
      } else {
        console.error('[VaporWidget] Auto-init failed: missing data-api-key attribute');
      }
    });
  }
}

// Create global instance
const vaporWidget = new VaporWidgetCDN();

// Auto-initialize on DOMContentLoaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      vaporWidget.autoInit();
    });
  } else {
    // DOMContentLoaded already fired
    setTimeout(() => vaporWidget.autoInit(), 0);
  }
}

// Export to window (CDN only)
if (typeof window !== 'undefined') {
  (window as any).VaporWidget = vaporWidget;
}

// Also export for module usage
export default vaporWidget;
export { VaporWidgetCDN };
export type { CDNConfig, WidgetInstance };
