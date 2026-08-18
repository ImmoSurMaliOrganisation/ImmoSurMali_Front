import { Component } from '@angular/core';

@Component({
  selector: 'app-property-card-skeleton',
  template: `
    <div
      class="bg-card-bg border border-border rounded-[2rem] md:rounded-3xl overflow-hidden animate-pulse"
    >
      <!-- Image Skeleton (avec la même marge m-2/m-3) -->
      <div
        class="h-48 md:h-64 m-2 md:m-3 bg-gray-200 dark:bg-neutral-800 rounded-[1.5rem] md:rounded-2xl"
      ></div>

      <div class="px-4 pb-4 pt-1 md:pt-2 space-y-4">
        <!-- Header Skeleton -->
        <div class="flex justify-between items-start">
          <div class="space-y-2 w-1/2">
            <div class="h-2 w-12 bg-gray-200 dark:bg-neutral-800 rounded"></div>
            <div class="h-5 w-full bg-gray-200 dark:bg-neutral-800 rounded-lg"></div>
            <div class="h-3 w-20 bg-gray-200 dark:bg-neutral-800 rounded"></div>
          </div>
          <div class="space-y-2 w-1/4">
            <div class="h-2 w-10 ml-auto bg-gray-200 dark:bg-neutral-800 rounded"></div>
            <div class="h-5 w-full bg-gray-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
        </div>

        <!-- Specs Grid Skeleton -->
        <div
          class="grid grid-cols-3 gap-2 bg-gray-50/50 dark:bg-neutral-900/50 p-3 rounded-2xl border border-border/40"
        >
          <div class="h-8 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
          <div class="h-8 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
          <div class="h-8 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  `,
})
export class PropertyCardSkeleton {}
