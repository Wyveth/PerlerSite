import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
import { Tag } from 'src/app/Shared/Models/Tag.Model';
import { TagService } from 'src/app/Shared/Services/tag.service';

@Component({
    selector: 'app-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
    standalone: true,
    imports: [CommonModule, BreadcrumbsComponent]
})
export class TagListComponent implements OnInit {
  tags!: any[];
  tagSubscription!: Subscription;

  constructor(private tagService: TagService, private router: Router) { }

  ngOnInit() {
    this.tagSubscription = this.tagService.tagsSubject.subscribe(
      (tags: any[]) => {
        this.tags = tags;
      }
    );
    this.tagService.emitTags();
  }

  onNewTag() {
    this.router.navigate(['/tags', 'new']);
  }

  onEditTag(key: string) {
    this.router.navigate(['/tags', 'edit', key]);
  }

  onDeleteTag(tag: Tag) {
    this.tagService.removeTag(tag);
  }

  ngOnDestroy() {
    this.tagSubscription.unsubscribe();
  }
}
