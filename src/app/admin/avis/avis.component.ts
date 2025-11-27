import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements OnInit {

  constructor(private firestore: FirestoreService, private formBuilder: FormBuilder) { }
  cards: any[];
  numberReviews;
  hasChanges = false;
  isSaving = false;
  
  reviewForm = this.formBuilder.group({
    author: '',
    review: '',
    rate: ''
  });

  numberForm = this.formBuilder.group({
    newNumberReviews: ''
  })


  ngOnInit(): void {
    this.firestore.getFirestoreCollection('avis').subscribe(data =>
      this.cards = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as any
        }
      }));
    setTimeout(() => {
      this.cards.sort(function (a, b) {
        return a.id - b.id;
      });;
    },
      1500);

    this.firestore.getFirestoreCollection('numberReviews').subscribe(data =>
      this.numberReviews = data.map(e => {
        return {
          ...e.payload.doc.data() as any
        }
      }));
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
      // Mettre à jour les IDs en fonction de la nouvelle position
      this.cards.forEach((card, index) => {
        card.id = index;
      });
      this.hasChanges = true;
    }
  }

  save() {
    this.isSaving = true;
    this.firestore.createAvis(this.cards);
    setTimeout(() => {
      this.cards.sort((a, b) => a.id - b.id);
      this.isSaving = false;
      this.hasChanges = false;
    }, 1500);
  }

  resetOrder() {
    this.cards.sort((a, b) => a.id - b.id);
    this.hasChanges = false;
  }

  onSubmitReview(): void {
    this.firestore.addReview(this.reviewForm.value.author, this.reviewForm.value.rate, this.reviewForm.value.review, this.cards.length);
    this.reviewForm.reset();
    setTimeout(() => {
      this.cards.sort((a, b) => a.id - b.id);
    }, 1500);
  }

  onSubmitNumber(){
    let newNumber : any =  {
      number: this.numberForm.value.newNumberReviews
    }
    this.firestore.updateNumberReviews(newNumber);
    this.numberForm.reset();
  }

  deleteReview(index: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.firestore.deleteReview(index, this.cards.length);
      setTimeout(() => {
        this.cards.sort((a, b) => a.id - b.id);
      }, 1500);
    }
  }





}
