import exp = require('constants');
import { readToMap, saveToFile } from 'map-utils';
import { ObservingIp } from 'observing-ip';
import { Subject } from 'rxjs';
import setToHappen from 'set-to-happen';
export class IpOperator {
  private bannedUrlsMap!: Map<String, ObservingIp>;
  private _initialized = false;
  private _penalizementAction = new Subject<ObservingIp>();

  constructor(public mapPath: string) {}

  public get initialized() {
    return this._initialized;
  }

  public get penalizementAction() {
    return this._penalizementAction.asObservable();
  }

  async init() {
    this.bannedUrlsMap = await readToMap(this.mapPath);
    this.bannedUrlsMap.forEach((v, k) => {
      // Date cannot save as Date (it converts into string, it should be reinitialized. this will be painful)
      v.penaltyExpire = new Date(v.penaltyExpire as any as string);
      // should be timeout again that unheaven ips
      this.setToHappenToHeaven(v);
    });
    this._initialized = true;
  }

  async penalize(ipAddress: string) {
    let urlInstance: ObservingIp;

    if (this.bannedUrlsMap.has(ipAddress)) {
      urlInstance = this.bannedUrlsMap.get(ipAddress)!;
    } else {
      urlInstance = this.newInstance(ipAddress);
    }
    urlInstance.penalized = true;
    urlInstance.penaltyPoint += 1;
    this.setPenaltyExpire(urlInstance);
    this.setToHappenToHeaven(urlInstance);
    this.notifyAndSave(urlInstance);
  }

  private setPenaltyExpire(urlInstance: ObservingIp) {
    const penaltyDurationMs = (5 ^ urlInstance.penaltyPoint) * 1000;
    const expire = new Date(Date.now() + penaltyDurationMs);
    urlInstance.penaltyExpire = expire;
  }

  private newInstance(ipAddress: string) {
    return {
      ipAddress,
      penalized: false,
      penaltyExpire: new Date(),
      penaltyPoint: 0,
    };
  }

  heaven(ipAddress: string, ignorePenaltyPointMax) {
    let urlInstance: ObservingIp;

    if (this.bannedUrlsMap.has(ipAddress)) {
      urlInstance = this.bannedUrlsMap.get(ipAddress)!;
      if (urlInstance.penaltyPoint > 0) {
        urlInstance.penaltyPoint = urlInstance.penaltyPoint - 1;
        this.bannedUrlsMap.set(ipAddress, urlInstance);
        if (!ignorePenaltyPointMax || urlInstance.penaltyPoint > 100) {
          console.info(
            ipAddress +
              ' ceza puanı yüksektir. Şimdilik düşene kadar izin verilmeyecek',
          );
          this.saveMap();
        } else {
          this.notifyAndSave(urlInstance);
        }
      }
    }
  }

  private notifyAndSave(urlInstance: ObservingIp) {
    this._penalizementAction.next(urlInstance);
    this.saveMap();
  }

  async saveMap() {
    await saveToFile(this.bannedUrlsMap, this.mapPath);
  }

  setToHappenToHeaven(urlInstance: ObservingIp) {
    setToHappen(
      urlInstance.ipAddress,
      () => {
        this.heaven(urlInstance.ipAddress, true);
      },
      urlInstance.penaltyExpire,
    );
  }

  async reviewIncoming(ipAddress: string, urlPath: string) {
    if (urlPath == null) urlPath = '';
    if (
      urlPath.includes('bin/sh') ||
      urlPath.includes(encodeURI('bin/sh')) ||
      urlPath.includes('.php') ||
      urlPath.includes('XDEBUG')
    ) {
      console.log(ipAddress + ' şüphelidir. Cezalandırılacak');
      this.penalize(ipAddress);
    } else {
      console.log(ipAddress + ' şüpheli değildir.');
      this.heaven(ipAddress, false);
    }
  }
}
