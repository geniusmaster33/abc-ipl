import { Pipe, PipeTransform } from '@angular/core';
import { Leader } from './../leader-board/leader';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(items: Leader[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;

        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.name.toLowerCase().includes(searchText);
        });
    }
}