import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, TIMEOUTS } from '@/constants';
import type {
  ApiResponse,
  StrategiesResponse,
  TokensResponse,
  ReferralTrackingRequest,
  PreparedTransaction,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: TIMEOUTS.API_REQUEST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error
          console.error('API Error:', error.response.data);
        } else if (error.request) {
          // Request made but no response
          console.error('Network Error:', error.message);
        } else {
          // Something else happened
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch available staking strategies
   */
  async getStrategies(): Promise<StrategiesResponse> {
    const response = await this.client.get<ApiResponse<StrategiesResponse>>(
      API_ENDPOINTS.STRATEGIES
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch strategies');
    }

    return response.data.data;
  }

  /**
   * Fetch whitelisted tokens
   */
  async getTokens(): Promise<TokensResponse> {
    const response = await this.client.get<ApiResponse<TokensResponse>>(API_ENDPOINTS.TOKENS);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch tokens');
    }

    return response.data.data;
  }

  /**
   * Prepare a staking transaction
   */
  async prepareTransaction(params: {
    token: string;
    amount: string;
    strategy: string;
    referralCode?: string;
  }): Promise<PreparedTransaction> {
    const response = await this.client.post<ApiResponse<PreparedTransaction>>(
      API_ENDPOINTS.PREPARE_TRANSACTION,
      params
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to prepare transaction');
    }

    return response.data.data;
  }

  /**
   * Track a referral conversion
   */
  async trackReferral(data: ReferralTrackingRequest): Promise<void> {
    const response = await this.client.post<ApiResponse<void>>(
      API_ENDPOINTS.TRACK_REFERRAL,
      data
    );

    if (!response.data.success) {
      console.error('Failed to track referral:', response.data.error);
      // Don't throw error - referral tracking is non-critical
    }
  }

  /**
   * Update API key
   */
  updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
    this.client.defaults.headers.Authorization = `Bearer ${newApiKey}`;
  }
}

export default ApiClient;
