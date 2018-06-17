import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import {
  ContributorItem,
  PbDatasetService
} from "../pb-dataset/pb-dataset.service";

import Identicon from "identicon.js";

@Component({
  selector: "pb-contributors",
  templateUrl: "./pb-contributors.component.html",
  styleUrls: ["./pb-contributors.component.css"]
})
export class PbContributorsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<ContributorItem>;

  displayedColumns = [
    "position",
    "identicon",
    "address",
    "balance",
    "whitelist"
  ];

  filter = {
    ALL: "all",
    WHITELISTED: "whitelisted",
    BLACKLISTED: "blacklisted"
  };

  filterValue: string = "";
  filterType: string = this.filter.ALL;

  constructor(private dataService: PbDatasetService) {
    const contributors = dataService.getContributors().map((c, i) => ({
      ...c,
      position: i + 1,
      identicon: new Identicon(c.address.padEnd(15), {
        size: 24,
        background: [255, 255, 255, 0]
      }).toString()
    }));

    this.dataSource = new MatTableDataSource(contributors);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // custom sorting function
    this.dataSource.filterPredicate = (
      item: ContributorItem,
      filter: string
    ) => {
      // we always get the filter text and the visivility filter (all, whitelisted, blacklisted)
      let [text, type] = filter.split(FILTER_SEPARATOR);
      return (
        item.address.indexOf(text) !== -1 &&
        (type === this.filter.ALL ||
          (type === this.filter.WHITELISTED && item.whitelist) ||
          (type === this.filter.BLACKLISTED && !item.whitelist))
      );
    };

    this.dataService.whitelist.subscribe(updatedWhitelist => {
      this.dataSource.data = this.dataSource.data.map(item => ({
        ...item,
        whitelist: updatedWhitelist[item.address]
      }));
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue + FILTER_SEPARATOR + this.filterType;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleWhitelist(row: ContributorItem) {
    row.whitelist = !row.whitelist;
    this.dataService.updateWhitelist(row);
  }

  setFilterType(type: string) {
    this.filterType = type;
    this.applyFilter(this.filterValue);
  }

  getTotalBalance() {
    return this.dataSource.filteredData
      .map(t => t.balance)
      .reduce((acc, value) => acc + value, 0);
  }
}

const FILTER_SEPARATOR = "\n";
