export class Config {
  public static readonly intervalMillisecondsToReconnect: number = 3600000;
  public static readonly intervalMillisecondsToReConnectWhenFail: number = 60000;
  public static readonly maximumFilesInPrintDirectory: number = 10;
  public static readonly logRotationPeriod: string = '7d';
  public static readonly infoLogFileName: string = 'info_log.log';
  public static readonly errorLogFileName: string = 'error_log.log';
  public static readonly logFileMaxCount: number = 3;
  public static readonly logFileMaxSize: string = '100m';
  public static readonly defaultDateFormat: string = 'DD/MM/YYYY HH:mm:ss';
}
