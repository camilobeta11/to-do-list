import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonIcon,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, add, create, trash, colorPalette } from 'ionicons/icons';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../interfaces/all-task.interface';

@Component({
  selector: 'app-manage-categories-modal',
  templateUrl: './manage-categories-modal.component.html',
  styleUrls: ['./manage-categories-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonIcon,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
  ],
})
export class ManageCategoriesModalComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  categoryForm!: FormGroup;
  editingCategoryId: string | null = null;
  private categoriesSubscription?: Subscription;

  readonly colorPalette = [
    '#3880ff', '#3dc2ff', '#5260ff', '#2dd36f', '#ffc409',
    '#eb445a', '#92949c', '#f4f5f8', '#222428', '#ffffff'
  ];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private categoriesService: CategoriesService,
    private alertController: AlertController
  ) {
    addIcons({ close, add, create, trash, colorPalette });
    this.initializeForm();
  }

  ngOnInit() {
    this.categoriesSubscription = this.categoriesService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy() {
    this.categoriesSubscription?.unsubscribe();
  }

  private initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      color: ['#3880ff', Validators.required]
    });
  }

  async addCategory(): Promise<void> {
    if (this.categoryForm.valid) {
      try {
        const formValue = this.categoryForm.value;
        const newCategory: Category = {
          id: Date.now().toString(),
          name: formValue.name.trim(),
          color: formValue.color
        };
        
        await this.categoriesService.addCategory(newCategory);
        this.categoryForm.reset({ color: '#3880ff' });
      } catch (error: any) {
        await this.showError(error.message || 'Error al agregar la categoría');
      }
    } else {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
    }
  }

  startEdit(category: Category): void {
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      color: category.color
    });
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.categoryForm.reset({ color: '#3880ff' });
  }

  async saveEdit(): Promise<void> {
    if (this.categoryForm.valid && this.editingCategoryId) {
      try {
        const formValue = this.categoryForm.value;
        await this.categoriesService.updateCategory(this.editingCategoryId, {
          name: formValue.name.trim(),
          color: formValue.color
        });
        this.cancelEdit();
      } catch (error: any) {
        await this.showError(error.message || 'Error al actualizar la categoría');
      }
    }
  }

  async deleteCategory(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la categoría "${category.name}"? Las tareas asociadas quedarán sin categoría.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.categoriesService.deleteCategory(category.id);
            } catch (error: any) {
              await this.showError(error.message || 'Error al eliminar la categoría');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  private async showError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  hasError(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}

