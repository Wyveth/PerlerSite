import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
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
  //Constante Form
  productForm!: UntypedFormGroup;
  id!: string;
  isAddMode!: boolean;
  dropdownListTags!: Array<{ item_id: string; item_text: string }>;

  dropdownListPerlerTypes!: Array<{ item_id: string; item_text: string }>;

  fileIsUploading = false;
  fileUploaded = false;
  fileUrl!: string;
  fileObject!: FileUpload;

  tags!: any[];
  tagSubscription!: Subscription;
  tagDDL: any[] = [];

  perlerTypes!: any[];
  perlerTypeSubscription!: Subscription;
  perlerTypeDDL: any[] = [];

  urlImg: string = '';

  constructor(
    resources: AppResource,
    private formBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private tagService: TagService,
    private perlerTypeService: PerlerTypeService,
    private filesUploadService: FileUploadService,
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

    // Si édition, récupérer le produit
    if (!this.isAddMode) {
      const product: Product = await this.productService.getProduct(this.id);

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

      this.urlImg = product.pictureUrl || '';
    }
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      titleContent: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      size: ['', Validators.required],
      size_h: ['', Validators.required],
      size_w: ['', Validators.required],
      time: ['', Validators.required],
      time_h: ['', Validators.required],
      time_m: ['', Validators.required],
      date: ['', Validators.required],
      tagsKey: ['', Validators.required],
      perlerTypesKey: ['']
    });

    // Synchroniser size_h + size_w -> size
    this.productForm.get('size_h')?.valueChanges.subscribe(() => this.updateSize());
    this.productForm.get('size_w')?.valueChanges.subscribe(() => this.updateSize());

    // Synchroniser time_h + time_m -> time
    this.productForm.get('time_h')?.valueChanges.subscribe(() => this.updateTime());
    this.productForm.get('time_m')?.valueChanges.subscribe(() => this.updateTime());
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() {
    return this.productForm.controls;
  }

  onSubmitForm() {
    const formValue = this.productForm.value;
    const product = new Product(
      formValue['title'],
      formValue['titleContent'],
      formValue['content'],
      formValue['author'],
      formValue['size'],
      formValue['time'],
      formValue['date']
    );

    if (this.fileUrl && this.fileUrl !== '') {
      product.pictureUrl = this.fileUrl;
      product.file = this.fileObject;
      this.filesUploadService.saveFileData(product.file);
    }

    if (formValue.tagsKey && formValue.tagsKey !== '') {
      product.tagsKey = formValue.tagsKey;
    }

    if (formValue.perlerTypesKey && formValue.perlerTypesKey !== '') {
      product.perlerTypesKey = formValue.perlerTypesKey;
    }

    if (this.isAddMode) {
      this.productService.createProduct(product);
    } else {
      this.productService.updateProduct(this.id, product);
    }

    this.router.navigate(['/products']);
  }

  onUploadFile(file: File) {
    this.fileObject = new FileUpload(file);

    this.fileIsUploading = true;
    this.filesUploadService.pushFileToStorage(this.fileObject).then((url: any) => {
      this.fileUrl = url;
      this.fileIsUploading = false;
      this.fileUploaded = true;
    });
  }

  detectFiles(event: any) {
    this.onUploadFile(event.target.files[0]);
  }

  /* Validation Erreur */
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
  /* Fin Validation Error */
}
