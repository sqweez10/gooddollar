import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { CheckinInput, CheckinResult, ClaimInput, ClaimRecord, ClaimResult, ClaimStatus, ErrorResponse, FaucetStats, HealthStatus, LeaderboardEntry, ReferralStats, ReferralValidation, StreakStatus, VerificationStatus } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getClaimTokensUrl: () => string;
/**
 * @summary Claim G$ tokens
 */
export declare const claimTokens: (claimInput: ClaimInput, options?: RequestInit) => Promise<ClaimResult>;
export declare const getClaimTokensMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof claimTokens>>, TError, {
        data: BodyType<ClaimInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof claimTokens>>, TError, {
    data: BodyType<ClaimInput>;
}, TContext>;
export type ClaimTokensMutationResult = NonNullable<Awaited<ReturnType<typeof claimTokens>>>;
export type ClaimTokensMutationBody = BodyType<ClaimInput>;
export type ClaimTokensMutationError = ErrorType<ErrorResponse>;
/**
* @summary Claim G$ tokens
*/
export declare const useClaimTokens: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof claimTokens>>, TError, {
        data: BodyType<ClaimInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof claimTokens>>, TError, {
    data: BodyType<ClaimInput>;
}, TContext>;
export declare const getGetClaimStatusUrl: (walletAddress: string) => string;
/**
 * @summary Get claim status for a wallet
 */
export declare const getClaimStatus: (walletAddress: string, options?: RequestInit) => Promise<ClaimStatus>;
export declare const getGetClaimStatusQueryKey: (walletAddress: string) => readonly [`/api/faucet/status/${string}`];
export declare const getGetClaimStatusQueryOptions: <TData = Awaited<ReturnType<typeof getClaimStatus>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClaimStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getClaimStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetClaimStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getClaimStatus>>>;
export type GetClaimStatusQueryError = ErrorType<unknown>;
/**
 * @summary Get claim status for a wallet
 */
export declare function useGetClaimStatus<TData = Awaited<ReturnType<typeof getClaimStatus>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClaimStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetFaucetStatsUrl: () => string;
/**
 * @summary Get faucet statistics
 */
export declare const getFaucetStats: (options?: RequestInit) => Promise<FaucetStats>;
export declare const getGetFaucetStatsQueryKey: () => readonly ["/api/faucet/stats"];
export declare const getGetFaucetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getFaucetStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFaucetStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFaucetStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFaucetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getFaucetStats>>>;
export type GetFaucetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get faucet statistics
 */
export declare function useGetFaucetStats<TData = Awaited<ReturnType<typeof getFaucetStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFaucetStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRecentClaimsUrl: () => string;
/**
 * @summary Get recent claims
 */
export declare const getRecentClaims: (options?: RequestInit) => Promise<ClaimRecord[]>;
export declare const getGetRecentClaimsQueryKey: () => readonly ["/api/faucet/recent"];
export declare const getGetRecentClaimsQueryOptions: <TData = Awaited<ReturnType<typeof getRecentClaims>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentClaims>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentClaims>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentClaimsQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentClaims>>>;
export type GetRecentClaimsQueryError = ErrorType<unknown>;
/**
 * @summary Get recent claims
 */
export declare function useGetRecentClaims<TData = Awaited<ReturnType<typeof getRecentClaims>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentClaims>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCheckVerificationStatusUrl: (walletAddress: string) => string;
/**
 * @summary Check GoodDollar verification status
 */
export declare const checkVerificationStatus: (walletAddress: string, options?: RequestInit) => Promise<VerificationStatus>;
export declare const getCheckVerificationStatusQueryKey: (walletAddress: string) => readonly [`/api/verification/check/${string}`];
export declare const getCheckVerificationStatusQueryOptions: <TData = Awaited<ReturnType<typeof checkVerificationStatus>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof checkVerificationStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof checkVerificationStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type CheckVerificationStatusQueryResult = NonNullable<Awaited<ReturnType<typeof checkVerificationStatus>>>;
export type CheckVerificationStatusQueryError = ErrorType<unknown>;
/**
 * @summary Check GoodDollar verification status
 */
export declare function useCheckVerificationStatus<TData = Awaited<ReturnType<typeof checkVerificationStatus>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof checkVerificationStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDailyCheckinUrl: () => string;
/**
 * Check in once per day to build streak and earn bonus G$
 * @summary Perform daily check-in
 */
export declare const dailyCheckin: (checkinInput: CheckinInput, options?: RequestInit) => Promise<CheckinResult>;
export declare const getDailyCheckinMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof dailyCheckin>>, TError, {
        data: BodyType<CheckinInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof dailyCheckin>>, TError, {
    data: BodyType<CheckinInput>;
}, TContext>;
export type DailyCheckinMutationResult = NonNullable<Awaited<ReturnType<typeof dailyCheckin>>>;
export type DailyCheckinMutationBody = BodyType<CheckinInput>;
export type DailyCheckinMutationError = ErrorType<ErrorResponse>;
/**
* @summary Perform daily check-in
*/
export declare const useDailyCheckin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof dailyCheckin>>, TError, {
        data: BodyType<CheckinInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof dailyCheckin>>, TError, {
    data: BodyType<CheckinInput>;
}, TContext>;
export declare const getGetStreakStatusUrl: (walletAddress: string) => string;
/**
 * @summary Get streak status for a wallet
 */
export declare const getStreakStatus: (walletAddress: string, options?: RequestInit) => Promise<StreakStatus>;
export declare const getGetStreakStatusQueryKey: (walletAddress: string) => readonly [`/api/checkin/streak/${string}`];
export declare const getGetStreakStatusQueryOptions: <TData = Awaited<ReturnType<typeof getStreakStatus>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStreakStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStreakStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStreakStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getStreakStatus>>>;
export type GetStreakStatusQueryError = ErrorType<unknown>;
/**
 * @summary Get streak status for a wallet
 */
export declare function useGetStreakStatus<TData = Awaited<ReturnType<typeof getStreakStatus>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStreakStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetReferralStatsUrl: (walletAddress: string) => string;
/**
 * @summary Get referral stats and link for a wallet
 */
export declare const getReferralStats: (walletAddress: string, options?: RequestInit) => Promise<ReferralStats>;
export declare const getGetReferralStatsQueryKey: (walletAddress: string) => readonly [`/api/referral/${string}`];
export declare const getGetReferralStatsQueryOptions: <TData = Awaited<ReturnType<typeof getReferralStats>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getReferralStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getReferralStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetReferralStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getReferralStats>>>;
export type GetReferralStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get referral stats and link for a wallet
 */
export declare function useGetReferralStats<TData = Awaited<ReturnType<typeof getReferralStats>>, TError = ErrorType<unknown>>(walletAddress: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getReferralStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getValidateReferralCodeUrl: (referralCode: string) => string;
/**
 * @summary Validate a referral code
 */
export declare const validateReferralCode: (referralCode: string, options?: RequestInit) => Promise<ReferralValidation>;
export declare const getValidateReferralCodeQueryKey: (referralCode: string) => readonly [`/api/referral/validate/${string}`];
export declare const getValidateReferralCodeQueryOptions: <TData = Awaited<ReturnType<typeof validateReferralCode>>, TError = ErrorType<unknown>>(referralCode: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof validateReferralCode>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof validateReferralCode>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ValidateReferralCodeQueryResult = NonNullable<Awaited<ReturnType<typeof validateReferralCode>>>;
export type ValidateReferralCodeQueryError = ErrorType<unknown>;
/**
 * @summary Validate a referral code
 */
export declare function useValidateReferralCode<TData = Awaited<ReturnType<typeof validateReferralCode>>, TError = ErrorType<unknown>>(referralCode: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof validateReferralCode>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetLeaderboardUrl: () => string;
/**
 * Top wallets ranked by current streak
 * @summary Get streak leaderboard
 */
export declare const getLeaderboard: (options?: RequestInit) => Promise<LeaderboardEntry[]>;
export declare const getGetLeaderboardQueryKey: () => readonly ["/api/leaderboard"];
export declare const getGetLeaderboardQueryOptions: <TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeaderboardQueryResult = NonNullable<Awaited<ReturnType<typeof getLeaderboard>>>;
export type GetLeaderboardQueryError = ErrorType<unknown>;
/**
 * @summary Get streak leaderboard
 */
export declare function useGetLeaderboard<TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map