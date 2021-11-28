import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileUpload } from 'src/app/Shared/Models/FileUpload.Model';
import { Product } from 'src/app/Shared/Models/Product.Model';
import { ProductService } from 'src/app/Shared/Services/product.service';
import { TagService } from 'src/app/Shared/Services/tag.service';
import { FileUploadService } from 'src/app/Shared/Services/UploadFile.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})

export class ProductFormComponent implements OnInit {
  //Constante Form
  productForm!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  dropdownList!: Array<{ key: string, code: string }>;
  dropdownSettings: any;
  fileIsUploading = false;
  fileUploaded = false;
  fileUrl!: string;
  fileObject!: FileUpload;

  tags!: any[];
  tagSubscription!: Subscription;
  tagDDL: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private productService: ProductService,
    private tagService: TagService,
    private filesUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.tagSubscription = this.tagService.tagsSubject.subscribe(
      (tags: any[]) => {
        this.tags = tags;
        this.tags.forEach(item => {
          this.tagDDL.push({ item_id: item.key, item_text: item.code });
          this.dropdownList = this.tagDDL;
        });
      }
    );
    this.tagService.emitTags();

    this.initForm();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'Tout désélectionner',
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Aucun tag n\'est disponible'
    };
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      titleContent: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      size: ['', Validators.required],
      time: ['', Validators.required],
      date: ['', Validators.required],
      tagsKey: ['', Validators.required]
    });

    if (!this.isAddMode) {
      this.productService.getProduct(this.id).then((data: any) => {
        this.productForm.patchValue(data);
      });
    }
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() { return this.productForm.controls; }

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
    }
    );
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
  /* Fin Validation Error */
}
