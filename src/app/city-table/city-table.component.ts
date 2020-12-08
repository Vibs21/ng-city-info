import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface UserData {
  id: number;
  city: string;
  start_date: string;
  end_date: string;
  price: string;
  status: string;
  color: string;
}

@Component({
  selector: 'app-city-table',
  templateUrl: './city-table.component.html',
  styleUrls: ['./city-table.component.css']
})
export class CityTableComponent implements OnInit {
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

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
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
          this.openSnackBar('All cities successfully fetched!');
        }, 100);
      }, () => {
        this.isLoading = false;
        this.openSnackBar('Something went wrong!');
      });
  }

  updateCity = (id: string, city: any) => {
    this.http
      .put(this.serverUrl + 'city/' + id, {
        city
      })
      .subscribe((data) => {
        // @ts-ignore
        this.dataSource = new MatTableDataSource(data);
        setTimeout(() => {
          console.log('hide');
          this.getAllCities();
          this.isLoading = false;
        }, 200);
      }, err => {
        this.isLoading = false;
      });
  }

  deleteRecord = id => {
    console.log('city id', id);
    this.http
      .delete(this.serverUrl + 'city/' + id, {})
      .subscribe((data) => {
        console.log(data);
        this.openSnackBar('Record with id: ' + id + ' deleted successfully');
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
          this.openSnackBar('Filter applied successfully!');
        }, 200);
      }, err => {
        this.isLoading = false;
        this.openSnackBar('Something went wrong!');
      });
  }

  openSnackBar = (message: string) => {
    this.snackBar.open(message, 'dismiss', {
      duration: 4000
    });
  }

}

