import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { UserGetManyResponse, UserResponse } from '../../user.model';
import { UserService } from '../../user.service';
import { merge, Observable, of as observableOf } from 'rxjs';
import { environment } from '@environments/environment';
import { DefaultPageSizeOptions } from '@shared/constants/page.constants';

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements AfterViewInit {
    displayedColumns: string[] = [
        'name',
        'email',
        'global',
        'status',
        'lastLogin',
        'menu',
    ];
    data: UserResponse[];

    public pageSize = environment.tablePageSize;
    pageSizeOptions = DefaultPageSizeOptions;
    resultsLength = 0;
    isLoadingResults = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() permissionId?: number;
    @Input() canSort = true;

    constructor(
        public translate: TranslateService,
        private userService: UserService
    ) {}

    getUsers(
        orderByColumn: string,
        orderByDirection: string
    ): Observable<UserGetManyResponse> {
        return this.userService.getMultiple(
            this.paginator.pageSize,
            this.paginator.pageIndex * this.paginator.pageSize,
            orderByColumn,
            orderByDirection,
            this.permissionId
        );
    }

    ngAfterViewInit() {
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.getUsers(this.sort.active, this.sort.direction);
                }),
                map((data) => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    this.resultsLength = data.count;

                    return data.data;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    return observableOf([]);
                })
            )
            .subscribe((data) => (this.data = data));
    }
}
