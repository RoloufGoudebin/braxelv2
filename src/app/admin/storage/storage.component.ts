import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from "@angular/fire/storage";
import { finalize, map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  uploadState: Observable<string>;
  downloadURL: Observable<string>;
  files: any[];
  carousel: any[];
  chosen= -1;
  toChange: any;


  constructor(private afStorage: AngularFireStorage, private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.firestore.getFirestoreCollection('home-carousel').subscribe(data =>
      this.carousel = data.map(e => {
        return {
          ...e.payload.doc.data() as any
        }
      }));

    this.firestore.getFirestoreCollection('files').subscribe(data =>
      this.files = data.map(e => {
        return {
          ...e.payload.doc.data() as any
        }
      }));


  }

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          const file = {
            "name": id,
            "url": url
          };
          this.firestore.addFileRef(file);
        });
      })
    ).subscribe();
  }

  chose(i: number){
    this.toChange = this.files[i];
    this.chosen = i ;
  }

  save(i : number){
    this.firestore.choseCarousel(this.toChange, i);
  }

  delete(){
    this.firestore.deleteFile(this.toChange);
  }


}
