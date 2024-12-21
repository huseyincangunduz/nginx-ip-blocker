export interface ObservingIp {
  ipAddress: string;
  penalized: boolean;
  penaltyExpire: Date;
  penaltyPoint: number;
}
