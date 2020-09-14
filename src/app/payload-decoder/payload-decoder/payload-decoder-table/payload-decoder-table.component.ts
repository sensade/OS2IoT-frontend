import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Sort } from 'src/app/models/sort';
import { PayloadDecoder } from 'src/app/payload-decoder/payload-decoder.model';
import { Subscription } from 'rxjs';
import * as fromApp from '../../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { PayloadDecoderService } from 'src/app/shared/services/payload-decoder.service';

@Component({
  selector: 'app-payload-decoder-table',
  templateUrl: './payload-decoder-table.component.html',
  styleUrls: ['./payload-decoder-table.component.scss']
})
export class PayloadDecoderTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() pageLimit: number;
  @Input() selectedSortObject: Sort;
  public payloadDecoders: PayloadDecoder[];
  public pageOffset = 0;
  public pageTotal: number;
  subscription: Subscription;

  private payloaddecordersSubscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private payloadDecoderService: PayloadDecoderService
  ) { }

  ngOnInit(): void {
    this.getPayloadDecoders();
    /* this.subscription = this.store
      .select('payloadDecoders')
      .pipe(map(payloadDecoderState => payloadDecoderState.payloadDecoders))
      .subscribe((payloadDecoders: PayloadDecoder[]) => {
        this.payloadDecoders = payloadDecoders;
      }); */
  }

  getPayloadDecoders() {
    this.subscription =  this.payloadDecoderService.getMultiple()
      .subscribe(
        (response) => {
        this.payloadDecoders = response.data;
    });
  }

  ngOnChanges() {
    this.getPayloadDecoders();
  }

  deletePayloadDecoder(id: number) {
    console.log('delete:', id);
    this.payloadDecoderService.delete(id).subscribe((response) => {
      if (response.ok) {
        this.getPayloadDecoders();
      }
    });
  }

  prevPage() {
      if (this.pageOffset) { this.pageOffset--; }
      this.getPayloadDecoders();
  }

  nextPage() {
      if (this.pageOffset < this.pageTotal) { this.pageOffset++; }
      this.getPayloadDecoders();
  }

  ngOnDestroy() {
      // prevent memory leak by unsubscribing
      if (this.payloaddecordersSubscription) {
          this.payloaddecordersSubscription.unsubscribe();
      }
  }

}
