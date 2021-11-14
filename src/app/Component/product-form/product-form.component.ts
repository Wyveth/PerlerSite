import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
  loading = false;
  submitted = false;
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
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Aucun tag n\'est disponible'
    };
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      photo: '',
      tagsKey: ['', [Validators.required]]
    });

    if (!this.isAddMode) {
      console.log('EditMode');
      this.productService.getProduct(this.id).then((data: any) => {
        this.productForm.patchValue(data);
      });
    }
  }

  onSubmitForm() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createProduct();
    } else {
      //this.updateUser();
    }
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

  onItemSelect($event: any) {
    console.log('$event is ', $event);
  }

  /*setDefaultSelection() {
    let item = this.getData()[0];
    this.productForm.patchValue({
      tagsKey: [{
        item_id: item['item_id'],
        item_text: item['item_text']
      }]
    })
  }*/

  private createProduct() {
    const formValue = this.productForm.value;
    const newProduct = new Product(
      formValue['title'],
      formValue['author'],
      formValue['content']
    );

    if (this.fileUrl && this.fileUrl !== '') {
      newProduct.pictureUrl = this.fileUrl;
      newProduct.file = this.fileObject;
      this.filesUploadService.saveFileData(newProduct.file);
    }

    if (this.fileUrl && this.fileUrl !== '') {
      newProduct.tagsKey = formValue.tagsKey;
    }

    this.productService.createNewProduct(newProduct);
    this.router.navigate(['/products']);
  }

  private editProduct() {
    const formValue = this.productForm.value;
    const newProduct = new Product(
      formValue['title'],
      formValue['author'],
      formValue['content']
    );

    if (this.fileUrl && this.fileUrl !== '') {
      newProduct.pictureUrl = this.fileUrl;
      newProduct.file = this.fileObject;
      this.filesUploadService.saveFileData(newProduct.file);
    }

    if (this.fileUrl && this.fileUrl !== '') {
      newProduct.tagsKey = formValue.tagsKey;
    }

    this.productService.createNewProduct(newProduct);
    this.router.navigate(['/products']);
  }
}
