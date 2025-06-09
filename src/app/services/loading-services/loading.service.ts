import { Injectable } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingComponent } from 'src/app/utils/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private overlayRef: OverlayRef | null = null;
  loading$: any;

  constructor(private overlay: Overlay) { }

  open() {
    // Ensure that the spinner is not already visible
    if (this.overlayRef) {
      console.warn('Duplicate Loading Request', 'Already Loading...');
      return;
    }

    // Create an overlay with a spinner
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });

    const spinnerPortal = new ComponentPortal(LoadingComponent);
    this.overlayRef.attach(spinnerPortal);
  }

  close() {
    // Close the loading spinner overlay if it's currently open
    if (!this.overlayRef) {
      console.error('Hide loading', 'Not Loading...');
      return;
    }

    setTimeout(() => {
      this.overlayRef?.detach();
      this.overlayRef?.dispose();
      this.overlayRef = null;
    }, 500);
  }
}
