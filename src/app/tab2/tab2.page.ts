import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
// CHANGE: Import the Ionic standalone components used on this page
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular';
import { IonText, ActionSheetController } from '@ionic/angular';
// CHANGE: Register the camera icon used by the FAB
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { trash, close } from 'ionicons/icons';
// CHANGE: Import the PhotoService
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  // CHANGE: Add the standalone component imports
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,
    IonGrid, IonRow, IonCol, IonText],
})
export class Tab2Page implements OnInit {
  // CHANGE: Inject the PhotoService
  public photoService = inject(PhotoService);
  private actionSheetController = inject(ActionSheetController);

  constructor() {
    // CHANGE: Register the icons this page uses
    addIcons({ camera });
    addIcons({ trash, close });
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  // CHANGE: Add `addPhotoToGallery()` method
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}