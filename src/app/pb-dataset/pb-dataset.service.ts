import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PbDatasetService {
  private whitelistDictionary = {};
  private _whitelist = new BehaviorSubject({});
  public readonly whitelist: Observable<
    object
  > = this._whitelist.asObservable();

  updateWhitelist(item: ContributorItem) {
    this.whitelistDictionary[item.address] = item.whitelist;
    this._whitelist.next(this.whitelistDictionary);
  }

  getWhitelist(): string[] {
    return Object.keys(this.whitelistDictionary);
  }

  getContributors(): ContributorItem[] {
    return CONTRIBUTORS;
  }
}

export interface ContributorItem {
  position?: number;
  address: string;
  balance?: number;
  whitelist?: boolean;
}

const CONTRIBUTORS: ContributorItem[] = [
  {
    address: "0x47c62777fa377e52b275832c01297433a26f83b0",
    balance: 1.0
  },
  {
    address: "0x6284475aced83fa9e1366b8381a16cd75324f947",
    balance: 25.0
  },
  {
    address: "0xe6accd697958c089474a48fcf78eeff63a98b0a1",
    balance: 50.0
  },
  {
    address: "0x638c52b243441bbe5efc70b15f335a604a50b6dc",
    balance: 41.0
  },
  {
    address: "0xae65934d6eeb5f134a096125d94e22fd38ed85dd",
    balance: 30.0
  }
];
