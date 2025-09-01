import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest, filter, first, firstValueFrom } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { FileUpload } from 'src/app/api/models/class/file-upload';
import { Product } from 'src/app/api/models/class/product';
import { PerlerTypeService } from 'src/app/api/services/perler-type.service';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { FileUploadService } from 'src/app/api/services/upload-file.service';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { parseTime } from 'src/app/shared/utils/parseTime';
import { parseSize } from 'src/app/shared/utils/parseSize';
import { parseDate } from 'src/app/shared/utils/parseDate';
import { Tag } from 'src/app/api/models/class/tag';
import { PerlerType } from 'src/app/api/models/class/perler-type';
import { severity } from 'src/app/shared/enum/severity';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    InputTextModule,
    MultiSelectModule,
    TextareaModule,
    ButtonModule,
    DatePickerModule,
    FileUploadModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule
  ]
})
export class ProductFormComponent extends BaseComponent implements OnInit {
  productForm!: UntypedFormGroup;
  id!: string;
  isAddMode!: boolean;

  dropdownListTags!: Array<{ item_id: string; item_text: string }>;
  dropdownListPerlerTypes!: Array<{ item_id: string; item_text: string }>;

  uploadedFiles: FileUpload[] = [];
  initialFiles: FileUpload[] = [];

  originalInitialFiles: FileUpload[] = []; // snapshot immuable de départ
  removedInitialKeys = new Set<string>(); // ce que l’utilisateur retire en édition

  constructor(
    resources: AppResource,
    private formBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private tagService: TagService,
    private perlerTypeService: PerlerTypeService,
    private filesUploadService: FileUploadService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(resources);
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    const tags$ = this.tagService.tags$.pipe(
      filter(tags => tags.length > 0),
      first()
    );

    const perlerTypes$ = this.perlerTypeService.perlerTypes$.pipe(
      filter(types => types.length > 0),
      first()
    );

    const [tags, perlerTypes] = await firstValueFrom(combineLatest([tags$, perlerTypes$]));

    this.dropdownListTags = tags.map(tag => ({ item_id: tag.key, item_text: tag.code }));
    this.dropdownListPerlerTypes = perlerTypes.map(pt => ({
      item_id: pt.key,
      item_text: `${pt.reference} - ${pt.libelle}`
    }));

    // Initialiser le formulaire
    this.initForm();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      titleContent: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      size: ['', Validators.required],
      size_h: [0, Validators.required],
      size_w: [0, Validators.required],
      time: ['', Validators.required],
      time_h: [0, Validators.required],
      time_m: [0, Validators.required],
      date: ['', Validators.required],
      tagsKey: [[], Validators.required],
      perlerTypesKey: [[]]
    });

    // Synchroniser size_h + size_w -> size
    this.productForm.get('size_h')?.valueChanges.subscribe(() => this.updateSize());
    this.productForm.get('size_w')?.valueChanges.subscribe(() => this.updateSize());

    // Synchroniser time_h + time_m -> time
    this.productForm.get('time_h')?.valueChanges.subscribe(() => this.updateTime());
    this.productForm.get('time_m')?.valueChanges.subscribe(() => this.updateTime());

    // Si édition, récupérer le produit
    if (!this.isAddMode) {
      this.productService.getProduct(this.id).then((product: Product) => {
        this.productForm.patchValue(product);

        const size = parseSize(product.size);
        this.productForm.patchValue({
          size_h: size.height,
          size_w: size.width
        });

        const time = parseTime(product.time);
        this.productForm.patchValue({
          time_h: time.hours,
          time_m: time.minutes
        });

        this.productForm.patchValue({
          tagsKey: product.tagsKey?.map(tag => tag.item_id),
          perlerTypesKey: product.perlerTypesKey?.map(pt => pt.item_id),
          date: parseDate(product.date)
        });

        if (product.pictureUrl) {
          this.filesUploadService.getFilesUpload(product.pictureUrl).then(files => {
            this.initialFiles = files;
            this.uploadedFiles = files.map(f => ({
              ...f,
              isNew: false
            }));
            // snapshot immuable de départ
            this.originalInitialFiles = [...this.initialFiles];
          });
        }
      });
    }
  }

  // ✅ Sélection des fichiers depuis p-fileUpload
  onFilesSelected(event: any) {
    const files: File[] = Array.isArray(event.currentFiles) ? event.currentFiles : [];
    const newFiles = files
      .filter(f => !this.uploadedFiles.some(uf => uf.file === f))
      .map(file => {
        const fUpload = new FileUpload(file);
        fUpload.name = file.name;
        fUpload.size = file.size.toString();
        fUpload.type = file.type;
        fUpload.isNew = true;
        return fUpload;
      });

    //Si Multiple == true
    this.uploadedFiles.push(...newFiles);
    //Sinon
    //this.uploadedFiles = newFiles;

    // synchroniser avec PrimeNG
    event.currentFiles = [...files];
  }

  onDeleteFile(event: any) {
    // event.file contient le File sélectionné
    const fileToRemove = event.file || event?.rawFile;
    if (!fileToRemove) return;

    // Supprimer de uploadedFiles
    this.uploadedFiles = this.uploadedFiles.filter(f => f.file !== fileToRemove);

    // Supprimer côté PrimeNG
    if (event.currentFiles) {
      event.currentFiles = event.currentFiles.filter((f: File) => f !== fileToRemove);
    }
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() {
    return this.productForm.controls;
  }

  removeExistingFile(file: FileUpload) {
    if (file?.key) this.removedInitialKeys.add(file.key);

    // mise à jour de l’UI (listes visibles)
    this.initialFiles = this.initialFiles.filter(f => f.key !== file.key);
    this.uploadedFiles = this.uploadedFiles.filter(f => f.key !== file.key);
  }

  logFormErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);

      if (control && control.errors) {
        console.error(`❌ Erreur dans le champ "${field}":`, control.errors);
      }
    });
  }

  async onSubmitForm() {
    console.log('🔔 Soumission du formulaire', this.productForm.value);
    if (this.productForm.invalid) {
      // force l’affichage des erreurs
      this.productForm.markAllAsTouched();
      this.logFormErrors(this.productForm);
      return;
    }

    try {
      // 1️⃣ Clés actuelles et initiales
      const currentKeys = this.uploadedFiles
        .filter(f => !f.isNew && !!f.key)
        .map(f => f.key as string);

      // 2️⃣ diff basé sur le SNAPSHOT immuable
      const baselineKeys = this.originalInitialFiles.map(f => f.key as string);
      const deletedByDiff = baselineKeys.filter(k => !currentKeys.includes(k));

      // union: (ce que l’utilisateur a explicitement retiré) U (diff automatique)
      const deletedKeys = Array.from(
        new Set([...Array.from(this.removedInitialKeys), ...deletedByDiff])
      );

      // on prend les objets complets depuis le snapshot (il n’a pas été modifié)
      const filesToDelete = this.originalInitialFiles.filter(f =>
        deletedKeys.includes(f.key as string)
      );

      // 🔥 suppression Firestore + Storage
      await Promise.all(filesToDelete.map(f => this.filesUploadService.deleteFile(f)));

      // 3️⃣ Nouveaux fichiers à uploader
      const newFiles = this.uploadedFiles.filter(f => f.isNew && f.file instanceof File);

      // 🔥 Upload parallèle
      const uploadedFiles: FileUpload[] = await Promise.all(
        newFiles.map(f => this.filesUploadService.pushFileToStorage(f))
      );

      // 4️⃣ Mettre à jour uploadedFiles avec les infos complètes
      uploadedFiles.forEach((uploaded, i) => {
        const f = newFiles[i];
        f.key = uploaded.key;
        f.url = uploaded.url;
        f.name = uploaded.name;
        f.size = uploaded.size;
        f.type = uploaded.type;
        f.isNew = false;
      });

      const formValue = this.productForm.value;

      let date: Date;
      if (formValue.date?.toDate) {
        date = formValue.date.toDate();
      } else {
        date = formValue.date; // déjà une Date JS
      }

      const product = new Product(
        formValue['title'],
        formValue['titleContent'],
        formValue['content'],
        formValue['author'],
        formValue['size'],
        formValue['time'],
        formatDate(date, 'dd/MM/yyyy', 'en')
      );

      if (Array.isArray(formValue.tagsKey) && formValue.tagsKey.length > 0) {
        product.tagsKey = formValue.tagsKey
          .map((key: string) => this.dropdownListTags.find(t => t.item_id === key))
          .filter((tag: Tag) => tag != null); // supprime les tags non trouvés
      } else {
        product.tagsKey = []; // ou undefined selon ton besoin
      }

      if (Array.isArray(formValue.perlerTypesKey) && formValue.perlerTypesKey.length > 0) {
        product.perlerTypesKey = formValue.perlerTypesKey
          .map((key: string) => this.dropdownListPerlerTypes.find(t => t.item_id === key))
          .filter((perlerType: PerlerType) => perlerType != null); // supprime les tags non trouvés
      } else {
        product.perlerTypesKey = []; // ou undefined selon ton besoin
      }

      // pictureUrl uniquement avec des URLs valides
      product.pictureUrl = this.uploadedFiles
        .filter(f => f.url) // prend uniquement les fichiers uploadés
        .map(f => f.url);

      // 6️⃣ Créer ou mettre à jour le Produit
      if (this.isAddMode) {
        this.productService.createProduct(product);
      } else {
        this.productService.updateProduct(this.id, product);
      }
      console.log('✅ Produit synchronisé avec Firebase');

      this.messageService.add({
        severity: severity.success,
        summary: this.resource.generic.success,
        detail: this.isAddMode
          ? this.resource.generic.create_success_m.format(
              this.resource.tag.title.toLowerCase(),
              product.title
            )
          : this.resource.generic.edit_success_m.format(
              this.resource.tag.title.toLowerCase(),
              product.title
            )
      });

      this.router.navigate([this.resource.router.routes.products]);
    } catch (error) {
      this.messageService.add({
        severity: severity.error,
        summary: this.resource.generic.error,
        detail: this.resource.error.default
      });
      console.error('❌ Erreur lors du traitement des fichiers:', error);
    }
  }

  //#region Validation Erreur
  shouldShowTitleError() {
    const title = this.productForm.controls.title;
    return title.touched && title.hasError('required');
  }

  shouldShowTitleContentError() {
    const titleContent = this.productForm.controls.titleContent;
    return titleContent.touched && titleContent.hasError('required');
  }

  shouldShowContentError() {
    const content = this.productForm.controls.content;
    return content.touched && content.hasError('required');
  }

  shouldShowAuthorError() {
    const author = this.productForm.controls.author;
    return author.touched && author.hasError('required');
  }

  shouldShowSizeError() {
    const size = this.productForm.controls.size;
    return size.touched && size.hasError('required');
  }

  shouldShowTimeError() {
    const time = this.productForm.controls.time;
    return time.touched && time.hasError('required');
  }

  shouldShowDateError() {
    const date = this.productForm.controls.date;
    return date.touched && date.hasError('required');
  }

  shouldShowTagsKeyError() {
    const tagsKey = this.productForm.controls.tagsKey;
    return tagsKey.touched && tagsKey.hasError('required');
  }

  shouldShowPerlerTypesKeyError() {
    const tagsKey = this.productForm.controls.tagsKey;
    return tagsKey.touched && tagsKey.hasError('required');
  }
  //#endregion Validation Error

  //#region Utils
  updateSize(): void {
    const hRaw = this.productForm.get('size_h')?.value;
    const wRaw = this.productForm.get('size_w')?.value;
    if (hRaw || wRaw) {
      const h = hRaw ? Number(hRaw).toFixed(1) : '';
      const w = wRaw ? Number(wRaw).toFixed(1) : '';
      this.productForm.get('size')?.setValue(`${h} x ${w}`, { emitEvent: false });
    }
  }

  updateTime(): void {
    const h = this.productForm.get('time_h')?.value;
    const m = this.productForm.get('time_m')?.value;
    if (h || m) {
      let val = '';
      if (h) val += `${h}h`;
      if (m) val += `${m}min`;
      this.productForm.get('time')?.setValue(val, { emitEvent: false });
    }
  }
  //#endregion Utils
}
