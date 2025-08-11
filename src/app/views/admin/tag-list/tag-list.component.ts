import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { TagService } from 'src/app/api/services/tag.service';
import { Tag } from 'src/app/api/models/class/tag';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
})
export class TagListComponent implements OnInit {
  tags!: any[];
  tagSubscription!: Subscription;

  constructor(
    private tagService: TagService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tagSubscription = this.tagService.tagsSubject.subscribe((tags: any[]) => {
      this.tags = tags;
    });
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
