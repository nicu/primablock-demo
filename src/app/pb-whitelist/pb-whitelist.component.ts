import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_CHIPS_DEFAULT_OPTIONS
} from "@angular/material";

import {
  PbDatasetService,
  ContributorItem
} from "../pb-dataset/pb-dataset.service";

@Component({
  selector: "pb-whitelist",
  templateUrl: "./pb-whitelist.component.html",
  styleUrls: ["./pb-whitelist.component.css"]
})
export class PbWhitelistComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<ContributorItem>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["position", "address", "whitelist"];

  constructor(private dataService: PbDatasetService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataService.whitelist.subscribe(updatedWhitelist => {
      this.dataSource.data = Object.keys(updatedWhitelist)
        .filter(key => updatedWhitelist[key])
        .map((key, i) => ({
          position: i + 1,
          address: key,
          whitelist: updatedWhitelist[key]
        }));
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(PbWhitelistDialog, {
      width: "350px",
      data: {
        address: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result
          .split(",")
          .forEach(val =>
            this.dataService.updateWhitelist({ address: val, whitelist: true })
          );
      }
    });
  }

  toggleWhitelist(row: ContributorItem) {
    row.whitelist = !row.whitelist;
    this.dataService.updateWhitelist(row);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

@Component({
  selector: "pb-whitelist-dialog",
  templateUrl: "./pb-whitelist-dialog.html",
  styleUrls: ["./pb-whitelist-dialog.css"]
})
export class PbWhitelistDialog {
  constructor(
    public dialogRef: MatDialogRef<PbWhitelistDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
