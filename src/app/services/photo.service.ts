import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { signal } from '@angular/core';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos = signal<UserPhoto[]>([]);
  private PHOTO_STORAGE = 'photos';

  // CHANGE: Add the gallery method
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.update((fotos) => [savedImageFile, ...fotos]);
    await this.saveList();
  }

  public async loadSaved() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    const saved = (value ? JSON.parse(value) : []) as UserPhoto[];
    const loaded: UserPhoto[] = [];

    for (const photo of saved) {
      try {
        if (Capacitor.isNativePlatform()) {
          loaded.push({ filepath: photo.filepath, webviewPath: Capacitor.convertFileSrc(photo.filepath) });
        } else {
          const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });
          loaded.push({ filepath: photo.filepath, webviewPath: `data:image/jpeg;base64,${readFile.data}` });
        }
      } catch {
      }
    }

    this.photos.set(loaded);
  }

  public async deletePicture(photo: UserPhoto, position: number) {
    this.photos.update((fotos) => fotos.filter((_, i) => i !== position));
    await this.saveList();

    const filename = photo.filepath.substring(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  private async saveList() {
    const lista = this.photos().map((p) => ({ filepath: p.filepath }));
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(lista),
    });
  }

  private async savePicture(photo: Photo): Promise<UserPhoto> {
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + '.jpeg';

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (Capacitor.isNativePlatform()) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    if (Capacitor.isNativePlatform()) {
      const file = await Filesystem.readFile({ path: photo.path! });
      return file.data as string;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  private convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }
}