// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Injectable({
//   providedIn: 'root'
// })
// export class SnackBarService {
//   constructor(private snackBar: MatSnackBar) { }
//   private snackBarRef: any;

//   showSnackBar(message: string, duration: number = 3000) {
//     if (this.snackBarRef) {
//       console.warn("Duplicate Snack-Bar Request", "Already showing a snack-bar, if you want to show new snack-bar then use 'forceShow()' before calling showSnackbar");
//       return; // If there is already a snack-bar
//     }

//     //Implement logic to show snackBarRef snack-bar
//     this.snackBar.open(message, undefined, {
//       duration: duration,
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> | null = null;

  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message: string, duration: number = 3000, panelClass: string[] = []) {
    if (this.snackBarRef) {
      console.warn("Duplicate Snack-Bar Request", "Already showing a snack-bar. Use 'forceShow()' before calling showSnackBar again.");
      return;
    }

    this.snackBarRef = this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: panelClass
    });

    this.snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarRef = null;
    });
  }

  forceShow(message: string, duration: number = 3000, panelClass: string[] = []) {
    this.snackBarRef?.dismiss();
    this.snackBarRef = this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: panelClass
    });

    this.snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarRef = null;
    });
  }
}

