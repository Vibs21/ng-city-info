import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export interface UserData {
  id: number;
  city: string;
  start_date: string;
  end_date: string;
  price: string;
  status: string;
  color: string;
}

// const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//   'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

@Component({
  selector: 'app-city-table',
  templateUrl: './city-table.component.html',
  styleUrls: ['./city-table.component.css']
})
export class CityTableComponent implements OnInit, AfterViewInit {
  displayedColumns = ['city', 'startdate', 'enddate' , 'price', 'status' , 'delete'];
  dataSource: MatTableDataSource<UserData>;
  users: UserData[] = [];
  serverUrl: string;
  isLoading = false;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  constructor(private http: HttpClient) {
    this.serverUrl = environment.serverUrl;
    // Assign the data to the data source for the table to render
    this.getAllCities();
  }

  ngOnInit(): void {
  }

  getAllCities = () => {
    this.isLoading = true;
    this.http
      .get(this.serverUrl + 'cities', {})
      .subscribe((data) => {
        console.log(data);
        // @ts-ignore
        this.dataSource = new MatTableDataSource(data);
        setTimeout(() => {
          console.log('hide');
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }, 100);
      });
  }

  updateCity = () => {
  }

  deleteRecord = id => {
    console.log('city id', id);
    this.http
      .delete(this.serverUrl + 'city/' + id, {})
      .subscribe((data) => {
        console.log(data);
        this.getAllCities();
      });
  }


  applyFilter = () => {
    this.isLoading = true;
    const sDt = this.startDate.year + '-' + this.startDate.month + '-' + this.startDate.day;
    const eDt = this.endDate.year + '-' + this.endDate.month + '-' + this.endDate.day;
    this.http
      .get(this.serverUrl + 'city/' + sDt + '/' + eDt, {})
      .subscribe((data) => {

        // @ts-ignore
        this.dataSource = new MatTableDataSource(data);
        setTimeout(() => {
          console.log('hide');
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }, 200);
      });
  }

}

